import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

// --- Conversation Logic ---

export const getOrCreateConversation = async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.user.id;

  try {
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        members: [senderId, receiverId],
      });
      await conversation.save();
    }
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({ message: "Failed to load conversation", error: err.message });
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

    // UPDATE: Refresh the conversation timestamp and last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessageText: text,
      updatedAt: Date.now(), // This is the key for sorting
    });

    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(500).json({ message: "Failed to send" });
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

// server/controllers/messageController.js
// server/controllers/messageController.js
export const getRecentChats = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // 1. Find conversations involving me
    // 2. Populate 'members' to get names and profile pics
    // 3. Sort by 'updatedAt' so the latest message is at the top
    const conversations = await Conversation.find({
      members: { $in: [currentUserId] }
    })
    .populate("members", "username profilePic")
    .sort({ updatedAt: -1 });

    const formattedChats = conversations.map(conv => {
      // Find the user who is NOT me
      const otherUser = conv.members.find(m => m._id.toString() !== currentUserId);
      
      return {
        id: otherUser._id,
        name: otherUser.username,
        profilePic: otherUser.profilePic,
        lastMsg: conv.lastMessageText || "Start a conversation",
        updatedAt: conv.updatedAt
      };
    });

    res.status(200).json(formattedChats);
  } catch (err) {
    console.error("Backend Error:", err); // Check your terminal for this!
    res.status(500).json({ message: "Internal Server Error" });
  }
};