import mongoose from "mongoose";

// models/User.js
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    bio: { type: String, default: "Hey there! I am using ReacTalk" },
    profilePic: { type: String, default: "" },

    // New fields for Social Connectivity
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
