import express from "express";
import {
  getOrCreateConversation,
  sendMessage,
  getMessages,
  getRecentChats, // Ensure this is imported
} from "../controllers/messageController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 1. Static and Specific Routes (Must be defined first)
router.post("/conversation", verifyToken, getOrCreateConversation);
router.get("/recent", verifyToken, getRecentChats); // Static route before dynamic

// 2. Resource Routes
router.post("/", verifyToken, sendMessage);

// 3. Dynamic Parameter Routes (Defined last)
// If this was above /recent, it would treat "recent" as a conversationId
router.get("/:conversationId", verifyToken, getMessages);

export default router;