import Tweet from "../models/Tweet.js";
import { categorizeTweet, extractHashtags } from "../services/categoryService.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// 📝 Créer un tweet 
export const createTweet = async (req, res) => {
  try {
    const { content, media, hashtags, detectedEmotion } = req.body;
    const userId = req.user._id;

    // Extraire les hashtags du contenu si non fournis
    const extractedHashtags = hashtags || extractHashtags(content);
    
    // Déterminer la catégorie
    const category = categorizeTweet(content, extractedHashtags);

    // Traitement de l'image si elle est fournie en base64
    let mediaUrl = media;
    if (media && media.startsWith('data:image')) {
      try {
        // Extraire le type MIME et les données
        const matches = media.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        
        if (matches && matches.length === 3) {
          const type = matches[1];
          const data = Buffer.from(matches[2], 'base64');
          
          // Générer un nom de fichier unique
          const filename = `tweet_${Date.now()}.${type.split('/')[1] || 'jpg'}`;
          const filePath = path.join(__dirname, '../uploads', filename);
          
          // Créer le répertoire uploads s'il n'existe pas
          if (!fs.existsSync(path.join(__dirname, '../uploads'))) {
            fs.mkdirSync(path.join(__dirname, '../uploads'), { recursive: true });
          }
          
          // Écrire le fichier
          fs.writeFileSync(filePath, data);
          
          // Mettre à jour l'URL de l'image
          mediaUrl = `/uploads/${filename}`;
        }
      } catch (err) {
        console.error("Erreur lors du traitement de l'image:", err);
        // Continuer avec l'URL original si l'enregistrement échoue
      }
    }

    const newTweet = new Tweet({
      userId,
      content,
      media: mediaUrl,
      hashtags: extractedHashtags,
      category,
      detectedEmotion: detectedEmotion || "neutral"
    });

    // Si le tweet contient une image, essayez de détecter l'émotion
    if (mediaUrl && !detectedEmotion) {
      try {
        // Essayer d'analyser l'émotion via le service Flask
        const flaskResponse = await axios.post('http://bot:5000/detect-emotion', {
          image: mediaUrl
        });
        
        if (flaskResponse.data && flaskResponse.data.emotion) {
          newTweet.detectedEmotion = flaskResponse.data.emotion;
        }
      } catch (emotionError) {
        console.warn("Impossible d'analyser l'émotion de l'image:", emotionError.message);
        // Continuer avec la valeur par défaut "neutral"
      }
    }

    const savedTweet = await newTweet.save();
    
    // Populer les informations de l'utilisateur pour le retour
    const populatedTweet = await Tweet.findById(savedTweet._id)
      .populate("userId", "username profilePic");

    res.status(201).json(populatedTweet);
  } catch (error) {
    console.error("Erreur lors de la création du tweet:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Route pour obtenir les tweets par catégorie
export const getTweetsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const tweets = await Tweet.find({ category })
      .populate("userId", "username profilePic")
      .sort({ createdAt: -1 });
    
    if (!tweets.length) {
      return res.status(404).json({ message: "Aucun tweet trouvé dans cette catégorie" });
    }
    
    res.json(tweets);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 📌 Obtenir tous les tweets
export const getTweets = async (req, res) => {
    try {
        const tweets = await Tweet.find().populate("userId", "username profilePic").sort({ createdAt: -1 });
        res.json(tweets);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// 📌 Obtenir les tweets d'un utilisateur spécifique
export const getUserTweets = async (req, res) => {
    try {
        const { id } = req.params;
        const tweets = await Tweet.find({ userId: id })
            .populate("userId", "username profilePic")
            .sort({ createdAt: -1 });

        if (!tweets.length) {
            return res.status(404).json({ message: "Aucun tweet trouvé pour cet utilisateur" });
        }

        res.json(tweets);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};


// ❤️ Liker un tweet
export const likeTweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (!tweet) return res.status(404).json({ message: "Tweet non trouvé" });

        if (tweet.likes.includes(req.user.id)) {
            tweet.likes = tweet.likes.filter(id => id.toString() !== req.user.id);
        } else {
            tweet.likes.push(req.user.id);
        }

        await tweet.save();
        
        // Important : repopuler l'utilisateur avant de renvoyer la réponse
        const populatedTweet = await Tweet.findById(tweet._id)
            .populate("userId", "username profilePic");
        
        res.json(populatedTweet);
    } catch (error) {
        console.error("Erreur like tweet:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


// ❌ Supprimer un tweet
export const deleteTweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (!tweet) return res.status(404).json({ message: "Tweet non trouvé" });

        if (tweet.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Action non autorisée" });
        }

        await tweet.deleteOne();
        res.json({ message: "Tweet supprimé" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};


// Retweet un tweet
export const retweetTweet = async (req, res) => {
    try {
      const originalTweetId = req.params.id;
      const userId = req.user.id;
  
      const originalTweet = await Tweet.findById(originalTweetId);
      if (!originalTweet) {
        return res.status(404).json({ message: "Tweet non trouvé" });
      }
  
      const existingRetweet = await Tweet.findOne({
        isRetweet: true,
        originalTweetId: originalTweetId,
        retweetedBy: userId
      });
  
      if (existingRetweet) {
        await Tweet.findByIdAndDelete(existingRetweet._id);
  
        originalTweet.retweets = originalTweet.retweets.filter(
          id => id.toString() !== userId
        );
        await originalTweet.save();
  
        return res.json({
          message: "Retweet supprimé",
          originalTweet: await Tweet.findById(originalTweetId)
            .populate("userId", "username profilePic")
            .populate("retweets", "username profilePic")
        });
      }
  
      const retweet = new Tweet({
        content: originalTweet.content,
        userId: originalTweet.userId, // Conserver l'auteur original
        isRetweet: true,
        originalTweetId: originalTweetId,
        retweetedBy: userId,
     });
  
      await retweet.save();
  
       if (!originalTweet.retweets.includes(userId)) {
        originalTweet.retweets.push(userId);
        await originalTweet.save();
      }
  
     
      const populatedOriginalTweet = await Tweet.findById(originalTweetId)
        .populate("userId", "username profilePic")
        .populate("retweets", "username profilePic");
  
      const populatedRetweet = await Tweet.findById(retweet._id)
        .populate("userId", "username profilePic")
        .populate("retweetedBy", "username profilePic");
  
      return res.status(201).json({
        message: "Retweet créé",
        originalTweet: populatedOriginalTweet,
        retweet: populatedRetweet
      });
    } catch (error) {
      console.error("Erreur lors du retweet:", error);
      return res.status(500).json({ message: "Erreur serveur lors du retweet" });
    }
  };
  
  
  // Annuler un retweet
  export const unretweetPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post non trouvé" });
  
        post.retweets = post.retweets.filter(id => id.toString() !== req.user.id);
        await post.save();
        
        // Repopuler l'utilisateur avant de retourner
        const populatedPost = await Post.findById(post._id)
            .populate("userId", "username profilePic");
        
        res.json(populatedPost);
    } catch (error) {
        console.error("Erreur annulation retweet:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
  };

// Fonction pour récupérer les tweets par émotion
export const getTweetsByEmotion = async (req, res) => {
  try {
    const { emotion } = req.params;
    
    // Vérifier si l'émotion est valide
    const validEmotions = ["angry", "disgust", "fear", "happy", "sad", "surprise", "neutral"];
    if (!validEmotions.includes(emotion)) {
      return res.status(400).json({ message: "Émotion non valide" });
    }
    
    // Récupérer les tweets avec cette émotion
    const tweets = await Tweet.find({ detectedEmotion: emotion })
      .populate("userId", "username profilePic")
      .sort({ createdAt: -1 });
    
    res.status(200).json(tweets);
  } catch (error) {
    console.error("Erreur lors de la récupération des tweets par émotion:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Fonction pour récupérer les tweets recommandés par émotion
export const getRecommendedTweetsByEmotion = async (req, res) => {
  try {
    const { emotion } = req.params;
    const userId = req.user._id;
    
    // Vérifier si l'émotion est valide
    const validEmotions = ["angry", "disgust", "fear", "happy", "sad", "surprise", "neutral"];
    if (!validEmotions.includes(emotion)) {
      return res.status(400).json({ message: "Émotion non valide" });
    }
    
    // Obtenir les recommandations
    const recommendedTweets = await getRecommendedTweets(emotion);
    
    res.status(200).json(recommendedTweets);
  } catch (error) {
    console.error("Erreur lors de la récupération des tweets recommandés:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
  