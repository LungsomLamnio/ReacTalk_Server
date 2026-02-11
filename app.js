import express from "express";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes); // Handles signup and login
app.use("/api/user", userRoutes); // Handles profiles, search, and following
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("This is root directory.");
});

export default app;
