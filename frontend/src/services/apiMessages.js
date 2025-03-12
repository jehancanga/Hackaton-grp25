// src/services/apiMessages.js
import axios from "axios";
import { API_URL, getAuthHeaders } from "./api";

const MESSAGES_URL = `${API_URL}/messages`;

// 📩 **Envoyer un message**
export const sendMessage = async (messageData) => {
  try {
    const response = await axios.post(`${MESSAGES_URL}/`, messageData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur envoi message :", error.response?.data);
    return null;
  }
};

// 📥 **Obtenir tous les messages d'une conversation**
export const getMessages = async (conversationId) => {
  try {
    const response = await axios.get(`${MESSAGES_URL}/${conversationId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur récupération messages :", error.response?.data);
    return null;
  }
};

// ✅ **Marquer un message comme lu**
export const markMessageAsRead = async (messageId) => {
  try {
    const response = await axios.put(`${MESSAGES_URL}/${messageId}/read`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur lecture message :", error.response?.data);
    return null;
  }
};
