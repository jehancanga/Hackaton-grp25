from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import torch
import torchvision.transforms as transforms
from PIL import Image
import io
import base64
import os
import traceback
from models import EmotionCNN

app = Flask(__name__, static_folder='.')  # Utilisez le répertoire courant comme dossier statique


app = Flask(__name__)
# CORS(app)
CORS(app, resources={r"/*": {"origins": "*"}})

# Définir les émotions (assurez-vous que l'ordre correspond à votre modèle)
emotions = ["neutral", "happy", "sad", "surprise", "fear", "disgust", "angry"]

# Charger le modèle
# model_path = 'app/models/emotion_model_scripted.pt'
model_path = '/app/app/models/emotion_model_scripted.pt'

# Transformer le modèle si nécessaire
def load_model(path):
    try:
        # Essayez de charger le modèle scripté en premier
        try:
            model = torch.jit.load(path, map_location=torch.device('cpu'))
            print("✅ Modèle scripté chargé avec succès")
            return model
        except Exception as scripted_error:
            print(f"Erreur de chargement du modèle scripté : {scripted_error}")
        
        # Si le modèle scripté échoue, essayez le modèle standard
        model = torch.load(path, map_location=torch.device('cpu'))
        
        # Si c'est un state_dict
        if isinstance(model, dict):
            model_instance = EmotionCNN(num_classes=len(emotions))
            model_instance.load_state_dict(model)
            model = model_instance
        
        return model
    except Exception as e:
        print(f"Erreur de chargement du modèle : {e}")
        raise

# Load model
model = load_model(model_path)
model.eval()  # Mettre le modèle en mode évaluation

# Transformations pour le prétraitement de l'image
transform = transforms.Compose([
    transforms.Resize((48, 48)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

@app.route('/detect-emotion', methods=['POST', 'GET', 'OPTIONS'])
def detect_emotion():
    # Gestion des requêtes OPTIONS (preflight CORS)
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        return response

    # Gestion des requêtes GET
    if request.method == 'GET':
        return jsonify({'message': 'Send a POST request with an image to detect emotion'}), 405

    try:
        # Reste de votre code pour la méthode POST
        data = request.json
        if not data or 'image' not in data:
            return jsonify({'error': 'Aucune image fournie'}), 400
            
        # Décoder l'image en base64
        image_str = data['image']
        if ',' in image_str:
            image_str = image_str.split(',')[1]
        image_data = base64.b64decode(image_str)
        image = Image.open(io.BytesIO(image_data))
        
        # Convertir en RGB si l'image est en noir et blanc
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Prétraitement de l'image
        image_tensor = transform(image).unsqueeze(0)
        
        # Prédiction
        with torch.no_grad():
            # Utilisation différente pour un modèle scripté
            output = model(image_tensor)
            probabilities = torch.nn.functional.softmax(output, dim=1)
            _, predicted = torch.max(output, 1)
            
        # Récupérer l'émotion prédite
        emotion_index = predicted.item()
        emotion = emotions[emotion_index]
        confidence = float(probabilities[0][emotion_index])
        
        return jsonify({
            'emotion': emotion,
            'confidence': confidence
        })
        
    except Exception as e:
        print(f"Erreur détaillée: {str(e)}")
        traceback.print_exc()  # Affiche la trace complète de l'erreur
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})

@app.route('/')
def serve_html():
    return send_from_directory('.', 'test_emotion.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)