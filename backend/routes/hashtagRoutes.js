import express from "express";
import { getHashtags, createHashtag, createMultipleHashtags, getHashtagFeed } from "../controllers/hashtagController.js";

const router = express.Router();

router.get("/", getHashtags);
router.post("/", createHashtag);
router.post("/bulk", createMultipleHashtags);
router.get('/:name', getHashtagFeed);

export default router;
