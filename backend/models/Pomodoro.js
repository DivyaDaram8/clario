const mongoose = require("mongoose");

const pomodoroSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  settings: {
    pomodoroTime: { type: Number, default: 25 },
    shortBreakTime: { type: Number, default: 5 },
    longBreakTime: { type: Number, default: 15 },
    dailyGoal: { type: Number, default: 8 },
    longBreakAfter: { type: Number, default: 4 }
  },

  currentSession: {
    isActive: { type: Boolean, default: false },
    sessionType: { type: String, enum: ['pomodoro', 'shortBreak', 'longBreak'], default: 'pomodoro' },
    timeRemaining: { type: Number, default: 0 },
    isPaused: { type: Boolean, default: false },
    currentCycle: { type: Number, default: 1 },
    selectedCategory: { type: String, default: 'General' },
    sessionStartTime: { type: Date }
  },

  stats: {
    totalPomodoros: { type: Number, default: 0 },
    totalFocusTime: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    highestStreak: { type: Number, default: 0 },
    lastPomodoroDate: { type: Date },
    todayPomodoros: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: Date.now }
  }
}, { timestamps: true });

module.exports = mongoose.model("Pomodoro", pomodoroSchema);