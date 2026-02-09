import express from "express";
import { signup, login, getMe } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { updateProfile } from "../controllers/authController.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// Protected route - Fetches the logged-in user's details
router.get("/me", verifyToken, getMe);

router.put("/update", verifyToken, upload.single("profilePic"), updateProfile);

export default router;
