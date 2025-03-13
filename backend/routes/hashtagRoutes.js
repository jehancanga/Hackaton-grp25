import express from "express";
import { getHashtags, createHashtag, createMultipleHashtags } from "../controllers/hashtagController.js";

const router = express.Router();

router.get("/", getHashtags);
router.post("/", createHashtag);
router.post("/bulk", createMultipleHashtags);

export default router;
