import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  conversationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Conversation",
    required: true 
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },
  text: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["sent", "received", "seen"], 
    default: "sent" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;