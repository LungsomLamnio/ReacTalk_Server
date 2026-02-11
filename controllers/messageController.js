import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

// --- Conversation Logic ---

export const getOrCreateConversation = async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.user.id;

  try {
    // Check if a conversation already exists between these two users
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      // Create new if it doesn't exist
      conversation = new Conversation({
        members: [senderId, receiverId],
      });
      await conversation.save();
    }

    res.status(200).json(conversation);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to load conversation", error: err.message });
  }
};

// --- Message Logic ---

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const newMessage = new Message({
      conversationId,
      sender: req.user.id,
      text,
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to send message", error: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const currentUserId = req.user.id; // The logged-in user making the request

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 });

    // Verify "isMe" status on the backend
    const verifiedMessages = messages.map((m) => {
      return {
        ...m._doc,
        // Backend comparison is absolute
        isMe: m.sender.toString() === currentUserId.toString()
      };
    });

    res.status(200).json(verifiedMessages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages", error: err.message });
  }
};
