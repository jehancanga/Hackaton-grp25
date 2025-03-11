

# Installation des bibliothèques nécessaires
!pip install tensorflow keras numpy matplotlib seaborn
!apt install unzip

import zipfile

# Définition des chemins pour l'extraction des données
dataset_zip_path = "/content/dataset.zip"  # Remplace par le chemin de ton fichier
dataset_extract_path = "/content/dataset"

# Extraction du dataset
with zipfile.ZipFile(dataset_zip_path, 'r') as zip_ref:
    zip_ref.extractall(dataset_extract_path)

print("Dataset extrait avec succès !")

# Importation des bibliothèques
import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import VGG16
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Flatten, Dropout, BatchNormalization
from tensorflow.keras.optimizers import Adam
import matplotlib.pyplot as plt
import seaborn as sns

# Définition des chemins des jeux de données
train_dir = "/content/dataset/train"
test_dir = "/content/dataset/test"

# Préparation des données avec Data Augmentation
datagen = ImageDataGenerator(
    rescale=1./255,  # Normalisation des pixels
    rotation_range=30,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    validation_split=0.2  # 20% des données utilisées pour la validation
)

# Chargement des données avec le générateur
batch_size = 32
img_size = (48, 48)

train_generator = datagen.flow_from_directory(
    train_dir,
    target_size=img_size,
    batch_size=batch_size,
    class_mode='categorical',
    subset='training'
)

val_generator = datagen.flow_from_directory(
    train_dir,
    target_size=img_size,
    batch_size=batch_size,
    class_mode='categorical',
    subset='validation'
)

test_generator = ImageDataGenerator(rescale=1./255).flow_from_directory(
    test_dir,
    target_size=img_size,
    batch_size=batch_size,
    class_mode='categorical',
    shuffle=False
)

num_classes = len(train_generator.class_indices)
print(" Nombre de classes :", num_classes)

# Construction du modèle avec VGG16 (Transfer Learning)

# Chargement du modèle pré-entraîné VGG16 sans la dernière couche
base_model = VGG16(weights='imagenet', include_top=False, input_shape=(48, 48, 3))

#  Geler les poids du modèle pré-entraîné
for layer in base_model.layers:
    layer.trainable = False

# Définition du modèle personnalisé
model = Sequential([
    base_model,
    Flatten(),
    Dense(256, activation='relu'),
    BatchNormalization(),
    Dropout(0.5),
    Dense(128, activation='relu'),
    Dropout(0.3),
    Dense(num_classes, activation='softmax')  # Classification multi-classes
])

# 🔧 Compilation du modèle
model.compile(optimizer=Adam(learning_rate=0.0001),
              loss='categorical_crossentropy',
              metrics=['accuracy'])

#  Affichage de l'architecture du modèle
model.summary()

#  Entraînement du modèle
epochs = 30

history = model.fit(
    train_generator,
    validation_data=val_generator,
    epochs=epochs,
    steps_per_epoch=len(train_generator),
    validation_steps=len(val_generator)
)

#  Évaluation du modèle sur les données de test
test_loss, test_acc = model.evaluate(test_generator)
print(f"🎯 Précision sur le test: {test_acc:.2f}")

# Sauvegarde et téléchargement du modèle
model.save("emotion_model.h5")
from google.colab import files
files.download("emotion_model.h5")

# Utilisation du modèle sauvegardé sur VS Code
# Installation de TensorFlow si nécessaire
!pip install tensorflow keras numpy matplotlib

# Chargement du modèle entraîné
from tensorflow.keras.models import load_model
model = load_model("emotion_model.h5")

#  Prédiction sur une image d'entrée
import cv2
img = cv2.imread("image_a_predire.jpg")
img = cv2.resize(img, (48, 48))
img = img / 255.0
img = np.expand_dims(img, axis=0)

prediction = model.predict(img)
print("Émotion prédite :", np.argmax(prediction))
