#!/usr/bin/env bash

pushd ./django && \
DJANGO_SECRET_KEY=fake \
DJANGO_EMAIL_HOST=fake \
DJANGO_EMAIL_HOST_USER=fake \
DJANGO_EMAIL_HOST_PASSWORD=fake \
DJANGO_EMAIL_FROM=fake \
DJANGO_EMAIL_PORT=fake \
DJANGO_LOG_FILE=fake \
python3 manage.py collectstatic && \
popd

pushd ./react && \
yarn build && \
rm -rf ../static/js/ ../static/css && \
mv ./build/static/* ../static/ && rm -rf ./build/static/ && \
popd
