const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 40 },
    color: { type: String, default: "#9ca3af" }, // optional UI color
  },
  { _id: false }
);

const PomodoroSettingsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    // Timings (in minutes)
    focusDuration: { type: Number, default: 25, min: 1, max: 180 },
    shortBreakDuration: { type: Number, default: 5, min: 1, max: 60 },
    longBreakDuration: { type: Number, default: 15, min: 1, max: 60 },
    longBreakInterval: { type: Number, default: 4, min: 1, max: 12 },

    // Categories (max 10)
    categories: {
      type: [CategorySchema],
      validate: [arr => arr.length <= 10, "{PATH} exceeds the limit of 10"],
      default: [{ name: "General", color: "#9ca3af" }],
    },

    // Goals
    dailyGoalCycles: { type: Number, default: 4, min: 1, max: 24 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PomodoroSettings", PomodoroSettingsSchema);
