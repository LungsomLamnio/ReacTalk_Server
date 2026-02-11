import "dotenv/config";
import http from "http"; // Native Node module
import { Server } from "socket.io"; // Socket.io library
import app from "./app.js";
import connectDB from "./db/db.js";

// 1. Connect to Database
connectDB();

// 2. Create an HTTP server using your Express app
const server = http.createServer(app);

// 3. Initialize Socket.io and handle CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Link to your Vite frontend
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3001;

// ... (imports and server setup remain same)

// 4. Socket.io Connection Logic
let onlineUsers = new Map(); 

io.on("connection", (socket) => {
  // Register user as online
  socket.on("addUser", (userId) => {
    if (userId) {
      // Ensure we store the ID as a string
      onlineUsers.set(String(userId), socket.id);
      io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    }
  });

  // Handle Real-time Private Messaging
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    // Explicitly convert receiverId to string to find in Map
    const receiverSocketId = onlineUsers.get(String(receiverId));
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("getMessage", {
        senderId: String(senderId), // Send as string for frontend comparison
        text,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }
  });

  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  });
});

// ... (server.listen remains same)

// 5. Start the Server (Use 'server.listen', NOT 'app.listen')
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
