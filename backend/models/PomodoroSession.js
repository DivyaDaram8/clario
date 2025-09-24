// models/PomodoroSession.js
const mongoose = require("mongoose");

const pomodoroSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PomodoroCategory",
    required: true
  },
  categoryName: {
    type: String,
    required: true
  },
  sessionType: {
    type: String,
    enum: ['pomodoro', 'shortBreak', 'longBreak'],
    required: true
  },
  plannedDuration: {
    type: Number,
    required: true // in minutes
  },
  actualDuration: {
    type: Number,
    required: true // in minutes
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  wasSkipped: {
    type: Boolean,
    default: false
  },
  cycleNumber: {
    type: Number,
    default: 1 // Which cycle in the pomodoro sequence (1-4)
  },
  date: {
    type: Date,
    default: function() {
      return new Date(this.startTime).setHours(0, 0, 0, 0);
    }
  }
}, {
  timestamps: true
});

// Index for efficient querying
pomodoroSessionSchema.index({ userId: 1, date: -1 });
pomodoroSessionSchema.index({ userId: 1, categoryId: 1 });

module.exports = mongoose.model("PomodoroSession", pomodoroSessionSchema);