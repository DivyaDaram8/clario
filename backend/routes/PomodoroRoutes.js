// routes/PomodoroRoutes.js
const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  initializePomodoroData,  // <-- correct name
  getPomodoroData,
  updatePomodoroSettings,
  startSession,
  updateSession,
  completeSession,
  skipBreak,
  resetSession,
  getCategories,
  createCategory,
  deleteCategory,
  getStatistics
} = require("../controllers/PomodoroController");

const router = express.Router();

// Auth + init middleware for all pomodoro routes
router.use(protect);
router.use(initializePomodoroData);

// Main pomodoro data
router.get("/", getPomodoroData);

// Settings
router.put("/settings", updatePomodoroSettings);

// Session management
router.post("/session/start", startSession);
router.put("/session/update", updateSession);
router.post("/session/complete", completeSession);
router.post("/session/skip-break", skipBreak);
router.post("/session/reset", resetSession);

// Categories
router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.delete("/categories/:id", deleteCategory);

// Statistics
router.get("/statistics", getStatistics);

module.exports = router;
