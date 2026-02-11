import express from "express";
import {
  getOrCreateConversation,
  sendMessage,
  getMessages,
} from "../controllers/messageController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get the conversation room ID between two users
router.post("/conversation", verifyToken, getOrCreateConversation);

// Save a new message to DB
router.post("/", verifyToken, sendMessage);

// Get history for a specific conversation
router.get("/:conversationId", verifyToken, getMessages);

export default router;
