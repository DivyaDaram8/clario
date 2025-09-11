const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "ExpenseCategory", required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["Income", "Expense"], required: true },
    date: { type: Date, required: true },
    notes: { type: String },
    paymentMethod: { type: String, enum: ["Cash", "Card", "UPI", "Other"], default: "Other" },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
