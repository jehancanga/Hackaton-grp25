# Utiliser une image légère de Python
FROM python:3.9-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier et installer les dépendances
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le reste du code, y compris les modèles
COPY . .

# Vérifier que le modèle est bien présent
RUN test -f app/models/emotion_model.pt || echo "⚠️ Modèle non trouvé"

# Exposer le port Flask
EXPOSE 5000

# Lancer l'application Flask
CMD ["python", "app.py"]
