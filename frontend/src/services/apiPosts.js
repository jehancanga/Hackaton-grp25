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

// src/services/apiPosts.js - Ajouter les fonctions suivantes

// 💔 **Annuler un like sur un tweet**
export const unlikeTweet = async (tweetId) => {
  try {
    const response = await axios.delete(`${POSTS_URL}/${tweetId}/like`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur unlike tweet :", error.response?.data);
    return null;
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