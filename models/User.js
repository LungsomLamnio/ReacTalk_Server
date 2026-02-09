import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true, // Now strictly case-sensitive: "Hello" != "hello"
      trim: true, // Keeps " hello" from being different than "hello"
    },
    password: { type: String, required: true },
    bio: { type: String, default: "Hey there! I am using ReacTalk" },
    profilePic: { type: String, default: "" }, // Add this
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
