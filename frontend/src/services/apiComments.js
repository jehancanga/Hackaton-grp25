// src/services/apiComments.js
import axios from "axios";
import { API_URL, getAuthHeaders } from "./api";

const COMMENTS_URL = `${API_URL}/comments`;

// 💬 **Ajouter un commentaire à un tweet**
export const addComment = async (tweetId, commentData) => {
  try {
    const response = await axios.post(`${COMMENTS_URL}/${tweetId}`, commentData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur ajout commentaire :", error.response?.data);
    return null;
  }
};

// 📌 **Obtenir tous les commentaires d'un tweet**
export const getComments = async (tweetId) => {
  try {
    const response = await axios.get(`${COMMENTS_URL}/${tweetId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur récupération commentaires :", error.response?.data);
    return null;
  }
};

// ❤️ **Liker un commentaire**
export const likeComment = async (commentId) => {
  try {
    const response = await axios.post(`${COMMENTS_URL}/${commentId}/like`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur like commentaire :", error.response?.data);
    return null;
  }
};

// 💔 **Unliker un commentaire**
export const unlikeComment = async (commentId) => {
  try {
    const response = await axios.delete(`${COMMENTS_URL}/${commentId}/like`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur unlike commentaire :", error.response?.data);
    return null;
  }
};

// ❌ **Supprimer un commentaire**
export const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(`${COMMENTS_URL}/${commentId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur suppression commentaire :", error.response?.data);
    return null;
  }
};
