import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Use mongoose.models.Message || ... to prevent re-compilation
const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
