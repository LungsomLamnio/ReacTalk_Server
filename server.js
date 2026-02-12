import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import connectDB from "./db/db.js";

// 1. Connect to Database
connectDB();

const server = http.createServer(app);

// 2. Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3001;

// server.js - Socket Logic
let onlineUsers = new Map(); // userId -> socketId

io.on("connection", (socket) => {
  // 1. WhatsApp Handshake: Register the specific tab/session
  socket.on("addUser", (userId) => {
    if (userId && userId !== "null") {
      const cleanUserId = String(userId).trim();
      onlineUsers.set(cleanUserId, socket.id);
      
      console.log(`User Active: ${cleanUserId} on socket ${socket.id}`);
      io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    }
  });

  // 2. Real-time Routing: Direct push to recipient's socket
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const targetSocketId = onlineUsers.get(String(receiverId));
    
    // Log the routing attempt for debugging
    console.log(`Routing from ${senderId} to ${receiverId} (Socket: ${targetSocketId})`);

    if (targetSocketId) {
      io.to(targetSocketId).emit("getMessage", {
        senderId: String(senderId),
        text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    }
  });

  // server.js - Socket Logic
socket.on("disconnect", () => {
  let disconnectedUser = null;
  for (let [userId, socketId] of onlineUsers.entries()) {
    if (socketId === socket.id) {
      disconnectedUser = userId;
      onlineUsers.delete(userId); // Explicitly remove from the online Map
      break;
    }
  }
  
  if (disconnectedUser) {
    console.log(`User Offline: ${disconnectedUser}`);
    // Notify all clients to update their online UI
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  }
});
});



server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});