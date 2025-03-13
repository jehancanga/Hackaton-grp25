import express from "express";
import {
    registerUser,
    loginUser,
    getUserProfile,
    followUser,
    unfollowUser,
    updateUserProfile,
    logoutUser,
    resetPassword,
    changePassword,
    searchUsers,
    getAllUsers,
    getUserFollowers,
    getUserFollowing, 
    blockUser,
    unblockUser,
    identifier,
    getFollowStatus 
} from "../controllers/userController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/reset-password", resetPassword);
router.put("/change-password", protect, changePassword);
router.get("/profile/:id", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.post("/follow/:id", protect, followUser);
router.post("/unfollow/:id", protect, unfollowUser);
router.get("/follow/status/:id", protect, getFollowStatus);
router.get("/search", searchUsers);
router.get("/", protect, getAllUsers);
router.get("/:id/followers", protect, getUserFollowers);
router.get("/:id/following", protect, getUserFollowing);
router.post("/:id/block", protect, blockUser);
router.post("/:id/unblock", protect, unblockUser);
router.get("/:identifier", protect, identifier);

export default router;
