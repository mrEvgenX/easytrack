from config.settings_common import *

DEBUG = False

assert SECRET_KEY is not None, (
    'Please provide DJANGO_SECRET_KEY '
    'environment variable with a value')

assert EMAIL_HOST is not None, (
    'Please provide DJANGO_EMAIL_HOST environment variable with a value'
    )
assert EMAIL_HOST_USER is not None, (
    'Please provide DJANGO_EMAIL_HOST_USER environment variable with a value'
    )
assert EMAIL_HOST_PASSWORD is not None, (
    'Please provide DJANGO_EMAIL_HOST_PASSWORD environment variable with a value'
    )
assert EMAIL_PORT is not None, (
    'Please provide DJANGO_EMAIL_PORT environment variable with a value'
    )

ALLOWED_HOSTS += [
    os.getenv('DJANGO_ALLOWED_HOSTS'),
]

DATABASES['default'].update({
    'NAME': os.getenv('DJANGO_DB_NAME'),
    'USER': os.getenv('DJANGO_DB_USER'),
    'PASSWORD': os.getenv('DJANGO_DB_PASSWORD'),
    'HOST': os.getenv('DJANGO_DB_HOST'),
    'PORT': os.getenv('DJANGO_DB_PORT'),
})

CORS_ORIGIN_WHITELIST = [
    os.getenv('DJANGO_CORS_ORIGIN_WHITELIST')
]
