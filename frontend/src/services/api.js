// src/services/api.js
import axios from "axios";

const API_URL = "http://localhost:3000/api";

// Fonction pour récupérer le token JWT depuis le localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken"); // Utiliser la même clé partout
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};


// 📌 Authentification
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Erreur d'inscription :", error.response?.data);
    return null;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, credentials);
    // Stocker le token avec la clé "authToken"
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      // Stocker aussi les données de l'utilisateur si nécessaire
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    }
    return response.data;
  } catch (error) {
    console.error("Erreur de connexion :", error.response?.data);
    return null;
  }
};


export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// 👤 **Utilisateur**
export const getUserProfile = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/profile/${userId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur récupération profil :", error.response?.data);
    return null;
  }
};


export const updateUserProfile = async (formData) => {
  try {
    // Récupérer directement le token
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("Non authentifié");
    }
    
    // Configuration pour axios avec le token
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    
    const response = await axios.put(
      `${API_URL}/users/profile`,
      formData,
      config
    );
    
    return response.data;
  } catch (error) {
    console.error("Erreur mise à jour profil :", error.response?.data);
    throw error;
  }
};


export const followUser = async (userId) => {
  try {
    const response = await axios.post(`${API_URL}/users/follow/${userId}`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur follow :", error.response?.data);
    return null;
  }
};

export const unfollowUser = async (userId) => {
  try {
    const response = await axios.post(`${API_URL}/users/unfollow/${userId}`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur unfollow :", error.response?.data);
    return null;
  }
};

export const blockUser = async (userId) => {
  try {
    const response = await axios.post(`${API_URL}/users/${userId}/block`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur blocage utilisateur :", error.response?.data);
    return null;
  }
};

export const unblockUser = async (userId) => {
  try {
    const response = await axios.post(`${API_URL}/users/${userId}/unblock`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur déblocage utilisateur :", error.response?.data);
    return null;
  }
};

// 📩 **Messages**
export const sendMessage = async (messageData) => {
  try {
    const response = await axios.post(`${API_URL}/messages`, messageData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur envoi message :", error.response?.data);
    return null;
  }
};

export const getMessages = async (conversationId) => {
  try {
    const response = await axios.get(`${API_URL}/messages/${conversationId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur récupération messages :", error.response?.data);
    return null;
  }
};

export const markMessageAsRead = async (messageId) => {
  try {
    const response = await axios.put(`${API_URL}/messages/${messageId}/read`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur lecture message :", error.response?.data);
    return null;
  }
};

// 🔔 **Notifications**
export const getNotifications = async () => {
  try {
    const response = await axios.get(`${API_URL}/notifications`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur récupération notifications :", error.response?.data);
    return null;
  }
};

export const markNotificationAsRead = async (notifId) => {
  try {
    const response = await axios.put(`${API_URL}/notifications/${notifId}/read`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur lecture notification :", error.response?.data);
    return null;
  }
};

// 📝 **Tweets**
export const createTweet = async (tweetData) => {
  try {
    const response = await axios.post(`${API_URL}/tweets`, tweetData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur création tweet :", error.response?.data);
    return null;
  }
};

export const getAllTweets = async () => {
  try {
    const response = await axios.get(`${API_URL}/tweets`);
    return response.data;
  } catch (error) {
    console.error("Erreur récupération tweets :", error.response?.data);
    return null;
  }
};

export const getUserTweets = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/tweets/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur récupération tweets utilisateur :", error.response?.data);
    return null;
  }
};

export const likeTweet = async (tweetId) => {
  try {
    const response = await axios.post(`${API_URL}/tweets/${tweetId}/like`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur like tweet :", error.response?.data);
    return null;
  }
};

export const retweet = async (tweetId) => {
  try {
    const response = await axios.post(`${API_URL}/tweets/${tweetId}/retweet`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur retweet :", error.response?.data);
    return null;
  }
};

export const deleteTweet = async (tweetId) => {
  try {
    const response = await axios.delete(`${API_URL}/tweets/${tweetId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur suppression tweet :", error.response?.data);
    return null;
  }
};

// 💬 **Commentaires**
export const addComment = async (tweetId, commentData) => {
  try {
    const response = await axios.post(`${API_URL}/comments/${tweetId}`, commentData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur ajout commentaire :", error.response?.data);
    return null;
  }
};

export const getComments = async (tweetId) => {
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
    console.error("Erreur like commentaire :", error.response?.data);
    return null;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(`${API_URL}/comments/${commentId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur suppression commentaire :", error.response?.data);
    return null;
  }
};
