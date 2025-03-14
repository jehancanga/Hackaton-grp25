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

# Headers pour la requête
headers = {
    'Content-Type': 'application/json'
}

# Envoyer la requête à l'API
try:
    response = requests.post("http://localhost:5000/detect-emotion", 
                              json=payload, 
                              headers=headers)
    
    # Afficher des informations détaillées
    print("Status Code:", response.status_code)
    print("Response Headers:", response.headers)
    print("Response Content:", response.text)
    
    # Vérifier le statut de la réponse
    if response.status_code == 200:
        result = response.json()
        print(f"Émotion détectée: {result['emotion']}")
        print(f"Confiance: {result['confidence']:.2f}")
    else:
        print(f"Erreur non 200: Status {response.status_code}")
        print(f"Contenu de l'erreur: {response.text}")

except requests.exceptions.RequestException as e:
    print(f"Erreur de requête: {e}")
except json.JSONDecodeError as e:
    print(f"Erreur de décodage JSON: {e}")
except Exception as e:
    print(f"Erreur inattendue: {e}")