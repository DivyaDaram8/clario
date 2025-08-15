const mongoose = require("mongoose");

const PomodoroSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    category: { type: String, default: "General", trim: true },

    // planned values (minutes)
    plannedFocus: { type: Number, required: true, min: 1, max: 180 },
    plannedBreak: { type: Number, default: 0, min: 0, max: 60 },

    // actuals
    focusMinutes: { type: Number, default: 0, min: 0 },
    breakMinutes: { type: Number, default: 0, min: 0 },

    type: {
      type: String,
      enum: ["focus", "short-break", "long-break"],
      default: "focus",
    },

    status: {
      type: String,
      enum: ["in-progress", "completed", "interrupted", "skipped"],
      default: "in-progress",
    },

    startTime: { type: Date, required: true },
    endTime: { type: Date },

    notes: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PomodoroSession", PomodoroSessionSchema);
