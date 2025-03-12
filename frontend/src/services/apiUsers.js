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

export const updateUserProfile = async (profileData) => {
  try {
    const response = await axios.put(`${API_URL}/profile`, profileData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur mise à jour profil :", error.response?.data);
    return null;
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
