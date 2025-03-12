import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/messages';

// Fonction utilitaire pour les en-têtes d'authentification
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  };
};

// Envoyer un message privé
export const sendMessage = async (receiverId, content) => {
  try {
    const response = await axios.post(
      `${API_URL}`, 
      { receiverId, content }, 
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Erreur envoi message:", error.response?.data || error.message);
    throw error;
  }
};

// Obtenir tous les messages d'une conversation
export const getMessages = async (conversationId) => {
  try {
    const response = await axios.get(
      `${API_URL}/${conversationId}`, 
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Erreur récupération messages:", error.response?.data || error.message);
    throw error;
  }
};

// Marquer un message comme lu
export const markAsRead = async (messageId) => {
  try {
    const response = await axios.patch(
      `${API_URL}/${messageId}/read`, 
      {}, 
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Erreur marquer comme lu:", error.response?.data || error.message);
    throw error;
  }
};
