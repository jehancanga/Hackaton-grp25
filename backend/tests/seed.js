// seed.js
// Script pour initialiser la base de données avec 25 utilisateurs et 100 tweets
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Tweet from '../models/Tweet.js';
import dotenv from 'dotenv';

dotenv.config();

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongodb:27017/biblio')
  .then(() => console.log('🔌 Connecté à MongoDB'))
  .catch(err => {
    console.error('❌ Erreur de connexion MongoDB:', err);
    process.exit(1);
  });

// Catégories et émotions
const CATEGORIES = [
  "Technology", "Science", "Sports", "Entertainment", "Politics", 
  "Health", "Education", "Business", "Travel", "Food", 
  "Fashion", "Music", "Art", "Gaming", "Environment"
];

const EMOTIONS = ["happy", "sad", "angry", "fear", "disgust", "surprise", "neutral"];

// 25 utilisateurs de test
const users = Array.from({ length: 25 }, (_, i) => ({
  username: `user${i + 1}`,
  email: `user${i + 1}@example.com`,
  password: 'password123',
  profilePic: `https://robohash.org/${i + 1}?set=set4`, // Avatars générés dynamiquement
  bio: `Bio de l'utilisateur ${i + 1}. Un texte descriptif pour présenter le profil.`,
  followers: [],
  following: [],
  isAdmin: i === 0 // Premier utilisateur est admin
}));

// Générateur de contenu de tweets
function generateTweetContent(category) {
  const contents = {
    Technology: [
      "Je viens de découvrir cette nouvelle technologie, c'est incroyable! #tech #innovation",
      "Mon avis sur le dernier smartphone du marché #mobile #tech #review",
      "L'IA va transformer notre façon de travailler #ia #tech #futur",
      "Premier pas avec React, c'est vraiment puissant! #webdev #javascript #coding",
      "L'avenir de la blockchain me passionne de plus en plus #blockchain #crypto #tech",
      "Qui a testé le nouveau framework? Je suis impressionné! #dev #coding #framework",
      "Article intéressant sur l'évolution des langages de programmation #dev #programming"
    ],
    Science: [
      "Cette découverte scientifique va changer notre compréhension de l'univers #science #astronomy",
      "Fascinant article sur les trous noirs #physics #space #science",
      "Les avancées en génétique sont prometteuses #biology #science #research",
      "La science des matériaux progresse rapidement #materials #science #innovation",
      "Quelles sont les implications éthiques de cette recherche? #science #ethics #debate",
      "Les neurosciences m'ont toujours passionné #neuroscience #brain #research",
      "La science du climat est cruciale pour notre avenir #climate #science #research"
    ],
    Sports: [
      "Quel match incroyable hier soir! #football #sports #match",
      "Mon équipe a encore gagné! Tellement fier #sports #victory #team",
      "Nouvelle saison, nouveaux espoirs #sports #season #competition",
      "Mon avis sur les transferts récents #sports #transfers #opinion",
      "Qui va gagner le championnat cette année? #sports #championship #prediction",
      "Je commence un nouveau sport cette semaine #fitness #sports #training",
      "Les JO approchent, j'ai hâte! #olympics #sports #competition"
    ],
    Entertainment: [
      "Ce film est absolument à voir! #cinema #movie #mustwatch",
      "Nouvelle série addictive sur Netflix #series #tv #entertainment",
      "Concert incroyable hier soir, quelle ambiance! #music #concert #live",
      "Ce livre m'a vraiment touché #books #reading #story",
      "L'industrie du divertissement se transforme rapidement #entertainment #future",
      "Qui a vu la dernière adaptation de ce roman? #movies #adaptation #opinion",
      "Festival génial ce weekend! #festival #entertainment #weekend"
    ],
    Politics: [
      "Les dernières décisions politiques me laissent perplexe #politics #news",
      "Débat intéressant sur les réformes actuelles #politics #debate #reform",
      "L'impact de cette loi sur notre quotidien #law #politics #impact",
      "Quelles solutions face à ces défis? #politics #solutions #debate",
      "La politique internationale devient de plus en plus complexe #geopolitics #international",
      "La démocratie a besoin de citoyens informés #democracy #politics #citizens",
      "Comprendre les enjeux de cette élection #politics #election #stakes"
    ],
    Health: [
      "Nouvelle routine de bien-être qui change tout #health #wellness #routine",
      "L'importance du sommeil pour la santé #sleep #health #wellbeing",
      "Ces aliments boostent vraiment l'immunité #nutrition #health #immunity",
      "Mon parcours pour une meilleure santé mentale #mentalhealth #wellbeing",
      "La méditation a transformé mon quotidien #meditation #mindfulness #health",
      "L'équilibre entre vie pro et santé #worklifebalance #health #wellness",
      "Nouvelles recherches sur cette maladie #health #research #medicine"
    ],
    Education: [
      "L'apprentissage en ligne transforme l'éducation #education #elearning",
      "Ces ressources gratuites pour apprendre sont géniales #learning #education #resources",
      "La pédagogie évolue, et c'est fascinant #education #pedagogy #teaching",
      "Mon expérience de formation continue #education #lifelonglearning",
      "L'éducation est la clé du développement #education #development #future",
      "Comment motiver les élèves aujourd'hui? #education #motivation #teaching",
      "L'intelligence émotionnelle dans l'éducation #education #emotionalintelligence"
    ],
    Business: [
      "Stratégies efficaces pour les startups en 2025 #business #startup #strategy",
      "Le leadership moderne se réinvente #business #leadership #management",
      "Comment j'ai développé mon entreprise #business #entrepreneurship #growth",
      "Les tendances marketing à suivre #marketing #business #trends",
      "L'économie circulaire représente l'avenir #business #circulareconomy #sustainability",
      "La transformation digitale des entreprises #business #digital #transformation",
      "L'intelligence économique est cruciale #business #intelligence #strategy"
    ],
    Travel: [
      "Mon voyage incroyable à Bali #travel #bali #vacation",
      "Ces destinations méconnues valent le détour #travel #destinations #discovery",
      "Conseils pour voyager léger et efficace #travel #tips #packing",
      "L'authenticité de cette région m'a conquis #travel #authentic #experience",
      "Voyage en solo: une expérience transformative #travel #solo #experience",
      "Carnet de voyage: mes impressions sur cette ville #travel #citytrip #diary",
      "Le tourisme responsable, c'est possible #travel #sustainable #responsible"
    ],
    Food: [
      "Cette recette de risotto est divine! #food #recipe #italian",
      "Découverte d'un restaurant exceptionnel #food #restaurant #gastronomy",
      "Les saveurs de cette cuisine m'ont surpris #food #cuisine #discovery",
      "Ma version revisitée de ce classique #food #cooking #recipe",
      "Le plaisir des produits de saison #food #seasonal #cooking",
      "Alimentation saine: mes astuces quotidiennes #food #healthy #tips",
      "La pâtisserie: mon nouveau hobby #food #baking #pastry"
    ],
    Fashion: [
      "Les tendances mode de cette saison #fashion #trends #style",
      "Comment créer une garde-robe durable #fashion #sustainable #wardrobe",
      "Ce créateur révolutionne la mode #fashion #designer #innovation",
      "Mon style personnel évolue #fashion #personalstyle #evolution",
      "La mode éthique gagne du terrain #fashion #ethical #conscious",
      "Ces accessoires transforment une tenue basique #fashion #accessories #style",
      "L'histoire fascinante de cette maison de couture #fashion #history #luxury"
    ],
    Music: [
      "Cet album va marquer 2025 #music #album #review",
      "Concert inoubliable hier soir #music #concert #live",
      "L'évolution de ce genre musical me fascine #music #genre #evolution",
      "Ma playlist pour booster la productivité #music #productivity #playlist",
      "Ce nouvel artiste mérite plus de reconnaissance #music #artist #discovery",
      "L'influence de la musique sur nos émotions #music #emotions #psychology",
      "Le retour aux vinyles: tendance ou révolution? #music #vinyl #trend"
    ],
    Art: [
      "Cette exposition m'a profondément touché #art #exhibition #emotion",
      "L'art contemporain nous questionne #art #contemporary #meaning",
      "Mon processus créatif en tant qu'artiste #art #creative #process",
      "Cette œuvre méconnue est fascinante #art #artwork #discovery",
      "L'art urbain transforme nos villes #art #urban #streetart",
      "La frontière entre art et technologie s'estompe #art #technology #digital",
      "L'expression artistique comme thérapie #art #therapy #expression"
    ],
    Gaming: [
      "Ce nouveau jeu est addictif! #gaming #videogames #review",
      "L'e-sport devient mainstream #gaming #esport #competition",
      "L'évolution des jeux indépendants #gaming #indiegames #development",
      "Ces jeux ont marqué mon enfance #gaming #nostalgia #classics",
      "Le game design est un art sous-estimé #gaming #gamedesign #art",
      "Les jeux vidéo comme outil d'apprentissage #gaming #education #learning",
      "L'immersion en réalité virtuelle progresse #gaming #vr #immersion"
    ],
    Environment: [
      "Actions concrètes pour réduire son impact écologique #environment #sustainability #action",
      "La biodiversité est en danger #environment #biodiversity #conservation",
      "Solutions innovantes face au changement climatique #environment #climate #innovation",
      "Mon jardin urbain: reconnecter avec la nature #environment #urbangardening #nature",
      "Le zéro déchet: mon parcours et mes conseils #environment #zerowaste #tips",
      "Ces initiatives environnementales inspirantes #environment #initiatives #positive",
      "L'importance des océans pour notre planète #environment #ocean #protection"
    ]
  };

  return contents[category][Math.floor(Math.random() * contents[category].length)];
}

// Générateur d'URL d'image selon la catégorie
function generateImageUrl(category) {
  // 30% de chance de ne pas avoir d'image
  if (Math.random() < 0.3) {
    return "";
  }
  
  const imagesByCategory = {
    Technology: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop"
    ],
    Science: [
      "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1564325724739-bae0bd08762c?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop"
    ],
    Sports: [
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&h=400&fit=crop"
    ],
    Entertainment: [
      "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1603190287605-e6ade32fa852?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop"
    ],
    Politics: [
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1575320181282-9afab399332c?w=600&h=400&fit=crop"
    ],
    Health: [
      "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&h=400&fit=crop", 
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=600&h=400&fit=crop"
    ],
    Education: [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&h=400&fit=crop"
    ],
    Business: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=600&h=400&fit=crop"
    ],
    Travel: [
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=600&h=400&fit=crop"
    ],
    Food: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop"
    ],
    Fashion: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop"
    ],
    Music: [
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&h=400&fit=crop"
    ],
    Art: [
      "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&h=400&fit=crop"
    ],
    Gaming: [
      "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=400&fit=crop"
    ],
    Environment: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop"
    ]
  };
  
  const categoryImages = imagesByCategory[category] || imagesByCategory["Technology"];
  return categoryImages[Math.floor(Math.random() * categoryImages.length)];
}

// Fonction pour extraire les hashtags d'un contenu
const extractHashtags = (content) => {
  const hashtagRegex = /#(\w+)/g;
  const matches = content.match(hashtagRegex);
  
  if (!matches) return [];
  
  return matches.map(tag => tag.slice(1).toLowerCase());
};

// Fonction pour initialiser la base de données
async function initializeDatabase() {
  try {
    // Vider les collections existantes
    await User.deleteMany({});
    await Tweet.deleteMany({});
    console.log('🧹 Collections nettoyées');

    // Créer les utilisateurs
    const createdUsers = [];
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      createdUsers.push(user);
      console.log(`👤 Utilisateur créé: ${user.username}`);
    }

    // Créer les tweets
    const tweets = [];
    for (let i = 0; i < 100; i++) {
      // Sélectionner une catégorie aléatoire
      const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      
      // Sélectionner une émotion aléatoire
      const emotion = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
      
      // Générer le contenu du tweet en fonction de la catégorie
      const content = generateTweetContent(category);
      
      // Extraire les hashtags
      const hashtags = extractHashtags(content);
      
      // Sélectionner un utilisateur aléatoire
      const randomUserIndex = Math.floor(Math.random() * createdUsers.length);
      const userId = createdUsers[randomUserIndex]._id;
      
      // Générer une URL d'image aléatoire basée sur la catégorie
      const media = generateImageUrl(category);
      
      // Créer le tweet
      const tweet = {
        userId,
        content,
        media,
        hashtags,
        category,
        detectedEmotion: emotion,
        likes: [],
        retweets: [],
        comments: []
      };
      
      tweets.push(tweet);
    }
    
    // Mise à jour du modèle pour ajouter les champs manquants
    const tweetsCollection = mongoose.connection.collection('tweets');
    const result = await tweetsCollection.insertMany(tweets);
    
    console.log(`✅ Initialisation terminée: ${createdUsers.length} utilisateurs et ${tweets.length} tweets créés`);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  } finally {
    // Fermer la connexion
    mongoose.connection.close();
    console.log('🔌 Connexion MongoDB fermée');
  }
}

// Exécuter l'initialisation
initializeDatabase();