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
// PATCH /tasks/:id   (partial update)
export const updateTask = async (req, res) => {
  try {
    const userId = req.user.userId;

    // 1️⃣ Fetch task to check ownership/assignment
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    /* 2️⃣ Determine which fields this user may change */
    let allowed = [];
    if (task.createdBy.toString() === userId) {
      // Creator → can change most fields
      allowed = ["title", "description", "dueDate", "priority", "assignedTo", "status"];
    } else if (task.assignedTo.toString() === userId) {
      // Assignee → can ONLY change status
      allowed = ["status"];
    } else {
      return res.status(403).json({ message: "Not authorized to update this task" });
    }

    /* 3️⃣ Build the $set payload only with allowed + provided keys */
    const update = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    });

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: "Nothing to update or fields not allowed" });
    }

    /* 4️⃣ Run update */
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true, timestamps: true }   // timestamps → bumps updatedAt
    );

    res.status(200).json({ message: "Task updated", task: updatedTask });
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

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const removed = await Task.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task", error: err.message });
  }
};
