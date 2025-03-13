FROM python:3.9-slim

# Installer les dépendances système nécessaires pour PyTorch
RUN apt-get update && apt-get install -y \
    libopenblas-dev \
    libopenmpi-dev \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copier les fichiers nécessaires
COPY requirements.txt .
COPY app.py .
COPY models.py .
COPY app ./app

# Installer les autres dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Vérifier la présence du fichier modèle
RUN if [ ! -f "app/models/emotion_model_scripted.pt" ]; then \
    echo "Erreur : Fichier modèle emotion_model_scripted.pt introuvable"; \
    exit 1; \
    fi

# Exposer le port
EXPOSE 5001

# Commande par défaut
CMD ["python", "app.py"]
