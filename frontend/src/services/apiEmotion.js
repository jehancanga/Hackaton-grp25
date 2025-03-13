import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const FLASK_URL = process.env.REACT_APP_FLASK_URL || 'http://localhost:5000';

// Récupérer les tweets filtrés par émotion
export const getTweetsByEmotion = async (emotion) => {
  try {
    const response = await axios.get(`${API_URL}/tweets/emotion/${emotion}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des tweets par émotion:", error);
    throw error;
  }
};

// Récupérer les tweets recommandés en fonction de l'émotion
export const getRecommendedTweetsByEmotion = async (emotion) => {
  try {
    const response = await axios.get(`${API_URL}/tweets/recommended/${emotion}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des recommandations:", error);
    throw error;
  }
};

// Analyser une image directement via le service Flask
export const detectEmotion = async (imageData) => {
  try {
    const response = await axios.post(`${FLASK_URL}/detect-emotion`, {
      image: imageData
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la détection d'émotion:", error);
    throw error;
  }
};

// Lancer une analyse par lot pour les tweets récents
export const batchAnalyzeEmotions = async () => {
  try {
    const response = await axios.post(`${API_URL}/emotions/batch-analyze`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'analyse par lot:", error);
    throw error;
  }
};