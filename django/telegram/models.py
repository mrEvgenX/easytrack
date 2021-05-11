from django.db import models
from django.conf import settings


class TelegramProfile(models.Model):
    user = models.OneToOneField(to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE, primary_key=True)
    chat_id = models.IntegerField(unique=True)
    telegram_username = models.CharField(max_length=128)
