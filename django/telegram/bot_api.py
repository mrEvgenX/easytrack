import requests
from django.core.cache import caches
from django.contrib.auth.models import User
from .models import TelegramProfile


class TelegramClient:

    def __init__(self, token):
        self.token = token

    def send_message(self, chat_id, text, disable_web_page_preview=None):
        payload = {"chat_id": chat_id, "text": text}
        if disable_web_page_preview:
            payload['disable_web_page_preview'] = disable_web_page_preview
        r = requests.post(
            'https://api.telegram.org/bot{}/sendMessage'.format(self.token),
            json=payload,
        )
        data = r.json()
        if r.status_code == 200 and data['ok']:
            return {}
        return {'data': data, 'status': r.status_code}


class TelegramBotDispatcher:

    @staticmethod
    def send_message(chat_id, text):
        return {
            'method': 'sendMessage',
            'chat_id': chat_id,
            'text': text
        }

    @staticmethod
    def _get_user_id_by_attachment_code(attachment_code):
        return caches['telegram_code_to_user'].get(attachment_code)

    @staticmethod
    def _clear_attachment_code_info(user_id, attachment_code):
        caches['user_to_telegram_code'].delete(user_id)
        caches['telegram_code_to_user'].delete(attachment_code)

    def dispatch(self, update):
        if 'message' not in update:
            return {}
        incoming_message = update['message']
        chat_id = incoming_message['chat']['id']
        telegram_username = incoming_message['chat']['username']
        text = incoming_message['text']
        try:
            existing_telegram_profile = TelegramProfile.objects.get(chat_id=chat_id)
            username = existing_telegram_profile.user.username
        except TelegramProfile.DoesNotExist:
            existing_telegram_profile = None
            username = None
        if text == '/start':
            if username:
                return self.send_message(
                    chat_id,
                    'Данный телеграм-аккаунт уже привязан к профилю Easy Track с логином {}.\n'.format(username)
                )
            return self.send_message(
                chat_id,
                'Если вы пользователь сервиса [Easy Track](https://easytrackhabit.ru), от меня вы сможете получать напоминания о следовании своим привычкам.\n'
                'Но для этого нужно привязать данный телеграм-аккаунт. '
                'Для этого, пожалуйста, Easy Track перейдите в [настройки профиля](https://easytrackhabit.ru/settings) и следуйте дальнейшим инструкциям.'
            )
        elif text.startswith('/start '):
            if username:
                return self.send_message(
                    chat_id,
                    'Данный телеграм-аккаунт уже привязан к профилю Easy Track с логином {}.\n'.format(username)
                )
            attachment_code = text[7:]
            user_id = self._get_user_id_by_attachment_code(attachment_code)
            if user_id:
                user = User.objects.get(pk=user_id)  # TODO make it correctly
                TelegramProfile(user=user, chat_id=chat_id, telegram_username=telegram_username).save()
                username = user.username
                self._clear_attachment_code_info(user.pk, attachment_code)
                return self.send_message(
                    chat_id,
                    'Спасибо! Данный телеграм-аккаунт успешно привязан к профилю Easy Track с логином {}.\n'
                    'Теперь в настройках привычек вы можете настраивать напоминания и они будут приходить от меня здесь.'.format(username)
                )
            return self.send_message(
                chat_id,
                'Не получилось привязать данный телеграм-аккаунт ни к какому профилю сервисе Easy Track.'
            )
        elif text == '/detach':
            if not existing_telegram_profile:
                return self.send_message(
                    chat_id,
                    'Данный телеграм-аккаунт не привязан ни к какому профилю Easy Track.'
                )
            existing_telegram_profile.delete()
            return self.send_message(
                chat_id,
                'Привязка данного телеграм-аккаунта к профилю Easy Track с логином {} успешно отменена.'.format(username)
            )
        elif text == '/help':
            message_lines = []
            if username:
                message_lines += [
                    'Данный телеграм-аккаунт привязан к профилю Easy Track с логином {}.'.format(username),
                    'Чтобы отменить привязку отправьте мне сообщение с текстом /detach.',
                    'Также это можно сделать на странице сервиса в [настройках профиля Easy Track](https://easytrackhabit.ru/settings).'
                ]
            else:
                message_lines.append(
                    'Данный телеграм-аккаунт не привязан ни к какому профилю Easy Track.'
                )
            message_lines += [
                'О том, что я умею, я научусь сообщать позже.',
            ]
            return self.send_message(
                chat_id,
                '\n'.join(message_lines)
            )
        return self.send_message(
            chat_id,
            'Простите, ничего не понял... Воспользуйтесь, пожалуйста, справкой, введя /help.'
        )
