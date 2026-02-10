import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

// Public routes for account creation and entry
router.post("/signup", signup);
router.post("/login", login);

export default router;
