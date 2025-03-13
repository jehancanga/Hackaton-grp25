import express from "express";
import { 
  updateTweetEmotion, 
  analyzeImageEmotion, 
  batchAnalyzeEmotions 
} from "../controllers/emotionController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route pour mettre à jour l'émotion d'un tweet
router.put("/tweets/:id/emotion", protect, updateTweetEmotion);

// Route pour analyser l'émotion d'une image de tweet
router.post("/tweets/:id/analyze-emotion", protect, analyzeImageEmotion);

// Route pour analyser par lot les émotions des tweets avec des images
router.post("/emotions/batch-analyze", protect, batchAnalyzeEmotions);

export default router;