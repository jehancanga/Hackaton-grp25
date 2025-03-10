.PHONY: up down restart build rebuild logs clean

up:
	./start.sh up

down:
	./start.sh down

restart:
	./start.sh restart

build:
	./start.sh build

rebuild:
	./start.sh rebuild

logs:
	./start.sh logs

clean:
	./start.sh clean

install: 
	chmod +x start.sh
	./start.sh up