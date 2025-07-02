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

// Get user details by ID (for profile view)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "_id name email phone profilePicture teams skills createdAt");
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

// Update user profile (name, phone, etc.)
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;  

    const allowed = ["name", "phone", "profilePicture", "teams", "skills"];
    const update  = {};

    allowed.forEach((key) => {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    });

    // Convert CSV strings → arrays (if provided)
    if (typeof update.teams === "string") {
      update.teams = update.teams
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
    if (typeof update.skills === "string") {
      update.skills = update.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: update },
      { new: true, runValidators: true, timestamps: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: err.message });
  }
};