import express from "express";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/user", authRoutes);

app.get("/", (req, res) => {
  res.send("This is root directory.");
});

export default app;
