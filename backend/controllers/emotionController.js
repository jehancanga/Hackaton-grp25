import Tweet from "../models/tweetModel.js";
import axios from "axios";

// Méthode pour mettre à jour l'émotion d'un tweet
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

// Méthode pour analyser une image de tweet via le service Flask
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
    
    // Récupérer l'image
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const base64Image = Buffer.from(imageResponse.data).toString('base64');
    const dataURI = `data:image/jpeg;base64,${base64Image}`;
    
    // Envoyer l'image au service Flask
    const flaskResponse = await axios.post('http://flask:5000/detect-emotion', {
      image: dataURI
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
    console.error("Erreur lors de l'analyse d'émotion de l'image:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Méthode de batch pour analyser plusieurs tweets avec des images
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
        // Analyser chaque image
        const imageResponse = await axios.get(tweet.media, { responseType: 'arraybuffer' });
        const base64Image = Buffer.from(imageResponse.data).toString('base64');
        const dataURI = `data:image/jpeg;base64,${base64Image}`;
        
        const flaskResponse = await axios.post('http://flask:5000/detect-emotion', {
          image: dataURI
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