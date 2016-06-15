FROM       alpine:3.3
MAINTAINER Julian Ospald <hasufell@posteo.de>

RUN echo "@testing http://nl.alpinelinux.org/alpine/edge/testing" \
		>> /etc/apk/repositories && \
	apk --no-cache add swaks@testing && \
	rm -rf /var/cache/apk/*

EXPOSE 25

