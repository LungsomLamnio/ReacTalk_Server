import express from "express";
import {
  getMe,
  updateProfile,
  searchUsers,
  getUserById,
  followUser,
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// All routes below are protected by verifyToken
router.get("/me", verifyToken, getMe);
router.get("/search", verifyToken, searchUsers);
router.get("/:id", verifyToken, getUserById);

// Profile updates with image handling
router.put("/update", verifyToken, upload.single("profilePic"), updateProfile);

// Social interactions
router.post("/follow/:id", verifyToken, followUser);

export default router;
