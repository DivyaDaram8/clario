const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  priority: { 
    type: String, 
    enum: ["High", "Medium", "Low"], 
    default: "Medium" 
  },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  orderIndex: { type: Number, default: 0 }, // For drag & drop ordering
  completed: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  taskDate: { type: Date, required: true }
});

module.exports = mongoose.model("Task", taskSchema);
