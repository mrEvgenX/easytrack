import logging
import string
import random
from django.conf import settings
from django.core.cache import caches
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
from rest_framework.response import Response
from .serializers import TelegramUpdateSerializer
from .models import TelegramProfile
from .bot_api import TelegramClient, TelegramBotDispatcher


log = logging.getLogger('telegram')
client = TelegramClient(settings.TELEGRAM_BOT_TOKEN)
tgdp = TelegramBotDispatcher()


def generate_random_token(length):
    return ''.join(
        [random.choice(string.ascii_letters + string.digits)
        for i in range(length)]
    )


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def telegram_webhook(request, token):
    if token != settings.TELEGRAM_BOT_TOKEN:
        log.warning('Someone specified wrong token %s', token)
        return Response(status=403)
    log.debug('Raw request data %s', request.data)
    telegram_update_serializer = TelegramUpdateSerializer(data=request.data)
    if not settings.TELEGRAM_BOT_TOKEN:
        return Response({'error': 'No bot token specified'}, status=200)
    if telegram_update_serializer.is_valid():
        telegram_update = telegram_update_serializer.validated_data
        log.info('Deserialized telegram update data %s', telegram_update)
        result = tgdp.dispatch(client, telegram_update)
        return Response(result)
    else:
        log.error('Bad request data %s', telegram_update_serializer.errors)
        return Response()


@api_view(['GET'])
def get_telegram_connection_status(request):
    try:
        existing_telegram_profile = TelegramProfile.objects.get(user=request.user)
        return Response({
            'connected': True,
            'telegram_username': existing_telegram_profile.telegram_username,
            'telegram_connection_link': None,
        })
    except TelegramProfile.DoesNotExist:
        attachment_code = caches['user_to_telegram_code'].get(request.user.pk)
        attachment_link = 'https://t.me/easytrackhabit_bot?start={}'.format(attachment_code) \
            if attachment_code else None
        return Response({
            'connected': False,
            'telegram_username': None,
            'telegram_connection_link': attachment_link,
        })


@api_view(['POST'])
def generate_telegram_connection_link(request):
    try:
        TelegramProfile.objects.get(user=request.user)
        return Response(status=400)
    except TelegramProfile.DoesNotExist:
        pass
    user_id = request.user.pk
    attachment_code = caches['user_to_telegram_code'].get(user_id)
    if not attachment_code:
        attachment_code = generate_random_token(20)
        caches['user_to_telegram_code'].set(user_id, attachment_code)
        caches['telegram_code_to_user'].set(attachment_code, user_id)
    return Response({'result': 'https://t.me/easytrackhabit_bot?start={}'.format(attachment_code)})


@api_view(['POST'])
def detach_telegram_account(request):
    try:
        telegram_profile = TelegramProfile.objects.get(user=request.user)
        chat_id = telegram_profile.chat_id
        username = request.user.username
        telegram_profile.delete()
        client.send_message(
            chat_id,
            'Привязка данного телеграм-аккаунта к профилю Easy Track с логином {} успешно отменена.'.format(username)
        )
        return Response()
    except TelegramProfile.DoesNotExist:
        return Response(status=400)


# TODO user rate limiter
@api_view(['POST'])
def send_test_message(request):
    try:
        telegram_profile = TelegramProfile.objects.get(user=request.user)
        client.send_message(telegram_profile.chat_id, 'Ваш профиль на EasyTrack успешно привязан к вашему телеграм-аккаунту')
        return Response()
    except TelegramProfile.DoesNotExist:
        return Response(status=400)
