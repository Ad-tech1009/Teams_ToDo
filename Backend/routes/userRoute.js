import express from "express";
import { getAllUsers, getUserById, getUserDetails, updateUserProfile } from "../controllers/userController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /user/all - Get all users (for assignee dropdown)
router.get("/all", requireAuth, getAllUsers);

// GET /user - Get current user details (if needed)
router.get("/", requireAuth, getUserDetails);

// GET /user/:id - Get user details by ID (for profile view)
router.get("/:id", requireAuth, getUserById);

// PUT /user/:id - Update user profile (name, phone, etc.)
router.patch("/:id", requireAuth, updateUserProfile); 

export default router;