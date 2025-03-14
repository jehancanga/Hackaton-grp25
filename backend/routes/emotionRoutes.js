// routes/emotionRoutes.js
import express from 'express';
import { 
  getTweetsByEmotion, 
  getRecommendedTweetsByEmotion,
  updateTweetEmotion,
  analyzeImageEmotion,
  batchAnalyzeEmotions
} from '../controllers/emotionController.js';
import { protect } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

// Route pour récupérer les tweets par émotion (accessible sans authentification)
router.get('/tweets/emotion/:emotion', getTweetsByEmotion);

// Routes nécessitant une authentification
router.get('/tweets/recommended/:emotion', protect, getRecommendedTweetsByEmotion);
router.put('/tweets/:id/emotion', protect, updateTweetEmotion);
router.post('/tweets/:id/analyze-image', protect, analyzeImageEmotion);
router.post('/emotions/batch-analyze', protect, batchAnalyzeEmotions);

export default router;