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

// Create Task inside Category (with taskDate)
exports.createTask = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findOne({ _id: categoryId, createdBy: req.user._id });
    if (!category) return res.status(404).json({ message: "Category not found" });

    // Use provided date or default to today
    const taskDate = req.body.taskDate ? new Date(req.body.taskDate) : new Date();
    taskDate.setHours(0, 0, 0, 0);

    if (isNaN(taskDate.getTime())) {
      return res.status(400).json({ message: "Invalid taskDate" });
    }

    const taskCount = await Task.countDocuments({
      category: categoryId,
      createdBy: req.user._id,
      taskDate
    });

    const task = await Task.create({
      name: req.body.name || "Untitled Task",
      description: req.body.description || "",
      priority: req.body.priority || "Medium",
      category: categoryId,
      orderIndex: taskCount,
      createdBy: req.user._id,
      taskDate
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Get All Tasks for a Category (for a given date)
exports.getTasksByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { date } = req.query;

    const category = await Category.findOne({ _id: categoryId, createdBy: req.user._id });
    if (!category) return res.status(404).json({ message: "Category not found" });

    if (!date) return res.status(400).json({ message: "Date is required" });

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      category: categoryId,
      createdBy: req.user._id,
      taskDate: { $gte: start, $lte: end }
    }).sort({ priority: 1, orderIndex: 1 });

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

// Reorder Tasks within Category & Date
exports.reorderTasks = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { tasks, date } = req.body; // array of { id, orderIndex }

    const category = await Category.findOne({ _id: categoryId, createdBy: req.user._id });
    if (!category) return res.status(404).json({ message: "Category not found" });
    if (!date) return res.status(400).json({ message: "Date is required" });

    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);

    for (let t of tasks) {
      await Task.findOneAndUpdate(
        { _id: t.id, category: categoryId, createdBy: req.user._id, taskDate },
        { orderIndex: t.orderIndex }
      );
    }

    res.json({ message: "Order updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get All Tasks by Date (across all categories)
exports.getTasksByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "Date is required" });

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      createdBy: req.user._id,
      taskDate: { $gte: start, $lte: end }
    }).sort({ orderIndex: 1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Delete Category (and optionally its tasks)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete all tasks inside this category too (cascade delete)
    await Task.deleteMany({ category: req.params.id, createdBy: req.user._id });

    res.json({ message: "Category and its tasks deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
