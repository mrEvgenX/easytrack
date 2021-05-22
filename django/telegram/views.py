import logging
import string
import random
from datetime import datetime, date, timedelta
from django.conf import settings
from django.core.cache import caches
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
from rest_framework.response import Response
from core.models import Item
from .serializers import TelegramUpdateSerializer, TelegramNotificationSettingSerializer
from .models import TelegramProfile, ItemTelegramNotificationSetting
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
    if not settings.TELEGRAM_BOT_TOKEN:
        return Response({'error': 'No bot token specified'}, status=200)
    if token != settings.TELEGRAM_BOT_TOKEN:
        log.warning('Someone specified wrong token %s', token)
        return Response(status=403)
    log.debug('Raw request data %s', request.data)
    telegram_update_serializer = TelegramUpdateSerializer(data=request.data)
    if telegram_update_serializer.is_valid():
        telegram_update = telegram_update_serializer.validated_data
        log.info('Deserialized telegram update data %s', telegram_update)
        result = tgdp.dispatch(telegram_update)
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


class NotificationSetting(APIView):

    def get(self, request, pk):
        try:
            item_owner = Item.objects.get(pk=pk).owner
            if item_owner.id != request.user.id:
                return Response(status=404)
            ins = ItemTelegramNotificationSetting.objects.get(item_id=pk)
            notification_time = (datetime.combine(date.today(), ins.mo) + timedelta(hours=7)).time()
            return Response({'notification_time': notification_time.isoformat()})
        except Item.DoesNotExist:
            return Response(status=404)
        except ItemTelegramNotificationSetting.DoesNotExist:
            return Response(status=404)

    def delete(self, request, pk):
        try:
            item_owner = Item.objects.get(pk=pk).owner
            if item_owner.id != request.user.id:
                return Response(status=404)
            ins = ItemTelegramNotificationSetting.objects.get(item_id=pk)
            ins.delete()
            return Response()
        except Item.DoesNotExist:
            return Response(status=404)
        except ItemTelegramNotificationSetting.DoesNotExist:
            return Response(status=404)


class NotificationSettingCreate(APIView):

    def post(self, request):
        log.info('creating a new notification!')
        try:
            log.info(request.data)
            notification_setting_serializer = TelegramNotificationSettingSerializer(data=request.data)
            if notification_setting_serializer.is_valid():
                notification_setting = notification_setting_serializer.validated_data
                notification_setting['notification_time'] = (
                        datetime.combine(
                            date.today(),
                            notification_setting['notification_time']
                        )
                        -
                        timedelta(hours=7)
                ).time()
                try:
                    item_owner = Item.objects.get(pk=notification_setting['item_id']).owner
                except Item.DoesNotExist:
                    return Response(status=404)
                if item_owner.id != request.user.id:
                    return Response(status=404)
                ItemTelegramNotificationSetting(
                    item_id=notification_setting['item_id'],
                    mo=notification_setting['notification_time'],
                    tu=notification_setting['notification_time'],
                    we=notification_setting['notification_time'],
                    th=notification_setting['notification_time'],
                    fr=notification_setting['notification_time'],
                    sa=notification_setting['notification_time'],
                    su=notification_setting['notification_time'],
                ).save()
                return Response(status=201)
            log.error(notification_setting_serializer.errors)
            return Response(notification_setting_serializer.errors, status=400)
        except:
            log.exception('Error creating a notification for item')
            return Response(status=400)
