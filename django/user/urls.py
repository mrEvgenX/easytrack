from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegistrationView


app_name = 'user'
urlpatterns = [
    path('token/obtain', TokenObtainPairView.as_view(), name='obtain_token'),
    path('token/refresh', TokenRefreshView.as_view(), name='refresh_token'),
    path('register', RegistrationView.as_view(), name='register')
]
