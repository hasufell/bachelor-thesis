# Handbuch zur Ausführung der Implementierung

## Vorraussetzungen/Abhängigkeiten

* ein unix-artiges Betriebssystem
* Docker Version 1.10.x (getestet mit 1.10.1)

Der Docker Daemon muss gestartet sein. Siehe [Installations Guide](https://docs.docker.com/engine/installation/).

### Bauen der container

```sh
docker build -t hasufell/haraka alpine-haraka
docker build -t hasufell/haraka-gateway alpine-haraka-gateway
docker build -t hasufell/swaks alpine-swaks
```

## Ausführung des Programms

### Starten des Netzwerkes

Die Container werden in einem Docker Netzwerk zusammengefasst und
können innerhalb dessen kommunizieren.

```sh
docker network create haraka
```

Der Name des Netzwerkes _muss_ hier `haraka` lauten.

### Starten der hops

Diese sollten jeweils in einem Terminal gestartet werden, um den Debug
Output der Container beobachten zu können.

```sh
docker run -ti \
	--name=hop1 \
	--net=haraka \
	hasufell/haraka

docker run -ti \
	--name=hop2 \
	--net=haraka \
	hasufell/haraka

docker run -ti \
	--name=hop3 \
	--net=haraka \
	hasufell/haraka

docker run -ti \
	--name=rcpt \
	--net=haraka \
	hasufell/haraka
```

### Starten des SMTP gateways

Dieser Server erstellt die initiale MystMail, wenn eine gewöhnliche E-Mail
ankommt und sendet sie an `hop1`.

```sh
docker run -ti \
	--name=smtp-gateway \
	--net=haraka \
	hasufell/haraka-gateway
```

### Absenden einer E-Mail

```sh
docker run -ti \
	--net=haraka \
	hasufell/swaks \
	swaks -t wurst@rcpt.haraka -f hasufell@smtp-gateway.com -s smtp-gateway.haraka -p 25
```

## Beobachtung der Ergebnisse

Dies zeigt die MystMail an jedem Hop.

```sh
for i in hop1 hop2 hop3 rcpt ; do
	docker exec -ti ${i} cat /tmp/mail.eml
done
```


## Cleanup

Falls die Container neu gestartet werden sollen.

```sh
for i in hop1 hop2 hop3 rcpt smtp-gateway ; do
	docker stop ${i}
	docker rm ${i}
done
```

