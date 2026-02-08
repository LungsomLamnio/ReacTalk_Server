import express from "express";
import authRoutes from "./routes/authRoutes.js";
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

app.use("/api/user", authRoutes);

app.get("/", (req, res) => {
  res.send("This is root directory.");
});

export default app;
