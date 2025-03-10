#!/bin/bash

# Arrêter les conteneurs du projet
echo "Arrêt des conteneurs..."
docker-compose down

# Supprimer les conteneurs arrêtés du projet
echo "Nettoyage des conteneurs..."
docker-compose rm -f

docker stop $(docker ps -qa) 2>/dev/null
docker rm $(docker ps -qa) 2>/dev/null
docker rmi -f $(docker images -qa) 2>/dev/null
docker volume rm $(docker volume ls -q) 2>/dev/null
docker network rm $(docker network ls -q) 2>/dev/null
docker system prune -a --volume 2>/dev/null
docker system prune -a --force 2>/dev/null