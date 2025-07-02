import express from "express";
import {
  createTask,
  updateTask,
  getUserTasks
} from "../controllers/taskController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST /tasks - Create a new task
router.post("/", requireAuth, createTask);

// PUT /tasks/:id - Update task
router.put("/:id", requireAuth, updateTask);

// GET /tasks - Get tasks assigned to or by the user
router.get("/", requireAuth, getUserTasks);

export default router;