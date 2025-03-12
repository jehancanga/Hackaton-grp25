import Tweet from "../models/Tweet.js";
import { categorizeTweet, extractHashtags } from "../services/categoryService.js";

// 📝 Créer un tweet 
export const createTweet = async (req, res) => {
  try {
    const { content, media, detectedEmotion } = req.body;
    
    // Extraire les hashtags du contenu
    const hashtags = extractHashtags(content);
    
    // Déterminer la catégorie du tweet
    const category = categorizeTweet(content, hashtags);
    
    const tweet = await Tweet.create({ 
      userId: req.user.id, 
      content, 
      media, 
      hashtags,
      category,
      detectedEmotion: detectedEmotion || "neutral"
    });
    
    res.status(201).json(tweet);
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

// Route pour obtenir des recommandations
export const getRecommendedTweetsByEmotion = async (req, res) => {
  try {
    const { emotion } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    
    const tweets = await getRecommendedTweets(emotion, limit);
    
    if (!tweets.length) {
      return res.status(404).json({ message: "Aucune recommandation trouvée" });
    }
    
    res.json(tweets);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Route pour obtenir les tweets par émotion
export const getTweetsByEmotion = async (req, res) => {
  try {
    const { emotion } = req.params;
    const tweets = await Tweet.find({ detectedEmotion: emotion })
      .populate("userId", "username profilePic")
      .sort({ createdAt: -1 });
    
    if (!tweets.length) {
      return res.status(404).json({ message: "Aucun tweet trouvé avec cette émotion" });
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
        res.json(tweet);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// 🔄 Retweeter un tweet
export const retweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (!tweet) return res.status(404).json({ message: "Tweet non trouvé" });

        tweet.retweets.push(req.user.id);
        await tweet.save();
        res.json(tweet);
    } catch (error) {
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
