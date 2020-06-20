from config.settings_common import *

SECRET_KEY = '^+-pjsymn4(4!hy+m%v*##92&#^9+bg%8x=oxy@po)c%m59zqk'
DEBUG = False

DATABASES['default'].update({
    'ENGINE': 'django.db.backends.sqlite3',
    'NAME': os.path.join(BASE_DIR, '../db.sqlite3'),
})

# python -m smtpd -n -c DebuggingServer localhost:1025
EMAIL_HOST='localhost'
EMAIL_PORT=1025
EMAIL_USE_SSL = False
