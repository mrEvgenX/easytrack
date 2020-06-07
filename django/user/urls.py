from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.contrib.auth.models import User
from .views import RegistrationView, ConfirmationView


app_name = 'user'
urlpatterns = [
    path('token/obtain', TokenObtainPairView.as_view(), name='obtain_token'),
    path('token/refresh', TokenRefreshView.as_view(), name='refresh_token'),
    path('register', RegistrationView.as_view(), name='register'),
    path('confirm/<user_id>/<token>', ConfirmationView.as_view(), name='confirm'),
]
