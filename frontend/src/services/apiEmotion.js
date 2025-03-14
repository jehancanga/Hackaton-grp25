// services/apiEmotion.js
import axios from 'axios';
import { API_URL, getAxiosAuthConfig } from './config';

// Récupérer les tweets par émotion
export const getTweetsByEmotion = async (emotion) => {
  try {
    if (!emotion || emotion === 'all') {
      const response = await axios.get(`${API_URL}/tweets`);
      return response.data;
    }
    
    const response = await axios.get(`${API_URL}/tweets/emotion/${emotion}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des tweets par émotion:", error);
    throw error;
  }
};

// Récupérer les tweets recommandés par émotion
export const getRecommendedTweetsByEmotion = async (emotion) => {
  try {
    const response = await axios.get(
      `${API_URL}/tweets/recommended/${emotion}`, 
      getAxiosAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des tweets recommandés:", error);
    throw error;
  }
};

// Analyser les émotions par lots
export const batchAnalyzeEmotions = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/emotions/batch-analyze`, 
      {}, 
      getAxiosAuthConfig()
    );
    
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'analyse des émotions par lot:", error);
    throw error;
  }
};