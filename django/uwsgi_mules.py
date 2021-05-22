import logging
from datetime import datetime
import uwsgidecorators
from dateutil.relativedelta import relativedelta, MO, TU, WE, TH, FR, SA, SU


def get_next_notification_time(item_notification_setting, now):
    ins = item_notification_setting
    possible_times = [
        now.date() + relativedelta(weekday=MO, hour=ins.mo.hour, minute=ins.mo.minute, second=ins.mo.second,
                                   microsecond=0),
        now.date() + relativedelta(weekday=TU, hour=ins.tu.hour, minute=ins.tu.minute, second=ins.tu.second,
                                   microsecond=0),
        now.date() + relativedelta(weekday=WE, hour=ins.we.hour, minute=ins.we.minute, second=ins.we.second,
                                   microsecond=0),
        now.date() + relativedelta(weekday=TH, hour=ins.th.hour, minute=ins.th.minute, second=ins.th.second,
                                   microsecond=0),
        now.date() + relativedelta(weekday=FR, hour=ins.fr.hour, minute=ins.fr.minute, second=ins.fr.second,
                                   microsecond=0),
        now.date() + relativedelta(weekday=SA, hour=ins.sa.hour, minute=ins.sa.minute, second=ins.sa.second,
                                   microsecond=0),
        now.date() + relativedelta(weekday=SU, hour=ins.su.hour, minute=ins.su.minute, second=ins.su.second,
                                   microsecond=0),
    ]
    return min(*[possible_time for possible_time in possible_times if possible_time > now])


@uwsgidecorators.timer(60, target='mule')
def send_item_notification(_):
    from django.core.cache import caches
    from telegram.models import ItemTelegramNotificationSetting
    from telegram.views import client

    log = logging.getLogger('timer_mule')

    now = datetime.now()
    for item_notification_setting in ItemTelegramNotificationSetting.objects.all():
        log.info('processing item_notification_setting id=%s', item_notification_setting.item_id)
        item_name = item_notification_setting.item.name
        chat_id = item_notification_setting.item.owner.telegramprofile.chat_id
        notification_id = '{}/{}'.format(item_notification_setting.item_id, item_notification_setting.id)
        next_notification_time = caches['notifications'].get(notification_id)
        log.debug('now=%s next_notification_time=%s', now, next_notification_time)
        if next_notification_time and now > next_notification_time:
            log.info('sending notification to chat_id=%s about item_id=%s', chat_id, item_notification_setting.item_id)
            client.send_message(chat_id, '\n'.join([
                'Вы просили напомнить:',
                '',
                item_name,
                '',
                'https://easytrackhabit.ru'
            ]), disable_web_page_preview=True)
        caches['notifications'].set(notification_id, get_next_notification_time(item_notification_setting, now))
