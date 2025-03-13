import axios from "axios";
import { API_URL, getAuthHeaders } from "./api";

const POSTS_URL = `${API_URL}/tweets`;

// 📝 **Créer un tweet**
export const createTweet = async (tweetData) => {
  try {
    // tweetData peut maintenant contenir detectedEmotion
    console.log("📤 Envoi du tweet avec émotion:", tweetData);
    
    const response = await axios.post(POSTS_URL, tweetData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de la création du tweet :", error.response?.data);
    return null;
  }
};

// 📌 **Obtenir tous les tweets**
export const getAllTweets = async () => {
  try {
    const response = await axios.get(POSTS_URL);
    return response.data;
  } catch (error) {
    console.error("Erreur récupération tweets :", error.response?.data);
    return null;
  }
};

// 👤 **Obtenir les tweets d'un utilisateur**
export const getUserTweets = async (userId) => {
  try {
    const response = await axios.get(`${POSTS_URL}/user/${userId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("❌ Erreur récupération tweets utilisateur :", error.response?.data);
    return null;
  }
};


// ❌ **Supprimer un tweet**
export const deleteTweet = async (tweetId) => {
  try {
    const response = await axios.delete(`${POSTS_URL}/${tweetId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur suppression tweet :", error.response?.data);
    return null;
  }
};

// 📌 **Obtenir les tweets**
export const fetchPosts = async () => {
  try {
    const response = await fetch(`${API_URL}/posts`);
    if (!response.ok) throw new Error("Erreur réseau");
    return await response.json();
  } catch (error) {
    console.error("Erreur API:", error);
    throw error;
  }
};

// 🔄 **Annuler un retweet**
export const unretweet = async (tweetId) => {
  try {
    const response = await axios.delete(`${POSTS_URL}/${tweetId}/retweet`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur unretweet :", error.response?.data);
    return null;
  }
};

// 📌 **Obtenir des tweets recommandés**
export const getRecommendedTweets = async (emotion) => {
  try {
    const response = await axios.get(`${POSTS_URL}/recommendations/${emotion}`, getAuthHeaders());
    console.log(`📊 Tweets recommandés pour l'émotion ${emotion}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Erreur récupération recommandations pour ${emotion}:`, error.response?.data);
    return null;
  }
};

// 📌 **Obtenir les tweets par catégorie**
export const getTweetsByCategory = async (category) => {
  try {
    const response = await axios.get(`${POSTS_URL}/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Erreur récupération tweets catégorie ${category}:`, error.response?.data);
    return null;
  }
};

// 💬 **Commenter un tweet**
export const commentTweet = async (tweetId, commentData) => {
  try {
    const response = await axios.post(`${API_URL}/comments/${tweetId}`, commentData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur commentaire tweet :", error.response?.data);
    return null;
  }
};

// 💬 **Récupérer les commentaires d'un tweet**
export const getTweetComments = async (tweetId) => {
  try {
    const response = await axios.get(`${API_URL}/comments/${tweetId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur récupération commentaires :", error.response?.data);
    return null;
  }
};

// ❤️ **Liker un commentaire**
export const likeComment = async (commentId) => {
  try {
    const response = await axios.post(`${API_URL}/comments/${commentId}/like`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur like commentaire:", error.response?.data || error.message);
    throw error;
  }
};


export const retweetPost = async (tweetId) => {
  try {
    const response = await axios.post(
      `${POSTS_URL}/${tweetId}/retweet`,
      {},
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors du retweet:', error);
    throw error;
  }
};


export const unretweet = async (postId) => {
  // Si vous utilisez le même endpoint pour toggle, cette fonction est identique à retweet
  // Sinon, ajustez l'URL selon votre API
  try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/posts/${postId}/retweet`, {
          method: 'POST', // ou 'DELETE' selon votre API
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          }
      });
      
      if (!response.ok) {
          throw new Error("Erreur lors de l'annulation du retweet");
      }
      
      return await response.json();
  } catch (error) {
      console.error('Erreur unretweet:', error);
      throw error;
  }
};

