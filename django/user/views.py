from django.conf import settings
from django.contrib.auth.models import User
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_text
from django.core.mail import EmailMultiAlternatives
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.shortcuts import redirect
from rest_framework import permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import CreateUserSerializer
from .tokens import account_activation_token


class RegistrationView(generics.CreateAPIView):
    permission_classes = [ permissions.AllowAny ]
    model = User
    serializer_class = CreateUserSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        user_id = urlsafe_base64_encode(force_bytes(user.pk))
        token = account_activation_token.make_token(user)
        email_user = settings.EMAIL_HOST_USER
        subject, from_email, to = 'Easy Track - Подтверждение регистрации', email_user, user.email
        text_content = render_to_string('confirmation_email.html', {'user': user, 'user_id': user_id, 'token': token})
        html_content = render_to_string('confirmation_email_html.html', {'user': user, 'user_id': user_id, 'token': token})
        msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
        msg.attach_alternative(html_content, "text/html")
        msg.send()


class ConfirmationView(APIView):
    permission_classes = [ permissions.AllowAny ]

    def get(self, request, user_id, token):
        try:
            user_pk = force_text(urlsafe_base64_decode(user_id))
            user = User.objects.get(pk=user_pk)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist) as e:
            user = None
        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({'success': 'User activated'})
        else:
            return Response({'error': 'User does not exist or token invalid'}, status=404)
