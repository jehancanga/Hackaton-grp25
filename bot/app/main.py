from flask import Flask, request, jsonify
import os
import json
import numpy as np
from datetime import datetime
import certifi
from pymongo import MongoClient

app = Flask(__name__)

# Connexion à MongoDB (compatible Atlas ou local)

# URI pour MongoDB - prend en compte MongoDB Atlas ou local
mongo_uri = os.environ.get("MONGO_URI", "mongodb://mongodb:27017/twitter_clone")

# Configuration du client MongoDB (ajoute le certificat seulement si nécessaire pour Atlas)
if "mongodb+srv" in mongo_uri:
    client = MongoClient(mongo_uri, tlsCAFile=certifi.where())
else:
    client = MongoClient(mongo_uri)

db = client.get_database()

# Modèle de prédiction d'émotions (simulation)
emotions = ["Joie", "Tristesse", "Colère", "Surprise", "Dégoût", "Peur", "Neutre"]

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "service": "emotion-ai"})

@app.route("/api/emotions/predict", methods=["POST"])
def predict_emotion():
    """Prédire l'émotion à partir d'une image"""
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400
    
    # Dans un cas réel, vous traiteriez l'image et feriez une prédiction
    # Ici, nous simulons une prédiction
    emotion_index = np.random.randint(0, len(emotions))
    confidence = np.random.uniform(0.7, 0.99)
    
    # Récupérer l'ID utilisateur s'il est fourni
    user_id = request.form.get("user_id", "anonymous")
    
    prediction = {
        "emotion": emotions[emotion_index],
        "confidence": float(confidence),
        "timestamp": datetime.now().isoformat(),
        "user_id": user_id
    }
    
    # Enregistrer la prédiction dans MongoDB
    db.emotion_predictions.insert_one(prediction)
    
    return jsonify(prediction)

@app.route("/api/feed/recommend", methods=["GET"])
def recommend_content():
    """Recommander du contenu basé sur les émotions et préférences"""
    user_id = request.args.get("user_id")
    
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    
    # Récupérer l'historique des émotions de l'utilisateur
    user_emotions = list(db.emotion_predictions.find(
        {"user_id": user_id},
        {"emotion": 1, "_id": 0}
    ).sort("timestamp", -1).limit(10))
    
    # Recommander du contenu basé sur les émotions (simulation)
    recent_emotions = [e["emotion"] for e in user_emotions] if user_emotions else ["Neutre"]
    dominant_emotion = max(set(recent_emotions), key=recent_emotions.count) if recent_emotions else "Neutre"
    
    # Stratégie de recommandation basée sur l'émotion dominante
    if dominant_emotion in ["Joie", "Surprise"]:
        content_type = "positif"
    elif dominant_emotion in ["Tristesse", "Peur"]:
        content_type = "réconfortant"
    elif dominant_emotion in ["Colère", "Dégoût"]:
        content_type = "apaisant"
    else:
        content_type = "neutre"
    
    # Simuler des recommandations
    recommendations = [
        {"id": f"tweet-{i}", "type": content_type, "score": round(np.random.uniform(0.7, 0.99), 2)}
        for i in range(5)
    ]
    
    return jsonify({
        "dominant_emotion": dominant_emotion,
        "content_type": content_type,
        "recommendations": recommendations
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)