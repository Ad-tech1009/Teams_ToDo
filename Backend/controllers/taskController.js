import Task from "../models/taskSchema.js";

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;

    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      assignedTo,
      createdBy: req.user.userId 
    });

    await newTask.save();
    res.status(201).json({ message: "Task created", task: newTask });
  } catch (err) {
    res.status(500).json({ message: "Task creation failed", error: err.message });
  }
};

// Update a task (status, content, etc.)
export const updateTask = async (req, res) => {
  try {
    const { userId } = req.user;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // If user is the creator: allow updating any main fields
    if (task.createdBy.toString() === userId) {
      const allowedFields = ["title", "description", "dueDate", "priority", "assignedTo", "status"];
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          task[field] = req.body[field];
        }
      });
    }
    // Else if user is the assignee: only allow status update
    else if (task.assignedTo.toString() === userId) {
      if (req.body.status) {
        task.status = req.body.status;
      } else {
        return res.status(403).json({ message: "Not authorized to update this field" });
      }
    } 
    else {
      return res.status(403).json({ message: "Not authorized to update this task" });
    }

    await task.save();
    res.status(200).json({ message: "Task updated", task });
  } catch (err) {
    res.status(500).json({ message: "Task update failed", error: err.message });
  }
};

// Get tasks assigned to or created by the user
export const getUserTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const tasks = await Task.find({
      $or: [
        { assignedTo: userId },
        { createdBy: userId }
      ]
    }).populate("assignedTo createdBy", "name email");

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
};
