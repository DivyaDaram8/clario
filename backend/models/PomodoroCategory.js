// models/PomodoroCategory.js
const mongoose = require("mongoose");

const pomodoroCategorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: "#3B82F6" // Default blue color
  },
  totalPomodoros: {
    type: Number,
    default: 0
  },
  totalFocusTime: {
    type: Number,
    default: 0 // in minutes
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure unique category names per user
pomodoroCategorySchema.index({ userId: 1, name: 1 }, { unique: true });

// Maximum 25 categories per user
pomodoroCategorySchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments({ userId: this.userId });
    if (count >= 25) {
      const error = new Error('Maximum 25 categories allowed per user');
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model("PomodoroCategory", pomodoroCategorySchema);