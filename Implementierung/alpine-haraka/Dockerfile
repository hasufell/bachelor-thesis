FROM       mhart/alpine-node:4
MAINTAINER Julian Ospald <hasufell@posteo.de>

ENV HARAKA_HOME /app
ENV HARAKA_LOGS /logs
ENV HARAKA_DATA /data
ENV PATH /usr/local/bin:$HARAKA_HOME/node_modules/.bin:$PATH
# node-gyp emits lots of warnings if HOME is set to /
ENV HOME /tmp
ENV HARAKA_VERSION 2.7.0

# the application is not started as this user,
# but Haraka can be configured to drop its privileges
# via smtp.ini
RUN echo "@testing http://nl.alpinelinux.org/alpine/edge/testing" \
		>> /etc/apk/repositories && \
	apk --no-cache add make gcc g++ python shadow@testing && \
	groupadd -r haraka && \
    useradd --comment "Haraka Server User" \
            --home "$HARAKA_HOME" \
            --shell /bin/false \
            --gid haraka \
            -r \
            -M \
            haraka && \
	npm install -g "Haraka@$HARAKA_VERSION" && \
	haraka --install "$HARAKA_HOME" && \
	apk --no-cache del make gcc g++ python shadow && \
	rm -rf /var/cache/apk/*

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint
COPY config /app/config
COPY plugins /app/plugins
RUN chmod 0755 /usr/local/bin/docker-entrypoint
RUN mkdir -p "$HARAKA_HOME" && \
    mkdir -p "$HARAKA_LOGS" && \
    mkdir -p "$HARAKA_DATA" && \
    chmod -R 0777 "$HARAKA_LOGS" && \
    chmod -R 0777 "$HARAKA_DATA" && \
    chown -R haraka:haraka "$HARAKA_HOME" "$HARAKA_LOGS" "$HARAKA_DATA"

ENV HOME "$HARAKA_HOME"

WORKDIR /app

EXPOSE 25

ENTRYPOINT ["/usr/local/bin/docker-entrypoint"]
CMD [""]

