// src/services/apiUsers.js
import axios from "axios";
import { getAuthHeaders } from "./api";

const API_URL = "http://localhost:3000/api/users";

// 📌 Authentification
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Erreur d'inscription :", error.response?.data);
    return null;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
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
    const response = await axios.get(`${API_URL}/profile/${userId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur récupération profil :", error.response?.data);
    return null;
  }
};


export const updateUserProfile = async (data) => {
  try {
    // Récupérer directement le token
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error("Non authentifié");
    }

    // 🚀 Log des données envoyées avant envoi
    console.log("📤 Données envoyées au backend :", data);

    // Configuration pour axios avec le bon format JSON
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' // 🔥 On force l'envoi en JSON
      }
    };

    const response = await axios.put(
      `${API_URL}/profile`,
      JSON.stringify(data), // 🔥 On envoie un JSON au lieu d'un FormData
      config
    );

    // ✅ Log de la réponse reçue
    console.log("✅ Réponse du serveur :", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ Erreur mise à jour profil :", error.response?.data);

    // 🔴 Log complet de l'erreur serveur
    if (error.response) {
      console.log("🔴 Erreur complète du serveur :", error.response);
    }

    throw error;
  }
};

export const followUser = async (userId) => {
  try {
    const response = await axios.post(`${API_URL}/follow/${userId}`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur follow :", error.response?.data);
    return null;
  }
};

export const unfollowUser = async (userId) => {
  try {
    const response = await axios.post(`${API_URL}/unfollow/${userId}`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur unfollow :", error.response?.data);
    return null;
  }
};

export const blockUser = async (userId) => {
  try {
    const response = await axios.post(`${API_URL}/${userId}/block`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur blocage utilisateur :", error.response?.data);
    return null;
  }
};

export const unblockUser = async (userId) => {
  try {
    const response = await axios.post(`${API_URL}/${userId}/unblock`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur déblocage utilisateur :", error.response?.data);
    return null;
  }
};

export const getUserStats = async (userId) => {
  try {
    if (!userId) {
      throw new Error("ID utilisateur requis pour récupérer les statistiques");
    }

    // Récupérer le token d'authentification
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error("Vous devez être connecté pour accéder à cette ressource");
    }

    // Faire la requête à l'API
    const response = await fetch(`/api/users/${userId}/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Vérifier si la réponse est OK
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erreur ${response.status} lors de la récupération des statistiques`);
    }

    // Récupérer les données
    const data = await response.json();
    console.log("📊 Statistiques récupérées:", data);
    
    return data;
  } catch (error) {
    console.error("❌ Erreur dans getUserStats:", error);
    // On retourne un objet vide plutôt qu'une erreur pour éviter de casser le flux
    return {
      tweetCount: 0,
      followerCount: 0,
      followingCount: 0
    };
  }
};