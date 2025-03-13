import axios from 'axios';

const BASE_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const COMMENTS_API_URL = `${BASE_API_URL}/comments`;

// Fonction utilitaire pour les en-têtes d'authentification
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  };
};

// Obtenir les commentaires d'un tweet
export const getComments = async (tweetId) => {
  try {
    const response = await axios.get(`${COMMENTS_API_URL}/${tweetId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur récupération commentaires:", error.response?.data || error.message);
    throw error;
  }
};

// Ajouter un commentaire à un tweet
export const addComment = async (tweetId, content) => {
  try {
    const response = await axios.post(
      `${COMMENTS_API_URL}/${tweetId}`, 
      { content }, 
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Erreur ajout commentaire:", error.response?.data || error.message);
    throw error;
  }
};

// Liker/Unliker un commentaire (toggle)
export const likeComment = async (commentId) => {
  try {
    const response = await axios.post(
      `${COMMENTS_API_URL}/${commentId}/like`, 
      {}, 
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Erreur like commentaire:", error.response?.data || error.message);
    throw error;
  }
};

// Supprimer un commentaire
export const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(
      `${COMMENTS_API_URL}/${commentId}`, 
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Erreur suppression commentaire:", error.response?.data || error.message);
    throw error;
  }
};
