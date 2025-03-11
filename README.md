# 📌 Projet Hackathon - Réseau Social Type Twitter

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)

## 📖 Description

Ce projet est développé dans le cadre d'un hackathon et a pour objectif de concevoir une application web similaire à Twitter. Chaque utilisateur pourra publier des tweets, interagir avec d'autres utilisateurs, et utiliser un système d'analyse faciale pour détecter les émotions via webcam.

## 🏗️ Équipe du projet

Le projet est réalisé par un groupe d'étudiants, répartis en plusieurs rôles :
- **Développement Frontend** : React.js
- **Développement Backend** : Node.js / Express
- **Base de données** : MongoDB Atlas
- **Déploiement** : Docker (ou en local si nécessaire)
- **Intégration IA** : Flask avec un modèle CNN pour la reconnaissance faciale

## 🎯 Fonctionnalités principales

### 🔹 Publication et gestion des tweets
- Publier des messages contenant du texte, des images et vidéos.
- Ajout de hashtags et mentions.
- Historique des tweets accessibles par tous les utilisateurs.

### 🔹 Interaction avec les tweets
- **Like** : Exprimer son appréciation d'un tweet.
- **Retweet** : Partager un tweet avec ou sans commentaire.
- **Réponse** : Ajouter un commentaire sous un tweet.
- **Signet** : Sauvegarder un tweet pour plus tard.

### 🔹 Fil d'actualité personnalisé
- Affichage des tweets selon les préférences et interactions.
- Suggestions basées sur les tweets likés et retweetés.
- Suivi des hashtags les plus populaires.

### 🔹 Système de notifications
- Notification en cas de like, retweet, réponse ou nouveau follower.
- Activation/Désactivation des notifications selon les préférences.

### 🔹 Recherche avancée
- Filtrage des tweets par mots-clés, hashtags et popularité.
- Recherche par utilisateurs et thématiques.

### 🔹 Gestion du profil utilisateur
- Mise à jour du nom, biographie, photo de profil et bannière.
- Consultation des abonnés et abonnements.

### 🔹 Analyse d'expressions faciales (IA)
- Détection des émotions via webcam en temps réel.
- Catégories d'émotions : 😃 Joie, 😢 Tristesse, 😡 Colère, 😮 Surprise, 🤢 Dégoût, 😨 Peur, 😐 Neutre.

## ⚙️ Technologies utilisées

- **Frontend** : React.js, React Router, Axios
- **Backend** : Node.js, Express.js, MongoDB
- **Authentification** : JWT, Bcrypt.js
- **Conteneurisation** : Docker, Docker Compose
- **Intégration IA** : Flask avec un modèle de Deep Learning (CNN)

## 🚀 Installation & Lancement

### 📋 Prérequis

- Docker Engine ou Docker Desktop
- Docker Compose (v1 ou v2)
- Droits d'administration pour exécuter Docker (selon votre système)
- Node.js et MongoDB installés (si utilisation locale sans Docker)

### 🔍 Lancement avec notre script run.sh

Notre script `run.sh` facilite la gestion complète de l'application :

```bash
# Rendre le script exécutable
chmod +x run.sh

# Démarrer l'application
./run.sh start
```

#### Commandes disponibles

| Commande | Description |
|----------|-------------|
| `./run.sh start` | Construit et démarre les conteneurs |
| `./run.sh stop` | Arrête les conteneurs |
| `./run.sh restart` | Redémarre les conteneurs |
| `./run.sh logs` | Affiche les logs en temps réel |
| `./run.sh build` | Reconstruit les images sans cache |
| `./run.sh clean` | Supprime tous les conteneurs et volumes |
| `./run.sh help` | Affiche l'aide |

### 🔹 Lancer avec Docker Compose directement

Dans le dossier du projet, exécutez :
```bash
docker-compose up --build
```

### 🔹 Lancer sans Docker

#### 1️⃣ Backend
```bash
cd backend
npm install
npm start
```

#### 2️⃣ Frontend
```bash
cd frontend
npm install
npm start
```

#### 3️⃣ MongoDB
Si vous utilisez une base locale, assurez-vous qu'elle est démarrée sur le port 27017.

## 🔌 Accès aux services

Après le démarrage, vous pouvez accéder aux différents services :

- **Frontend (React)** : [http://localhost](http://localhost)
- **Backend (Node.js API)** : [http://localhost:8080/api](http://localhost:8080/api)

## 📌 Routes API principales

### 📝 Tweets

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | /api/tweets | Liste tous les tweets | ❌ |
| POST | /api/tweets | Publier un tweet | ❌ |
| PUT | /api/tweets/:id | Modifier un tweet | ❌ |
| DELETE | /api/tweets/:id | Supprimer un tweet | ❌ |

### 🔐 Utilisateurs

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/users/register | Créer un compte |
| POST | /api/users/login | Se connecter & obtenir JWT |
| GET | /api/users/me | Profil utilisateur |

## 🛠️ Résolution des problèmes courants

### Docker daemon introuvable

Si vous rencontrez l'erreur "Cannot connect to the Docker daemon" :

```bash
# Sur Linux, démarrez le service Docker
sudo systemctl start docker

# Ajoutez votre utilisateur au groupe Docker pour éviter d'utiliser sudo
sudo usermod -aG docker $USER
# Déconnectez-vous et reconnectez-vous pour appliquer les changements
```

### Problèmes de permissions

```bash
# Si vous rencontrez des problèmes de permissions
sudo chown $USER:$USER run.sh
chmod +x run.sh
```

### Ports déjà utilisés

Si les ports 80 ou 8080 sont déjà utilisés, modifiez docker-compose.yml pour changer les mappings de ports.

## 📁 Structure du projet

```
.
├── docker-compose.yml    # Configuration Docker
├── run.sh                # Script de gestion principal
├── frontend/             # Application React
│   ├── Dockerfile        # Configuration Docker frontend
│   ├── nginx.conf        # Configuration Nginx (production)
│   └── ...               # Code source React
└── backend/              # API Node.js
    ├── Dockerfile        # Configuration Docker backend
    ├── server.js         # Point d'entrée du serveur
    └── ...               # Code source Node.js
```

## 🔍 Améliorations possibles

- ✅ Ajout d'un système de messagerie privée 📩
- ✅ Implémentation d'un algorithme de recommandation 🤖
- ✅ Amélioration de l'interface avec un design moderne 🎨

## 👨‍💻 Équipe

Ce projet est réalisé par Axel Beaugand, Aymane Hajli, Emilie Delrue, Jehan Canga Fanguinove, Louis Barthes et Said Mekaouar. 🎉

## 📁 Gestion du projet

Sous Microsofts Lists :
https://testipformation-my.sharepoint.com/:l:/g/personal/a_beaugrand_ecole-ipssi_net/FEm1GV1Bd6hElWGJlpXtQ4oBM_Gir0Wmjrhv2HeLVsrxyQ?e=Wz1UIT 

## ⚡ Licence

Projet open-source sous MIT License.
