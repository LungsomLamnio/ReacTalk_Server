import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("This is root directory.");
});

export default app;
