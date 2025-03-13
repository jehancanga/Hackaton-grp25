import requests
import base64
import json
from PIL import Image
import io

# Chemin vers l'image à tester
image_path = "chemin/vers/votre/image.jpg"

# Lire et encoder l'image en base64
with open(image_path, "rb") as img_file:
    img_bytes = img_file.read()
    img_base64 = base64.b64encode(img_bytes).decode('utf-8')

# Préparer les données pour la requête
payload = {
    "image": f"data:image/jpeg;base64,{img_base64}"
}

# Envoyer la requête à l'API
response = requests.post("http://localhost:5001/detect-emotion", json=payload)

# Afficher le résultat
if response.status_code == 200:
    result = response.json()
    print(f"Émotion détectée: {result['emotion']}")
    print(f"Confiance: {result['confidence']:.2f}")
else:
    print(f"Erreur: {response.text}")