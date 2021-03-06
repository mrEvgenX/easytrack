from django.urls import path
from .views import (
    telegram_webhook,
    generate_telegram_connection_link,
    get_telegram_connection_status,
    send_test_message,
    detach_telegram_account,
    NotificationSetting,
    NotificationSettingCreate
)


app_name = 'telegram'
urlpatterns = [
    path('webhook/<token>', telegram_webhook, name='webhook'),
    path('connection/generate_link', generate_telegram_connection_link, name='generate_telegram_connection_link'),
    path('connection/status', get_telegram_connection_status, name='get_telegram_connection_status'),
    path('connection/detach', detach_telegram_account, name='detach_telegram_account'),
    path('test_message/send', send_test_message, name='send_test_message'),
    path('notifications/<int:pk>', NotificationSetting.as_view(), name='notification_detail'),
    path('notifications', NotificationSettingCreate.as_view(), name='notifications_list'),
]
