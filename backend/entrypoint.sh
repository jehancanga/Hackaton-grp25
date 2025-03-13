#!/bin/sh
# Attendre que MongoDB soit prêt
echo "Waiting for MongoDB to start..."
sleep 5

# Exécuter le seed si l'environnement SEED_DB est défini à true
if [ "$SEED_DB" = "true" ]; then
  echo "Initializing database with test data..."
  node tests/seed.js
fi

# Démarrer l'application
echo "Starting server..."
nodemon server.js