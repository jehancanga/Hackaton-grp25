// services/config.js
// Définir l'URL de base de l'API
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Configurations des headers pour les requêtes
export const getAuthHeaders = (token) => {
  const authToken = token || localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': authToken ? `Bearer ${authToken}` : ''
  };
};

// Version pour axios qui renvoie l'objet de configuration complet
export const getAxiosAuthConfig = () => {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  };
};

// Configurations pour les requêtes multipart (upload de fichiers)
export const getMultipartHeaders = (token) => {
  const authToken = token || localStorage.getItem('authToken');
  return {
    'Authorization': authToken ? `Bearer ${authToken}` : ''
  };
};