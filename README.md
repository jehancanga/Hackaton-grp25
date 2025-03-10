📌 Projet Hackathon - Réseau Social Type Twitter

📖 Description

Ce projet est développé dans le cadre d'un hackathon et a pour objectif de concevoir une application web similaire à Twitter. Chaque utilisateur pourra publier des tweets, interagir avec d'autres utilisateurs, et utiliser un système d'analyse faciale pour détecter les émotions via webcam.

🏗️ Équipe du projet

Le projet est réalisé par un groupe d'étudiants, répartis en plusieurs rôles :

Développement Frontend : React.js

Développement Backend : Node.js / Express

Base de données : MongoDB Atlas

Déploiement : Docker (ou en local si nécessaire)

Intégration IA : Flask avec un modèle CNN pour la reconnaissance faciale

🎯 Fonctionnalités principales

🔹 Publication et gestion des tweets

Publier des messages contenant du texte, des images et vidéos.

Ajout de hashtags et mentions.

Historique des tweets accessibles par tous les utilisateurs.

🔹 Interaction avec les tweets

Like : Exprimer son appréciation d’un tweet.

Retweet : Partager un tweet avec ou sans commentaire.

Réponse : Ajouter un commentaire sous un tweet.

Signet : Sauvegarder un tweet pour plus tard.

🔹 Fil d’actualité personnalisé

Affichage des tweets selon les préférences et interactions.

Suggestions basées sur les tweets likés et retweetés.

Suivi des hashtags les plus populaires.

🔹 Système de notifications

Notification en cas de like, retweet, réponse ou nouveau follower.

Activation/Désactivation des notifications selon les préférences.

🔹 Recherche avancée

Filtrage des tweets par mots-clés, hashtags et popularité.

Recherche par utilisateurs et thématiques.

🔹 Gestion du profil utilisateur

Mise à jour du nom, biographie, photo de profil et bannière.

Consultation des abonnés et abonnements.

🔹 Analyse d’expressions faciales (IA)

Détection des émotions via webcam en temps réel.

Catégories d’émotions : 😃 Joie, 😢 Tristesse, 😡 Colère, 😮 Surprise, 🤢 Dégoût, 😨 Peur, 😐 Neutre.

⚙️ Technologies utilisées

Frontend : React.js, React Router, Axios

Backend : Node.js, Express.js, MongoDB

Authentification : JWT, Bcrypt.js

Conteneurisation : Docker, Docker Compose

Intégration IA : Flask avec un modèle de Deep Learning (CNN)

🚀 Installation & Lancement

🔹 Prérequis

Docker & Docker Compose installés

Node.js et MongoDB installés (si utilisation locale)

🔹 Lancer avec Docker

Dans le dossier du projet, exécutez :

docker-compose up --build

Puis ouvrez le frontend sur : http://localhost:3000

🔹 Lancer sans Docker

1️⃣ Backend

cd backend
npm install
npm start

2️⃣ Frontend

cd frontend
npm install
npm start

3️⃣ MongoDB
Si vous utilisez une base locale, assurez-vous qu’elle est démarrée sur le port 27017.

📌 Routes API principales

📝 Tweets

Méthode

Endpoint

Description

Auth

GET

/api/tweets

Liste tous les tweets

❌

POST

/api/tweets

Publier un tweet

✅

PUT

/api/tweets/:id

Modifier un tweet

✅

DELETE

/api/tweets/:id

Supprimer un tweet

✅

🔐 Utilisateurs

Méthode

Endpoint

Description

POST

/api/users/register

Créer un compte

POST

/api/users/login

Se connecter & obtenir JWT

GET

/api/users/me

Profil utilisateur

🔍 Améliorations possibles

✅ Ajout d’un système de messagerie privée 📩
✅ Implémentation d’un algorithme de recommandation 🤖
✅ Amélioration de l’interface avec un design moderne 🎨

👨‍💻 Équipe

Ce projet est réalisé par Axel Beaugand, Aymane Hajli, Emilie Delrue, Jehan Canga Fanguinove, Louis Barthes et Said Mekaouar. 🎉

⚡ Licence

Projet open-source sous MIT License.

🚀 Bon développement et amusez-vous ! 😊

