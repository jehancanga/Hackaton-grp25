// src/services/apiPosts.js
import axios from "axios";
import { API_URL, getAuthHeaders } from "./api";


const POSTS_URL = `${API_URL}/tweets`;

// 📝 **Créer un tweet**
export const createTweet = async (tweetData) => {
  try {
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

// like sur un tweet**
export const likeTweet = async (tweetId) => {
  try {
      const response = await axios.post(
          `${POSTS_URL}/${tweetId}/like`, 
          {}, 
          getAuthHeaders()
      );
      return response.data;
  } catch (error) {
      console.error('Error liking tweet:', error);
      throw error;
  }
};

// 💔 **Annuler un like sur un tweet**
export const unlikeTweet = async (tweetId) => {
  try {
      const response = await axios.post(
          `${POSTS_URL}/${tweetId}/like`, 
          {}, 
          getAuthHeaders()
      );
      return response.data;
  } catch (error) {
      console.error('Error unliking tweet:', error);
      throw error;
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

export const likeComment = async (commentId) => {
  try {
    const response = await axios.post(`${API_URL}/comments/${commentId}/like`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur like commentaire:", error.response?.data || error.message);
    throw error;
  }
};

export const retweet = async (tweetId) => {
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

export const unretweet = async (tweetId) => {
  try {
    const response = await axios.post(
      `${POSTS_URL}/${tweetId}/retweet`,
      {},
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'annulation du retweet:', error);
    throw error;
  }
};


export const getTweetsByHashtag = async (hashtag) => {
  try {
    // S'assurer que le hashtag n'a pas déjà un # devant
    const cleanHashtag = hashtag.startsWith('#') ? hashtag.substring(1) : hashtag;
    console.log("API: Recherche des tweets pour hashtag:", cleanHashtag);
    
    const response = await fetch(`/api/hashtag/${cleanHashtag}`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("API: Données reçues:", data);
    
    return data.tweets || data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des tweets par hashtag:', error);
    throw error;
  }
};
