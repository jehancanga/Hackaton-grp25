// src/services/apiPosts.js
import axios from "axios";
import { API_URL, getAuthHeaders } from "./api";

const POSTS_URL = `${API_URL}/tweets`;

// 📝 **Créer un tweet**
export const createTweet = async (tweetData) => {
  try {
    console.log("📤 Envoi du tweet :", tweetData);
    
    const response = await axios.post(POSTS_URL, tweetData, getAuthHeaders());

    console.log("✅ Réponse du serveur :", response.data);
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

// ❤️ **Liker un tweet**
export const likeTweet = async (tweetId) => {
  try {
    const response = await axios.post(`${POSTS_URL}/${tweetId}/like`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur like tweet :", error.response?.data);
    return null;
  }
};

// 🔄 **Retweeter un tweet**
export const retweet = async (tweetId) => {
  try {
    const response = await axios.post(`${POSTS_URL}/${tweetId}/retweet`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur retweet :", error.response?.data);
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
