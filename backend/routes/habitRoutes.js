const express = require("express");
const {
 getHabits,
 createHabit,
 updateHabit,
 deleteHabit,
 toggleHabitLog,
 getMonthlyStats,
 getGlobalStats,
} = require("../controllers/habitController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/habits - Get all habits
router.get("/", protect, getHabits);

// POST /api/habits - Create new habit
router.post("/", protect, createHabit);

// GET /api/habits/global/stats - Get global stats (keep above :id routes)
router.get("/global/stats", protect, getGlobalStats);

// PUT /api/habits/:id - Update habit name
router.put("/:id", protect, updateHabit);

// DELETE /api/habits/:id - Delete habit
router.delete("/:id", protect, deleteHabit);

// POST /api/habits/:id/toggle - Toggle habit completion for a date
router.post("/:id/toggle", protect, toggleHabitLog);

// GET /api/habits/:id/stats - Get monthly stats for a habit
router.get("/:id/stats", protect, getMonthlyStats);

module.exports = router;
