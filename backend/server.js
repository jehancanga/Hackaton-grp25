// Dans votre fichier server.js
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Variables d'environnement
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://bot:5000';

// Route pour analyser les émotions
app.post('/api/emotions/analyze', async (req, res) => {
  try {
    // Transférer la requête au service d'IA
    const response = await axios.post(`${AI_SERVICE_URL}/api/emotions/predict`, req.body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // Renvoyer la réponse du service d'IA
    res.json(response.data);
  } catch (error) {
    console.error('Erreur lors de l\'analyse des émotions:', error);
    res.status(500).json({ error: 'Erreur lors de l\'analyse des émotions' });
  }
});

// Route pour obtenir des recommandations personnalisées
app.get('/api/feed/personalized/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Obtenir des recommandations basées sur les émotions
    const response = await axios.get(`${AI_SERVICE_URL}/api/feed/recommend?user_id=${userId}`);
    
    // Renvoyer les recommandations
    res.json(response.data);
  } catch (error) {
    console.error('Erreur lors de la personnalisation du feed:', error);
    res.status(500).json({ error: 'Erreur lors de la personnalisation du feed' });
  }
});

// Autres routes existantes...

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});