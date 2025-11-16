// models/Category.js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  color: { type: String, default: "#000000" },
  icon: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
});

// Prevent duplicate category names per user
categorySchema.index({ createdBy: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);
