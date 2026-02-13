import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import connectDB from "./db/db.js";
import Message from "./models/Message.js"; 

connectDB();

const server = http.createServer(app);

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(",") 
  : ["http://localhost:5173"];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3001;
let onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    if (userId && userId !== "null") {
      const cleanUserId = String(userId).trim();
      onlineUsers.set(cleanUserId, socket.id);
      console.log(`User Active: ${cleanUserId} on socket ${socket.id}`);
      io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    }
  });

  socket.on("sendMessage", async ({ senderId, receiverId, text, messageId }) => {
    const targetSocketId = onlineUsers.get(String(receiverId));
    let status = "sent";

    if (targetSocketId) {
      status = "received";
      io.to(targetSocketId).emit("getMessage", {
        senderId: String(senderId),
        text,
        messageId,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });

      socket.emit("messageStatusUpdate", { messageId, status: "received", receiverId });
      
      await Message.findByIdAndUpdate(messageId, { status: "received" });
    }
  });

  socket.on("markAsSeen", async ({ conversationId, seenBy, senderId }) => {
    try {
      await Message.updateMany(
        { conversationId, senderId, status: { $ne: "seen" } },
        { $set: { status: "seen" } }
      );

      const senderSocketId = onlineUsers.get(String(senderId));
      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesSeen", { 
          conversationId, 
          seenBy 
        });
      }
    } catch (err) {
      console.error("Error marking messages as seen:", err);
    }
  });

  socket.on("disconnect", () => {
    let disconnectedUser = null;
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        disconnectedUser = userId;
        onlineUsers.delete(userId);
        break;
      }
    }
    if (disconnectedUser) {
      io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});