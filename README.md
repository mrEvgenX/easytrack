# Easytrack

Application for tracking new habits

## How to run

Recommended to use virtualenv.

### Debug

One tab:
- cd ./django
- virtualenv -p `which python3` venv  # once
- source ./venv/bin/activate
- pip install -r ../requirements.dev.txt  # once
- export DJANGO_SETTINGS_MODULE=config.settings_dev
- python3 manage.py migrate  # once
- python3 manage.py createsuperuser  # once
- python3 manage.py runserver

Second tab:

- python3 -m smtpd -n -c DebuggingServer localhost:1025

Third tab:

- cd ./react
- yarn install  # once
- yarn start

### Production/stating

- Install docker and docker-compose
- pip install -r requirements.dev.txt  # once
- export DJANGO_SETTINGS_MODULE=config.settings_prod
- cd react && yarn install && cd ..
- ./build_release.sh

Create .env file and define the following environment variables:
- DJANGO_SETTINGS_MODULE=config.settings_prod
- DJANGO_SECRET_KEY=top-secret-for-cryptographic-hashing
- DJANGO_ALLOWED_HOSTS=example.com
- DJANGO_DB_NAME=easytrack_db
- DJANGO_DB_USER=easytrack_user
- DJANGO_DB_PASSWORD=password
- DJANGO_DB_HOST=db.example.com
- DJANGO_DB_PORT=5432

Settings for sending activation email:

- DJANGO_EMAIL_HOST=smtp.example.com
- DJANGO_EMAIL_HOST_USER=easytrack_email_user
- DJANGO_EMAIL_HOST_PASSWORD=password
- DJANGO_EMAIL_PORT=587
- DJANGO_EMAIL_FROM=no-reply@example.com
- DJANGO_ADMIN_EMAIL=your-personal-email@gmail.com

Logging settings:

- DJANGO_LOG_FILE=/var/log/easytrack/easytrack.log

Telegram bot integration settings:

- DJANGO_TELEGRAM_BOT_TOKEN=token

Finally:

- docker-compose up -d

Go to http://yourhost:8080
