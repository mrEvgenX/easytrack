FROM phusion/baseimage:bionic-1.0.0

RUN mkdir /easytrack
WORKDIR /easytrack
COPY ./static /easytrack/static
COPY ./django /easytrack/django
COPY ./requirements.*.txt /easytrack/
COPY ./react/build /easytrack/react
RUN mkdir /var/log/easytrack/
RUN touch /var/log/easytrack/easytrack.log
RUN mkdir /var/log/uwsgi/
RUN touch /var/log/uwsgi/easytrack.log
RUN chown www-data /var/log/easytrack/easytrack.log
RUN chown www-data /var/log/uwsgi/easytrack.log

RUN apt-get -y update
RUN apt-get install -qy \
    nginx \
    postgresql-client \
    python3 \
    python3-pip
RUN pip3 install --upgrade pip
RUN pip3 install -r /easytrack/requirements.prod.txt

COPY django/uwsgi.ini /etc/uwsgi/apps-enabled/easytrack.ini
COPY runit/uwsgi /etc/service/uwsgi

COPY nginx/easytrack.conf /etc/nginx/sites-available/easytrack.conf
RUN rm /etc/nginx/sites-enabled/*
RUN ln -s /etc/nginx/sites-available/easytrack.conf /etc/nginx/sites-enabled/easytrack.conf
COPY runit/nginx /etc/service/nginx

RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

EXPOSE 80
