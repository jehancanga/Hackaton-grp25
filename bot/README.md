# Exec dans le rep Bot
cd bot
to connect the link
http://localhost:5000/
file:///home/axel/appDev/Hackaton-grp25/bot/test_emotion.html


# Sur machine local
run myenv en 3.9
python3.9 -m venv myenv
source myenv/bin/activate 

xdg-open test_emotion.html



Fonctionnement de la page Émotions
La page Émotions est une fonctionnalité spécifique à votre application:

Filtrage par émotion:

Elle permet aux utilisateurs de filtrer les tweets en fonction de l'émotion détectée dans le contenu ou l'image.
Les émotions disponibles sont: happy, sad, angry, fear, disgust, surprise, neutral.


Détection d'émotion:

Les émotions sont détectées par votre service Flask (dans le conteneur "bot") qui analyse les images.
Pour les tweets sans image, une émotion par défaut (souvent "neutral") est utilisée.


Recommandations basées sur les émotions:

Le système peut recommander des tweets en fonction de l'émotion actuelle de l'utilisateur.
Par exemple, si l'utilisateur est détecté comme "happy", il verra plus de tweets des catégories Entertainment, Music, Food, Travel.



Pour améliorer l'expérience utilisateur avec ces fonctionnalités, assurez-vous que:

Les hashtags sont correctement stylisés et cliquables.
La détection d'émotion fonctionne pour les images téléchargées.
Le flux se met à jour correctement lors des interactions.
L'interface utilisateur indique clairement les filtres actifs (émotions, hashtags).

Ces fonctionnalités contribuent à créer une expérience sociale riche et interactive dans votre application.RéessayerClaude peut faire des erreurs. Assurez-vous de vérifier ses réponses.



-----------------------------------------------------------------------------------

Fonctionnement de la page Flux (Feed)
La page Flux est la page principale qui affiche les tweets:

Chargement des tweets:

Elle charge tous les tweets ou ceux des utilisateurs que l'utilisateur suit.
Les tweets sont triés par date de création (les plus récents en premier).


Intégration des fonctionnalités:

Like, Retweet, Commentaires: Les utilisateurs peuvent interagir avec les tweets.
Navigation vers les profils: Cliquer sur un nom d'utilisateur mène à son profil.


Mise à jour dynamique:

Lorsqu'un utilisateur interagit avec un tweet (like, retweet), la page est mise à jour sans rechargement complet.



-------------------------------------------------------------------------------------------

Comment fonctionne le hashtag (#)
Les hashtags dans votre application fonctionnent comme suit:

Extraction des hashtags:

Lorsqu'un utilisateur crée un tweet contenant des hashtags (comme "#tech #innovation"), votre backend utilise une expression régulière pour les extraire du contenu.
Ces hashtags sont stockés dans un tableau hashtags dans le modèle Tweet.


Affichage des hashtags:

Dans votre composant Post, les hashtags sont affichés de deux façons:

Directement dans le contenu du tweet avec un style spécial (la fonction renderTextWithHashtags)
En dessous du contenu sous forme de "pills" (petites bulles cliquables)




Filtrage par hashtag:

Dans la page MyPosts, les utilisateurs peuvent filtrer leurs tweets par hashtag en cliquant sur un hashtag.
Le système récupère tous les tweets qui contiennent ce hashtag spécifique.

