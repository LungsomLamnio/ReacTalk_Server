import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    // New bio field added here
    bio: {
      type: String,
      default: "Hey there! I am using ReacTalk", // Providing a default message
      maxLength: 160, // Good practice for profile bios
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
