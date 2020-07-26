import os
from django.conf import settings
from django.contrib.auth.models import User
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_text
from django.core.mail import EmailMultiAlternatives
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.shortcuts import redirect
from django.db.utils import IntegrityError
from smtplib import SMTPDataError
from rest_framework import permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.exceptions import APIException
from .serializers import CreateUserSerializer
from .tokens import account_activation_token
import logging


class UserAlreadyExistsError(APIException):
    status_code = 400
    default_detail = 'User with this email is already exists.'
    default_code = 'Bad request'


class EmailNotVerifiedInAWSSESError(APIException):
    status_code = 400
    default_detail = 'Email address is not verified in AWS SES.'
    default_code = 'Bad request'


class RegistrationView(generics.CreateAPIView):
    permission_classes = [ permissions.AllowAny ]
    model = User
    serializer_class = CreateUserSerializer

    def perform_create(self, serializer):
        try:
            user = serializer.save()
        except IntegrityError:
            raise UserAlreadyExistsError()
        # TODO сделать как-то в транзакции, если письмо не удалось отправить, то не создавать пользователя
        user_id = urlsafe_base64_encode(force_bytes(user.pk))
        token = account_activation_token.make_token(user)
        host = os.getenv('DJANGO_ALLOWED_HOSTS', 'localhost:3000')  # TODO как-то по-другому внедрять нужную информацию о домене
        try:
            subject, from_email, to = 'Easy Track - Подтверждение регистрации', settings.EMAIL_FROM, user.email
            text_content = render_to_string('confirmation_email.html', {'host': host, 'user': user, 'user_id': user_id, 'token': token})
            html_content = render_to_string('confirmation_email_html.html', {'host': host, 'user': user, 'user_id': user_id, 'token': token})
            msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
            msg.attach_alternative(html_content, "text/html")
            msg.send()
        except SMTPDataError as e:
            logging.exception('Error during email sending')
            if 'Email address is not verified' in e.args[1].decode('utf-8'):
                # Отправить письмо админу c заявкой на активацию аккаунта
                to = os.getenv('DJANGO_ADMIN_EMAIL', 'admin@localhost')
                subject, from_email = 'Easy Track - Заявка на активацию пользователя {}'.format(user.email), settings.EMAIL_FROM
                text_content = render_to_string('activation_by_admin_email.html', {'host': host, 'user_id': user.pk})
                html_content = render_to_string('activation_by_admin_email_html.html', {'host': host, 'user_id': user.pk})
                msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
                msg.attach_alternative(html_content, "text/html")
                msg.send()
                raise EmailNotVerifiedInAWSSESError()
            else:
                raise


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
            return Response({'error': 'User token is invalid'}, status=404)


class TokenObtainPairLoginCaseInsensitiveView(TokenObtainPairView):
    
    def get_serializer(self, *args, **kwargs):
        data = kwargs.get('data')
        if data:
            username = data['username']
            data.update({
                'username': username.lower()
            })
            kwargs['data'] = data
        return super().get_serializer(*args, **kwargs)
