const PomodoroSettings = require("../models/PomodoroSettings");
const PomodoroSession = require("../models/PomodoroSession");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

// --- SETTINGS ---
exports.getSettings = async (req, res) => {
  try {
    const settings = await PomodoroSettings.findOne({ userId: req.user._id });
    if (!settings) {
      const created = await PomodoroSettings.create({ userId: req.user._id });
      return res.json(created);
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch settings", error: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const {
      focusDuration,
      shortBreakDuration,
      longBreakDuration,
      longBreakInterval,
      categories,
      dailyGoalCycles,
    } = req.body;

    const update = {};
    if (focusDuration !== undefined) update.focusDuration = focusDuration;
    if (shortBreakDuration !== undefined) update.shortBreakDuration = shortBreakDuration;
    if (longBreakDuration !== undefined) update.longBreakDuration = longBreakDuration;
    if (longBreakInterval !== undefined) update.longBreakInterval = longBreakInterval;
    if (dailyGoalCycles !== undefined) update.dailyGoalCycles = dailyGoalCycles;
    if (Array.isArray(categories)) {
      // sanitize: unique names, max 10
      const seen = new Set();
      update.categories = categories
        .filter(c => c && c.name && !seen.has(c.name.trim()))
        .slice(0, 10)
        .map(c => ({ name: c.name.trim(), color: c.color || "#9ca3af" }));
    }

    const settings = await PomodoroSettings.findOneAndUpdate(
      { userId: req.user._id },
      { $set: update },
      { upsert: true, new: true }
    );

    res.json(settings);
  } catch (err) {
    res.status(400).json({ message: "Failed to update settings", error: err.message });
  }
};

// --- SESSIONS ---
exports.startSession = async (req, res) => {
  try {
    const { category = "General", plannedFocus, plannedBreak = 0, type = "focus", notes } = req.body;
    if (!plannedFocus || plannedFocus < 1) {
      return res.status(400).json({ message: "plannedFocus (minutes) is required and must be >= 1" });
    }

    const session = await PomodoroSession.create({
      userId: req.user._id,
      category,
      plannedFocus,
      plannedBreak,
      type,
      status: "in-progress",
      startTime: new Date(),
      notes: notes?.trim()?.slice(0, 500),
    });

    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ message: "Failed to start session", error: err.message });
  }
};

exports.completeSession = async (req, res) => {
  try {
    const { sessionId, focusMinutes = 0, breakMinutes = 0, status = "completed", notes } = req.body;
    if (!sessionId) return res.status(400).json({ message: "sessionId is required" });

    const session = await PomodoroSession.findOne({ _id: sessionId, userId: req.user._id });
    if (!session) return res.status(404).json({ message: "Session not found" });

    session.focusMinutes = Math.max(0, Math.floor(focusMinutes));
    session.breakMinutes = Math.max(0, Math.floor(breakMinutes));
    session.status = status;
    session.endTime = new Date();
    if (notes !== undefined) session.notes = notes?.trim()?.slice(0, 500);

    await session.save();
    res.json(session);
  } catch (err) {
    res.status(400).json({ message: "Failed to complete session", error: err.message });
  }
};

// --- STATS ---
/**
 * GET /stats?range=day|week|month&tz=Asia/Kolkata
 * Returns totals + per-category + streak info.
 */
exports.getStats = async (req, res) => {
  try {
    const range = (req.query.range || "week").toLowerCase();
    const tz = req.query.tz || "Asia/Kolkata";

    const now = dayjs().tz(tz);
    let start;
    if (range === "day") start = now.startOf("day");
    else if (range === "month") start = now.startOf("month");
    else start = now.startOf("week"); // default week (Mon-Sun depending on locale; dayjs uses Sunday start, but it's okay for now)

    // Aggregate totals in selected range
    const sessions = await PomodoroSession.find({
      userId: req.user._id,
      startTime: { $gte: start.toDate() },
      status: { $in: ["completed", "interrupted"] },
    }).lean();

    const totalFocus = sessions.reduce((a, s) => a + (s.focusMinutes || 0), 0);
    const totalBreak = sessions.reduce((a, s) => a + (s.breakMinutes || 0), 0);

    // Per-category totals
    const byCategory = {};
    for (const s of sessions) {
      const cat = s.category || "General";
      if (!byCategory[cat]) byCategory[cat] = { focusMinutes: 0, breakMinutes: 0, sessions: 0 };
      byCategory[cat].focusMinutes += s.focusMinutes || 0;
      byCategory[cat].breakMinutes += s.breakMinutes || 0;
      byCategory[cat].sessions += 1;
    }

    // Streak calculation (consecutive days achieving dailyGoalCycles)
    const settings = await PomodoroSettings.findOne({ userId: req.user._id }).lean();
    const goal = settings?.dailyGoalCycles || 4;

    let streak = 0;
    let cursor = now.startOf("day"); // today 00:00
    while (true) {
      const next = cursor.endOf("day");
      const daySessions = await PomodoroSession.countDocuments({
        userId: req.user._id,
        startTime: { $gte: cursor.toDate(), $lte: next.toDate() },
        type: "focus",
        status: { $in: ["completed", "interrupted"] },
      });

      if (daySessions >= goal) {
        streak += 1;
        cursor = cursor.subtract(1, "day");
      } else {
        break;
      }
    }

    res.json({
      range,
      timezone: tz,
      totals: { totalFocusMinutes: totalFocus, totalBreakMinutes: totalBreak },
      byCategory,
      streak: { days: streak, dailyGoalCycles: goal },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats", error: err.message });
  }
};
