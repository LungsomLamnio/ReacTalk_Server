import express from "express";
import {
  getOrCreateConversation,
  sendMessage,
  getMessages,
  getRecentChats
} from "../controllers/messageController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/conversation", verifyToken, getOrCreateConversation);
router.get("/recent", verifyToken, getRecentChats);

router.post("/", verifyToken, sendMessage);

router.get("/:conversationId", verifyToken, getMessages);

export default router;