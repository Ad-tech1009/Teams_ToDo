import express from "express";
import { getAllUsers, getUserDetails } from "../controllers/userController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /users/all - Get all users (for assignee dropdown)
router.get("/all", requireAuth, getAllUsers);

// GET /users - Get current user details (if needed)
router.get("/", requireAuth, getUserDetails);

export default router;