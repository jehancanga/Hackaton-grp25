// src/services/api.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/user";

// 🔐 Inscription d'un utilisateur
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Erreur d'inscription :", error.response?.data);
    return null;
  }
};

// 🔑 Connexion utilisateur
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    console.error("Erreur de connexion :", error.response?.data);
    return null;
  }
};

// 🚪 Déconnexion utilisateur
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// 📌 Vérifier si l'utilisateur est connecté
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
