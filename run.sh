#!/bin/bash

# Forcer l'utilisation du socket Docker Engine standard
export DOCKER_HOST=unix:///var/run/docker.sock

# Script universel pour gérer un projet Docker
# Compatible avec Docker Engine et Docker Desktop sur tous les systèmes

# Fonction pour vérifier si Docker est disponible
check_docker() {
  if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé ou n'est pas dans le PATH"
    echo "👉 Veuillez installer Docker: https://docs.docker.com/get-docker/"
    exit 1
  fi
  
  # Tester si Docker daemon est disponible
  if ! docker info &> /dev/null; then
    echo "❌ Impossible de se connecter au daemon Docker"
    echo "👉 Vérifiez que Docker est démarré:"
    echo "   - Sur Linux: sudo systemctl start docker"
    echo "   - Sur macOS/Windows: Démarrez l'application Docker Desktop"
    exit 1
  fi
  
  echo "✅ Docker est disponible"
}

# Fonction pour vérifier si Docker Compose est disponible
check_compose() {
  # Vérifier la nouvelle commande (Docker Compose V2)
  if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
    echo "✅ Docker Compose V2 détecté"
    return
  fi
  
  # Vérifier l'ancienne commande (Docker Compose V1)
  if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
    echo "✅ Docker Compose V1 détecté"
    return
  fi
  
  echo "❌ Docker Compose n'est pas installé"
  echo "👉 Veuillez installer Docker Compose: https://docs.docker.com/compose/install/"
  exit 1
}

# Fonction pour afficher l'aide
show_help() {
  echo "Usage: ./run.sh [COMMANDE]"
  echo ""
  echo "Commandes disponibles:"
  echo "  start   - Construire et démarrer les conteneurs"
  echo "  stop    - Arrêter les conteneurs"
  echo "  restart - Redémarrer les conteneurs"
  echo "  logs    - Afficher les logs"
  echo "  build   - Reconstruire les images"
  echo "  clean   - Supprimer tous les conteneurs et volumes"
  echo "  help    - Afficher cette aide"
  echo ""
  echo "Exemple: ./run.sh start"
}

# Démarrer les conteneurs
start_containers() {
  echo "🚀 Démarrage des conteneurs..."
  $COMPOSE_CMD down &> /dev/null || true
  $COMPOSE_CMD build
  $COMPOSE_CMD up -d
  echo "✅ Applications démarrées!"
  echo "🌐 Frontend: http://localhost"
  echo "🔌 Backend: http://localhost:3000"
}

# Arrêter les conteneurs
stop_containers() {
  echo "🛑 Arrêt des conteneurs..."
  $COMPOSE_CMD down
  echo "✅ Conteneurs arrêtés"
}

# Redémarrer les conteneurs
restart_containers() {
  echo "🔄 Redémarrage des conteneurs..."
  $COMPOSE_CMD restart
  echo "✅ Conteneurs redémarrés"
}

# Afficher les logs
show_logs() {
  echo "📋 Affichage des logs (Ctrl+C pour quitter)..."
  $COMPOSE_CMD logs -f
}

# Construire les images
build_images() {
  echo "🏗️ Construction des images..."
  $COMPOSE_CMD build --no-cache
  echo "✅ Images construites"
}

# Nettoyer l'environnement
clean_environment() {
  echo "🧹 Nettoyage de l'environnement..."
  $COMPOSE_CMD down -v
  echo "✅ Environnement nettoyé"
}

# Vérifier les dépendances
check_docker
check_compose

# Vérifier qu'un fichier docker-compose.yml existe
if [ ! -f "docker-compose.yml" ]; then
  echo "⚠️ Fichier docker-compose.yml non trouvé"
  
  # Création d'un fichier docker-compose.yml basique
  cat > docker-compose.yml << 'EOL'
services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
EOL
  echo "✅ Fichier docker-compose.yml créé"
fi

# Vérification des répertoires et création si nécessaire
if [ ! -d "frontend" ]; then
  mkdir -p frontend
  echo '
FROM node:18-alpine
WORKDIR /app
RUN echo "Frontend container is running" > index.html
CMD ["sh", "-c", "echo Running frontend container && tail -f /dev/null"]
' > frontend/Dockerfile
  echo "✅ Répertoire frontend créé avec un Dockerfile minimal"
fi

if [ ! -d "backend" ]; then
  mkdir -p backend
  echo '
FROM node:18-alpine
WORKDIR /app
CMD ["sh", "-c", "echo Running backend container && tail -f /dev/null"]
' > backend/Dockerfile
  echo "✅ Répertoire backend créé avec un Dockerfile minimal"
fi

# Traitement des commandes
case "$1" in
  start)
    start_containers
    ;;
  stop)
    stop_containers
    ;;
  restart)
    restart_containers
    ;;
  logs)
    show_logs
    ;;
  build)
    build_images
    ;;
  clean)
    clean_environment
    ;;
  help|*)
    show_help
    ;;
esac

exit 0