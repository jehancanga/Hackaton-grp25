from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torchvision.transforms as transforms
from PIL import Image
import io
import base64
import os

app = Flask(__name__)
CORS(app)  # Important pour permettre les requêtes depuis le frontend

# Charger le modèle
model_path = 'app/models/emotion_model.pt'
model = torch.load(model_path, map_location=torch.device('cpu'))
model.eval()

# Liste des émotions correspondant aux sorties du modèle
emotions = ["angry", "disgust", "fear", "happy", "sad", "surprise", "neutral"]

@app.route('/detect-emotion', methods=['POST'])
def detect_emotion():
    try:
        # Récupérer l'image depuis la requête
        data = request.json
        if not data or 'image' not in data:
            return jsonify({'error': 'Aucune image fournie'}), 400
            
        # Décoder l'image en base64
        image_data = base64.b64decode(data['image'].split(',')[1])
        image = Image.open(io.BytesIO(image_data))
        
        # Prétraitement de l'image
        transform = transforms.Compose([
            transforms.Resize((48, 48)),
            transforms.Grayscale(num_output_channels=1),
            transforms.ToTensor(),
        ])
        
        image_tensor = transform(image).unsqueeze(0)
        
        # Prédiction
        with torch.no_grad():
            output = model(image_tensor)
            _, predicted = torch.max(output, 1)
            
        # Récupérer l'émotion prédite
        emotion = emotions[predicted.item()]
        confidence = float(torch.nn.functional.softmax(output, dim=1)[0][predicted].item())
        
        return jsonify({
            'emotion': emotion,
            'confidence': confidence
        })
        
    except Exception as e:
        print(f"Erreur: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)