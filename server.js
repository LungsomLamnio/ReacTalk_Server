import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import connectDB from "./db/db.js";

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://reactalk.vercel.app",
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

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const targetSocketId = onlineUsers.get(String(receiverId));
    
    console.log(`Routing from ${senderId} to ${receiverId} (Socket: ${targetSocketId})`);

    if (targetSocketId) {
      io.to(targetSocketId).emit("getMessage", {
        senderId: String(senderId),
        text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
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
      console.log(`User Offline: ${disconnectedUser}`);
      io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    }
  });
});

server.listen(PORT, () => {
  // Useful for Render logs to know which port is being used
  console.log(`Server listening on port: ${PORT}`);
});