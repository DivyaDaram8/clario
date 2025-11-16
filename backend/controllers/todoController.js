// controllers/todoController.js
const Task = require("../models/Task");
const Category = require("../models/Category");
const mongoose = require("mongoose");

// Default categories (customize names/colors/icons as you like)
const DEFAULT_CATEGORIES = [
 { name: "Todo", color: "#ef4444", icon: "📝" },
 { name: "Work", color: "#2563eb", icon: "💼" },
 { name: "Personal", color: "#16a34a", icon: "👤" },
 { name: "Misc", color: "#6b7280", icon: "📌" },
];

// Helper: ensure default categories exist for a user (idempotent)
async function ensureDefaultCategories(userId) {
 const ops = DEFAULT_CATEGORIES.map(def => ({
   updateOne: {
     filter: { createdBy: userId, name: def.name },
     update: {
       $setOnInsert: {
         name: def.name,
         color: def.color,
         icon: def.icon,
         createdBy: userId,
         createdAt: new Date()
       }
     },
     upsert: true
   }
 }));

 if (ops.length) {
   await Category.bulkWrite(ops);
 }
}

// ---------------- Category Controllers ----------------

exports.createCategory = async (req, res) => {
 try {
   const { name, color, icon } = req.body;
   if (!name || !name.trim()) return res.status(400).json({ message: "Name is required" });

   const existing = await Category.findOne({ createdBy: req.user._id, name: name.trim() });
   if (existing) return res.status(200).json(existing);

   const category = await Category.create({
     name: name.trim(),
     color: color || "#000000",
     icon: icon || "",
     createdBy: req.user._id
   });

   res.status(201).json(category);
 } catch (err) {
   if (err.code === 11000) {
     return res.status(409).json({ message: "Category already exists" });
   }
   res.status(400).json({ error: err.message });
 }
};

exports.getCategories = async (req, res) => {
 try {
   await ensureDefaultCategories(req.user._id);
   const categories = await Category.find({ createdBy: req.user._id }).sort({ createdAt: 1, name: 1 });
   res.json(categories);
 } catch (err) {
   res.status(500).json({ error: err.message });
 }
};

exports.updateCategory = async (req, res) => {
 try {
   const { id } = req.params;
   const updates = {};
   if (req.body.name) updates.name = req.body.name.trim();
   if (req.body.color) updates.color = req.body.color;
   if (req.body.icon) updates.icon = req.body.icon;

   if (updates.name) {
     const conflict = await Category.findOne({
       _id: { $ne: id },
       createdBy: req.user._id,
       name: updates.name
     });
     if (conflict) return res.status(409).json({ message: "A category with that name already exists" });
   }

   const category = await Category.findOneAndUpdate(
     { _id: id, createdBy: req.user._id },
     updates,
     { new: true }
   );

   if (!category) return res.status(404).json({ message: "Category not found" });
   res.json(category);
 } catch (err) {
   if (err.code === 11000) {
     return res.status(409).json({ message: "Category name conflict" });
   }
   res.status(400).json({ error: err.message });
 }
};

// ---------------- Task Controllers ----------------

exports.createTask = async (req, res) => {
 try {
   const { categoryId } = req.params;

   const category = await Category.findOne({ _id: categoryId, createdBy: req.user._id });
   if (!category) return res.status(404).json({ message: "Category not found" });

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
   }).sort({ orderIndex: 1 });

   res.json(tasks);
 } catch (err) {
   res.status(500).json({ error: err.message });
 }
};

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

exports.reorderTasks = async (req, res) => {
 try {
   const { categoryId } = req.params;
   const { tasks, date } = req.body;

   const category = await Category.findOne({ _id: categoryId, createdBy: req.user._id });
   if (!category) return res.status(404).json({ message: "Category not found" });
   if (!date) return res.status(400).json({ message: "Date is required" });

   const taskDate = new Date(date);
   taskDate.setHours(0, 0, 0, 0);

   const bulkOps = tasks.map(t => ({
     updateOne: {
       filter: {
         _id: t.id,
         category: categoryId,
         createdBy: req.user._id,
         taskDate,
         priority: t.priority
       },
       update: { $set: { orderIndex: t.orderIndex } }
     }
   }));

   if (bulkOps.length) await Task.bulkWrite(bulkOps);

   res.json({ message: "Order updated" });
 } catch (err) {
   res.status(500).json({ error: err.message });
 }
};

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

// ---------------- Statistics Controller ----------------

exports.getMonthlyStats = async (req, res) => {
 try {
   const { year, month } = req.query;
  
   if (!year || !month) {
     return res.status(400).json({ message: "Year and month are required" });
   }

   const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
   startDate.setHours(0, 0, 0, 0);
  
   const endDate = new Date(parseInt(year), parseInt(month), 0);
   endDate.setHours(23, 59, 59, 999);

   // Get all tasks for the month
   const tasks = await Task.find({
     createdBy: req.user._id,
     taskDate: { $gte: startDate, $lte: endDate }
   }).populate('category');

   // Calculate totals
   const totalTasks = tasks.length;
   const totalCompleted = tasks.filter(t => t.completed).length;

   // Group by category
   const categoryMap = {};
   tasks.forEach(task => {
     const catId = task.category?._id?.toString() || 'uncategorized';
     const catName = task.category?.name || 'Uncategorized';
     const catIcon = task.category?.icon || '📌';

     if (!categoryMap[catId]) {
       categoryMap[catId] = {
         name: catName,
         icon: catIcon,
         total: 0,
         completed: 0
       };
     }

     categoryMap[catId].total++;
     if (task.completed) {
       categoryMap[catId].completed++;
     }
   });

   const byCategory = Object.values(categoryMap);

   res.json({
     totalTasks,
     totalCompleted,
     byCategory
   });
 } catch (err) {
   res.status(500).json({ error: err.message });
 }
};

