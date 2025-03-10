import express from "express";
import { sendMessage, getMessages, markAsRead } from "../controllers/messageController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:conversationId", protect, getMessages);
router.put("/:id/read", protect, markAsRead);

export default router;
