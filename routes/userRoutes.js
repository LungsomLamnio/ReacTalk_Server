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

router.get("/me", verifyToken, getMe);
router.get("/search", verifyToken, searchUsers);
router.get("/:id", verifyToken, getUserById);

router.put("/update", verifyToken, upload.single("profilePic"), updateProfile);

router.post("/follow/:id", verifyToken, followUser);

export default router;
