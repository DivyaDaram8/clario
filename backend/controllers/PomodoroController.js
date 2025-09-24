// controllers/PomodoroController.js
const Pomodoro = require("../models/Pomodoro");
const PomodoroCategory = require("../models/PomodoroCategory");
const PomodoroSession = require("../models/PomodoroSession");

// Helper function to check if date is today
const isToday = (date) => {
  if (!date) return false;
  const today = new Date();
  const d = new Date(date);
  return today.toDateString() === d.toDateString();
};

// Helper: update daily stats (reset todayPomodoros if new day)
const updateDailyStats = async (userId) => {
  const pomodoro = await Pomodoro.findOne({ userId });
  if (!pomodoro) return;

  const today = new Date();
  const lastActive = pomodoro.stats?.lastActiveDate;

  if (!pomodoro.stats) {
    pomodoro.stats = {
      totalPomodoros: 0,
      totalFocusTime: 0,
      currentStreak: 0,
      highestStreak: 0,
      todayPomodoros: 0,
      lastActiveDate: today
    };
  }

  if (!lastActive || !isToday(lastActive)) {
    pomodoro.stats.todayPomodoros = 0;
    pomodoro.stats.lastActiveDate = today;
    await pomodoro.save();
  }
};

// Init: ensure pomodoro doc + default category exist
const initializePomodoroData = async (req, res, next) => {
  try {
    let pomodoro = await Pomodoro.findOne({ userId: req.user._id });
    if (!pomodoro) {
      pomodoro = await Pomodoro.create({ userId: req.user._id });
    }

    const general = await PomodoroCategory.findOne({ userId: req.user._id, name: "General" });
    if (!general) {
      await PomodoroCategory.create({
        userId: req.user._id,
        name: "General",
        isDefault: true,
        color: "#3B82F6"
      });
    }

    next();
  } catch (error) {
    console.error("Initialization error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all pomodoro data for user
const getPomodoroData = async (req, res) => {
  try {
    await updateDailyStats(req.user._id);

    const pomodoro = await Pomodoro.findOne({ userId: req.user._id });
    const categories = await PomodoroCategory.find({ userId: req.user._id }).sort({ createdAt: 1 });

    res.json({
      settings: pomodoro.settings,
      currentSession: pomodoro.currentSession,
      stats: pomodoro.stats,
      categories
    });
  } catch (error) {
    console.error("Get pomodoro data error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update settings
const updatePomodoroSettings = async (req, res) => {
  try {
    const { pomodoroTime, shortBreakTime, longBreakTime, dailyGoal, longBreakAfter } = req.body;
    const pomodoro = await Pomodoro.findOne({ userId: req.user._id });

    if (pomodoroTime != null) pomodoro.settings.pomodoroTime = pomodoroTime;
    if (shortBreakTime != null) pomodoro.settings.shortBreakTime = shortBreakTime;
    if (longBreakTime != null) pomodoro.settings.longBreakTime = longBreakTime;
    if (dailyGoal != null) pomodoro.settings.dailyGoal = dailyGoal;
    if (longBreakAfter != null) pomodoro.settings.longBreakAfter = longBreakAfter;

    await pomodoro.save();
    res.json({ message: "Settings updated successfully", settings: pomodoro.settings });
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Start session
const startSession = async (req, res) => {
  try {
    const { sessionType, categoryName, timeRemaining } = req.body;

    const pomodoro = await Pomodoro.findOne({ userId: req.user._id });

    // only require category for pomodoro sessions
    if (sessionType === "pomodoro") {
      const category = await PomodoroCategory.findOne({ userId: req.user._id, name: categoryName });
      if (!category) return res.status(404).json({ message: "Category not found" });
    }

    pomodoro.currentSession = {
      isActive: true,
      sessionType,
      timeRemaining,
      isPaused: false,
      currentCycle: pomodoro.currentSession?.currentCycle || 1,
      selectedCategory: categoryName || "General",
      sessionStartTime: new Date()
    };

    await pomodoro.save();
    res.json({ message: "Session started", currentSession: pomodoro.currentSession });
  } catch (error) {
    console.error("Start session error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update session (pause/resume/time)
const updateSession = async (req, res) => {
  try {
    const { timeRemaining, isPaused, currentCycle } = req.body;
    const pomodoro = await Pomodoro.findOne({ userId: req.user._id });

    if (!pomodoro.currentSession?.isActive) {
      return res.status(400).json({ message: "No active session" });
    }

    if (timeRemaining != null) pomodoro.currentSession.timeRemaining = timeRemaining;
    if (isPaused != null) pomodoro.currentSession.isPaused = isPaused;
    if (currentCycle != null) pomodoro.currentSession.currentCycle = currentCycle;

    await pomodoro.save();
    res.json({ message: "Session updated", currentSession: pomodoro.currentSession });
  } catch (error) {
    console.error("Update session error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Complete session
const completeSession = async (req, res) => {
  try {
    const { actualDuration, isCompleted = true, wasSkipped = false } = req.body;
    const pomodoro = await Pomodoro.findOne({ userId: req.user._id });

    if (!pomodoro.currentSession?.isActive) {
      return res.status(400).json({ message: "No active session" });
    }

    // Ensure category is available; for breaks we can still use the selectedCategory or fallback to General
    let category = await PomodoroCategory.findOne({
      userId: req.user._id,
      name: pomodoro.currentSession.selectedCategory
    });
    if (!category) {
      category = await PomodoroCategory.findOne({ userId: req.user._id, name: "General" });
    }

    // Build session record
    const plannedDuration =
      pomodoro.currentSession.sessionType === "pomodoro"
        ? pomodoro.settings.pomodoroTime
        : pomodoro.currentSession.sessionType === "shortBreak"
        ? pomodoro.settings.shortBreakTime
        : pomodoro.settings.longBreakTime;

    const sessionData = {
      userId: req.user._id,
      categoryId: category ? category._id : undefined, // your model requires it; "General" should exist
      categoryName: pomodoro.currentSession.selectedCategory,
      sessionType: pomodoro.currentSession.sessionType,
      plannedDuration,
      actualDuration: actualDuration || 0,
      isCompleted,
      startTime: pomodoro.currentSession.sessionStartTime,
      endTime: new Date(),
      wasSkipped,
      cycleNumber: pomodoro.currentSession.currentCycle
    };

    await PomodoroSession.create(sessionData);

    // Update stats for completed pomodoro
    if (pomodoro.currentSession.sessionType === "pomodoro" && isCompleted && !wasSkipped) {
      await updateDailyStats(req.user._id);

      pomodoro.stats.totalPomodoros += 1;
      pomodoro.stats.totalFocusTime += actualDuration || pomodoro.settings.pomodoroTime;
      pomodoro.stats.todayPomodoros += 1;
      pomodoro.stats.lastPomodoroDate = new Date();

      // Streak increments when first pomodoro of the day completes
      if (pomodoro.stats.todayPomodoros === 1) {
        pomodoro.stats.currentStreak += 1;
        if (pomodoro.stats.currentStreak > pomodoro.stats.highestStreak) {
          pomodoro.stats.highestStreak = pomodoro.stats.currentStreak;
        }
      }

      if (category) {
        category.totalPomodoros += 1;
        category.totalFocusTime += actualDuration || pomodoro.settings.pomodoroTime;
        await category.save();
      }
    }

    // Decide next session type/cycle
    let nextSessionType = "pomodoro";
    let nextCycle = pomodoro.currentSession.currentCycle;

    if (pomodoro.currentSession.sessionType === "pomodoro") {
      if (pomodoro.currentSession.currentCycle >= pomodoro.settings.longBreakAfter) {
        nextSessionType = "longBreak";
        nextCycle = 1;
      } else {
        nextSessionType = "shortBreak";
        nextCycle = pomodoro.currentSession.currentCycle + 1;
      }
    }

    // Reset current session for next step
    pomodoro.currentSession = {
      isActive: false,
      sessionType: nextSessionType,
      timeRemaining: 0,
      isPaused: false,
      currentCycle: nextCycle,
      selectedCategory: pomodoro.currentSession.selectedCategory,
      sessionStartTime: null
    };

    await pomodoro.save();

    res.json({
      message: "Session completed",
      nextSessionType,
      stats: pomodoro.stats,
      currentSession: pomodoro.currentSession
    });
  } catch (error) {
    console.error("Complete session error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Skip break
const skipBreak = async (req, res) => {
  try {
    const pomodoro = await Pomodoro.findOne({ userId: req.user._id });

    if (!pomodoro.currentSession?.isActive || pomodoro.currentSession.sessionType === "pomodoro") {
      return res.status(400).json({ message: "Can only skip during breaks" });
    }

    req.body = { actualDuration: 0, isCompleted: false, wasSkipped: true };
    return completeSession(req, res);
  } catch (error) {
    console.error("Skip break error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Reset session
const resetSession = async (req, res) => {
  try {
    const pomodoro = await Pomodoro.findOne({ userId: req.user._id });

    pomodoro.currentSession = {
      isActive: false,
      sessionType: "pomodoro",
      timeRemaining: 0,
      isPaused: false,
      currentCycle: 1,
      selectedCategory: pomodoro.currentSession?.selectedCategory || "General",
      sessionStartTime: null
    };

    await pomodoro.save();
    res.json({ message: "Session reset", currentSession: pomodoro.currentSession });
  } catch (error) {
    console.error("Reset session error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Categories
const getCategories = async (req, res) => {
  try {
    const categories = await PomodoroCategory.find({ userId: req.user._id }).sort({ createdAt: 1 });
    res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, color = "#3B82F6" } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existing = await PomodoroCategory.findOne({ userId: req.user._id, name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await PomodoroCategory.create({
      userId: req.user._id,
      name: name.trim(),
      color
    });

    res.status(201).json(category);
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await PomodoroCategory.findOne({ _id: id, userId: req.user._id });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.isDefault || category.name === "General") {
      return res.status(400).json({ message: "Cannot delete default category" });
    }

    await PomodoroCategory.findByIdAndDelete(id);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Statistics
const getStatistics = async (req, res) => {
  try {
    await updateDailyStats(req.user._id);

    const pomodoro = await Pomodoro.findOne({ userId: req.user._id });
    const categories = await PomodoroCategory.find({ userId: req.user._id });

    const sessions = await PomodoroSession.find({
      userId: req.user._id,
      sessionType: "pomodoro",
      isCompleted: true
    }).sort({ createdAt: -1 });

    const todaySessions = sessions.filter((s) => isToday(s.startTime));
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklySessions = sessions.filter((s) => new Date(s.startTime) >= weekAgo);

    const stats = {
      user: pomodoro.stats,
      categories: categories.map((c) => ({
        name: c.name,
        totalPomodoros: c.totalPomodoros,
        totalFocusTime: c.totalFocusTime,
        color: c.color
      })),
      today: {
        pomodoros: todaySessions.length,
        focusTime: todaySessions.reduce((sum, s) => sum + s.actualDuration, 0)
      },
      week: {
        pomodoros: weeklySessions.length,
        focusTime: weeklySessions.reduce((sum, s) => sum + s.actualDuration, 0)
      }
    };

    res.json(stats);
  } catch (error) {
    console.error("Get statistics error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  initializePomodoroData,
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
};
