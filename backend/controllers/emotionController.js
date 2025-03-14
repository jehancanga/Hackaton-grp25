import Tweet from "../models/Tweet.js";
import axios from "axios";

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

// Fonction pour mettre à jour l'émotion d'un tweet
export const updateTweetEmotion = async (req, res) => {
  try {
    const { id } = req.params;
    const { emotion } = req.body;
    
    if (!["angry", "disgust", "fear", "happy", "sad", "surprise", "neutral"].includes(emotion)) {
      return res.status(400).json({ message: "Émotion non valide" });
    }
    
    const tweet = await Tweet.findById(id);
    
    if (!tweet) {
      return res.status(404).json({ message: "Tweet non trouvé" });
    }
    
    // Mise à jour de l'émotion détectée
    tweet.detectedEmotion = emotion;
    await tweet.save();
    
    res.status(200).json(tweet);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'émotion du tweet:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Fonction pour analyser une image de tweet via le service Flask
export const analyzeImageEmotion = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ message: "URL d'image requise" });
    }
    
    const tweet = await Tweet.findById(id);
    
    if (!tweet) {
      return res.status(404).json({ message: "Tweet non trouvé" });
    }
    
    // Récupérer l'image et l'envoyer au service Flask
    try {
      const flaskResponse = await axios.post('http://bot:5000/detect-emotion', {
        image: imageUrl
      });
      
      const { emotion, confidence } = flaskResponse.data;
      
      // Mettre à jour le tweet avec l'émotion détectée
      tweet.detectedEmotion = emotion;
      await tweet.save();
      
      res.status(200).json({
        tweet,
        emotionAnalysis: {
          emotion,
          confidence
        }
      });
    } catch (error) {
      console.error("Erreur avec le service d'analyse:", error);
      res.status(500).json({ message: "Erreur d'analyse de l'image" });
    }
  } catch (error) {
    console.error("Erreur lors de l'analyse d'émotion de l'image:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Fonction pour récupérer les tweets recommandés par émotion
export const getRecommendedTweetsByEmotion = async (req, res) => {
  try {
    const { emotion } = req.params;
    
    // Vérifier si l'émotion est valide
    const validEmotions = ["angry", "disgust", "fear", "happy", "sad", "surprise", "neutral"];
    if (!validEmotions.includes(emotion)) {
      return res.status(400).json({ message: "Émotion non valide" });
    }
    
    // Définir les catégories préférées pour cette émotion
    const emotionCategories = {
      "happy": ["Entertainment", "Music", "Food", "Travel"],
      "sad": ["Music", "Art", "Health"],
      "angry": ["Politics", "News", "Sports"],
      "surprise": ["Science", "Technology", "Entertainment"],
      "disgust": ["Health", "Environment", "Politics"],
      "fear": ["Health", "Science", "News"],
      "neutral": ["Technology", "Business", "Education"]
    };
    
    const categories = emotionCategories[emotion] || emotionCategories["neutral"];
    
    // Récupérer les tweets dans ces catégories
    const tweets = await Tweet.find({ 
      category: { $in: categories } 
    })
    .populate("userId", "username profilePic")
    .sort({ createdAt: -1 })
    .limit(10);
    
    res.status(200).json(tweets);
  } catch (error) {
    console.error("Erreur lors de la récupération des tweets recommandés:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Fonction pour analyser les émotions de plusieurs tweets
export const batchAnalyzeEmotions = async (req, res) => {
  try {
    // Récupérer tous les tweets avec media qui n'ont pas encore d'émotion détectée
    // ou dont l'émotion est "neutral" par défaut
    const tweets = await Tweet.find({
      media: { $ne: "" },
      $or: [
        { detectedEmotion: { $exists: false } },
        { detectedEmotion: "neutral" }
      ]
    }).limit(10); // Limiter pour éviter la surcharge
    
    const results = [];
    
    for (const tweet of tweets) {
      try {
        // Seulement procéder si le tweet a une URL d'image valide
        if (!tweet.media || tweet.media.trim() === "") continue;
        
        // Analyser l'image
        const flaskResponse = await axios.post('http://bot:5000/detect-emotion', {
          image: tweet.media
        });
        
        const { emotion, confidence } = flaskResponse.data;
        
        // Mettre à jour le tweet
        tweet.detectedEmotion = emotion;
        await tweet.save();
        
        results.push({
          tweetId: tweet._id,
          emotion,
          confidence
        });
      } catch (error) {
        console.error(`Erreur lors de l'analyse du tweet ${tweet._id}:`, error);
        results.push({
          tweetId: tweet._id,
          error: error.message
        });
      }
    }
    
    res.status(200).json({
      processed: results.length,
      results
    });
  } catch (error) {
    console.error("Erreur lors de l'analyse d'émotions par lot:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};