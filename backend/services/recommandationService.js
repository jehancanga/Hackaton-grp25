import Tweet from "../models/Tweet.js";

// Map des émotions vers les catégories préférées
const EMOTION_CATEGORY_MAPPING = {
  "happy": ["Entertainment", "Music", "Food", "Travel", "Gaming"],
  "sad": ["Music", "Art", "Health", "Environment"],
  "angry": ["Politics", "Technology", "Gaming", "Sports"],
  "surprise": ["Science", "Technology", "Entertainment", "Gaming"],
  "disgust": ["Environment", "Health", "Politics"],
  "fear": ["Health", "Environment", "Science"],
  "neutral": ["Technology", "Business", "Education", "Science"]
};

// Fonction pour obtenir des recommandations basées sur l'émotion
export const getRecommendedTweets = async (emotion, limit = 10) => {
  try {
    // Obtenir les catégories recommandées pour cette émotion
    const recommendedCategories = EMOTION_CATEGORY_MAPPING[emotion] || 
      EMOTION_CATEGORY_MAPPING["neutral"];
    
    // Trouver les tweets dans ces catégories
    const tweets = await Tweet.find({ 
      category: { $in: recommendedCategories } 
    })
    .populate("userId", "username profilePic")
    .sort({ createdAt: -1, likes: -1 })
    .limit(limit);
    
    return tweets;
  } catch (error) {
    console.error("Erreur lors de la récupération des recommandations:", error);
    throw error;
  }
};