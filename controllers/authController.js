import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: { id: newUser._id, username },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      message: "Login Successfully",
      token,
      user: { id: user._id, username: username },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    // Return counts along with user data
    const userData = {
      ...user._doc,
      followersCount: user.followers.length,
      followingCount: user.following.length,
    };

    res.status(200).json(userData);
  } catch (err) {
    console.error("Error in getMe:", err.message);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, bio } = req.body;
    const updateData = { username, bio };

    if (req.file) {
      updateData.profilePic = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true },
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// controllers/authController.js
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(200).json([]);

    // Finds users where username contains the query string (Case-Sensitive)
    const users = await User.find({
      username: { $regex: query }, // Removed 'i' flag to keep it case-sensitive
      _id: { $ne: req.user.id }, // Don't show the logged-in user in search
    })
      .select("username profilePic bio")
      .limit(10);

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Search failed", error: err.message });
  }
};
