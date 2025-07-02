import express from "express";
import {
  createTask,
  updateTask,
  getUserTasks,
  deleteTask,
} from "../controllers/taskController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST /tasks - Create a new task
router.post("/", requireAuth, createTask);

// GET /tasks - Get tasks assigned to or by the user
router.get("/", requireAuth, getUserTasks);

// PATCH /tasks/:id - partial update (status, etc.)
router.patch("/:id", requireAuth, updateTask);

// PUT /tasks/:id   - full replace (optional)
// router.put("/:id", requireAuth, updateTask);

// DELETE /tasks/:id - remove task
router.delete("/:id", requireAuth, deleteTask);

export default router;