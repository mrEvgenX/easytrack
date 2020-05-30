from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import CreateUserSerializer
from rest_framework import permissions


class RegistrationView(generics.CreateAPIView):
    permission_classes = [ permissions.AllowAny ]
    model = User
    serializer_class = CreateUserSerializer
