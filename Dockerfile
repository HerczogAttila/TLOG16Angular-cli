FROM infoslack/alpine-nginx:latest
MAINTAINER Attila Herczog "aherczog@precognox.com"
RUN apk add --update openssl wget
RUN wget --no-check-certificate https://github.com/jwilder/dockerize/releases/download/v0.2.0/dockerize-linux-amd64-v0.2.0.tar.gz
RUN tar -C /usr/local/bin -xzvf dockerize-linux-amd64-v0.2.0.tar.gz
COPY dist /usr/html/
CMD dockerize -wait tcp://tlog-backend:8080 -wait tcp://tlog-db:3306 nginx -g "daemon off;"
