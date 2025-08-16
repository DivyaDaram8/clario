const Task = require("../models/Task");
const Category = require("../models/Category");

// ---------------- Category Controllers ----------------

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create({
      name: req.body.name,
      color: req.body.color || "#000000",
      icon: req.body.icon || "",
      createdBy: req.user._id
    });
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Categories for a User
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ createdBy: req.user._id });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- Task Controllers ----------------

// Create Task inside Category
exports.createTask = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // ensure category belongs to user
    const category = await Category.findOne({ _id: categoryId, createdBy: req.user._id });
    if (!category) return res.status(404).json({ message: "Category not found" });

    const taskCount = await Task.countDocuments({ category: categoryId });

    const task = await Task.create({
      name: req.body.name || "Untitled Task",
      description: req.body.description || "",
      priority: req.body.priority || "Medium",
      category: categoryId,
      orderIndex: taskCount, // append at bottom
      createdBy: req.user._id
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Tasks for a Category
exports.getTasksByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findOne({ _id: categoryId, createdBy: req.user._id });
    if (!category) return res.status(404).json({ message: "Category not found" });

    const tasks = await Task.find({ category: categoryId, createdBy: req.user._id })
      .sort({ priority: 1, orderIndex: 1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      req.body,
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, createdBy: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reorder Tasks (Drag & Drop)
exports.reorderTasks = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { tasks } = req.body; // array of { id, orderIndex }

    // ensure category belongs to user
    const category = await Category.findOne({ _id: categoryId, createdBy: req.user._id });
    if (!category) return res.status(404).json({ message: "Category not found" });

    for (let t of tasks) {
      await Task.findOneAndUpdate(
        { _id: t.id, category: categoryId, createdBy: req.user._id },
        { orderIndex: t.orderIndex }
      );
    }

    res.json({ message: "Order updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
