from django.db import models
from django.conf import settings
from core.models import Item


class TelegramProfile(models.Model):
    user = models.OneToOneField(to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE, primary_key=True)
    chat_id = models.IntegerField(unique=True)
    telegram_username = models.CharField(max_length=128)


class ItemTelegramNotificationSetting(models.Model):
    item = models.OneToOneField(to=Item, on_delete=models.CASCADE, related_name='notification_setting')
    mo = models.TimeField(null=True, blank=True)
    tu = models.TimeField(null=True, blank=True)
    we = models.TimeField(null=True, blank=True)
    th = models.TimeField(null=True, blank=True)
    fr = models.TimeField(null=True, blank=True)
    sa = models.TimeField(null=True, blank=True)
    su = models.TimeField(null=True, blank=True)
