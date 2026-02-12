import User from "../models/User.js";

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({
      ...user._doc,
      followersCount: user.followers.length,
      followingCount: user.following.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, bio } = req.body;
    const updateData = { username, bio };

    if (req.file) {
      updateData.profilePic = req.file.path; 
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true },
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Update failed" });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(200).json([]);
    
    const users = await User.find({
      username: { $regex: query, $options: 'i' },
      _id: { $ne: req.user.id },
    })
      .select("username profilePic bio")
      .limit(10);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isFollowing = user.followers.map(id => id.toString()).includes(req.user.id);

    res.status(200).json({
      ...user._doc,
      isFollowing
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const followUser = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser || !currentUser) return res.status(404).json({ message: "User not found" });

    const isFollowing = targetUser.followers.some(
      (id) => id.toString() === req.user.id.toString()
    );

    if (isFollowing) {
      targetUser.followers.pull(req.user.id);
      currentUser.following.pull(req.params.id);
    } else {
      targetUser.followers.push(req.user.id);
      currentUser.following.push(req.params.id);
    }

    await targetUser.save();
    await currentUser.save();
    
    res.status(200).json(targetUser);
  } catch (err) {
    res.status(500).json({ message: "Action failed" });
  }
};