const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const { protect } = require("../middleware/authMiddleware");

// ---------------- Category Routes ----------------
router.post("/categories", protect, todoController.createCategory);
router.get("/categories", protect, todoController.getCategories);
router.delete("/categories/:id", protect, todoController.deleteCategory);

// ---------------- Task Routes ----------------
router.post("/categories/:categoryId/tasks", protect, todoController.createTask);
router.get("/categories/:categoryId/tasks", protect, todoController.getTasksByCategory);
router.put("/tasks/:id", protect, todoController.updateTask);
router.delete("/tasks/:id", protect, todoController.deleteTask);

// Reorder tasks inside a category
router.put("/categories/:categoryId/tasks/reorder", protect, todoController.reorderTasks);

// Get tasks by specific date (regardless of category)
router.get("/tasks/by-date", protect, todoController.getTasksByDate);



module.exports = router;
