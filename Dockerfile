FROM phusion/baseimage:bionic-1.0.0
RUN mkdir -p /easytrack/react
COPY ./django ./static ./requirements.*.txt /easytrack/
COPY ./react/build /easytrack/react

RUN apt-get -y update
RUN apt-get install -qy \
    nginx \
    postgresql-client \
    python3 \
    python3-pip
RUN pip3 install --upgrade pip
RUN pip3 install -r /easytrack/requirements.dev.txt
COPY runit/uwsgi /etc/service/uwsgi
COPY nginx/easytrack.conf /etc/nginx/sites-available/easytrack.conf
RUN rm /etc/nginx/sites-enabled/*
RUN ln -s /etc/nginx/sites-available/easytrack.conf /etc/nginx/sites-enabled/easytrack.conf
COPY runit/nginx /etc/service/nginx

RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

EXPOSE 80
