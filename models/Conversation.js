import mongoose from "mongoose";

// models/Conversation.js
const conversationSchema = new mongoose.Schema({
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Must match 'members'
  lastMessageText: { type: String, default: "" },
}, { timestamps: true }); // This provides 'updatedAt' for sorting

const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);

export default Conversation;
