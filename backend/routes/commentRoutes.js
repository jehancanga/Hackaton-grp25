import express from "express";
import { addComment, getComments, likeComment, deleteComment } from "../controllers/commentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:tweetId", protect, addComment);
router.get("/:tweetId", getComments);
router.post("/:id/like", protect, likeComment);
router.delete("/:id", protect, deleteComment);

export default router;
