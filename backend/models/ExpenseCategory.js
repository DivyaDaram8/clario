const mongoose = require("mongoose");

const expenseCategorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    icon: { type: String },
    type: { type: String, enum: ["Income", "Expense"], required: true },
  },
  { timestamps: true }
);

const ExpenseCategory = mongoose.model("ExpenseCategory", expenseCategorySchema);
module.exports = ExpenseCategory;
