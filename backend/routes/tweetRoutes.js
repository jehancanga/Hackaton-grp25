import express from "express";
import { 
  createTweet, 
  getTweets, 
  likeTweet, 
  retweetTweet, 
  deleteTweet, 
  getUserTweets,
  getTweetsByCategory,
  getTweetsByEmotion,
  getRecommendedTweetsByEmotion
} from "../controllers/tweetController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTweet);
router.get("/", getTweets);
router.get("/user/:id", protect, getUserTweets);
router.get("/category/:category", getTweetsByCategory);
router.get("/emotion/:emotion", getTweetsByEmotion);
router.get("/recommended/:emotion", protect, getRecommendedTweetsByEmotion);
router.post("/:id/like", protect, likeTweet);
router.post("/:id/retweet", protect, retweetTweet);
router.delete("/:id", protect, deleteTweet);

export default router;