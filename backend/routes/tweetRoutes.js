import express from "express";
import { createTweet, getTweets, likeTweet, retweet, deleteTweet } from "../controllers/tweetController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTweet);
router.get("/", getTweets);
router.post("/:id/like", protect, likeTweet);
router.post("/:id/retweet", protect, retweet);
router.delete("/:id", protect, deleteTweet);

export default router;
