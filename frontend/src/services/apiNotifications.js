// src/services/apiNotifications.js
import axios from "axios";
import { API_URL, getAuthHeaders } from "./api";

const NOTIFICATIONS_URL = `${API_URL}/notifications`;

// 🔔 **Obtenir les notifications d'un utilisateur**
export const getNotifications = async () => {
  try {
    const response = await axios.get(`${NOTIFICATIONS_URL}/`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur récupération notifications :", error.response?.data);
    return null;
  }
};

// ✅ **Marquer une notification comme lue**
export const markNotificationAsRead = async (notifId) => {
  try {
    const response = await axios.put(`${NOTIFICATIONS_URL}/${notifId}/read`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Erreur lecture notification :", error.response?.data);
    return null;
  }
};
