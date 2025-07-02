import User from "../models/userSchema.js";

// Get current user details (if needed)
export const getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId, "_id name email");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Error fetching user details", error: err.message });
    }
}

// Get all users (for assignee dropdown)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "_id name email");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

