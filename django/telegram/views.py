import requests
import logging
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
from rest_framework.response import Response
from .serializers import TelegramUpdateSerializer


log = logging.getLogger('telegram')


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def telegram_webhook(request):
    log.debug('Raw request data %s', request.data)
    telegram_update_serializer = TelegramUpdateSerializer(data=request.data)
    if not settings.TELEGRAM_BOT_TOKEN:
        return Response({'error': 'No bot token specified'}, status=200)
    if telegram_update_serializer.is_valid():
        telegram_update = telegram_update_serializer.validated_data
        log.info('Deserialized telegram update data %s', telegram_update)
        r = requests.post(
            'https://api.telegram.org/bot{}/sendMessage'.format(settings.TELEGRAM_BOT_TOKEN),
            json={
                "chat_id": telegram_update['message']['chat']['id'],
                "text": "Могу только сказать привет!:)"
            },
        )
        data = r.json()
        if r.status_code == 200 and data['ok']:
            return Response()
        else:
            Response(data, status=r.status_code)
    else:
        logging.error(telegram_update_serializer.errors)
        return Response(status=200)
