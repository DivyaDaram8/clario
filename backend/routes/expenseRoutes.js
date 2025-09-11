const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createCategory,
  getCategories,
  updateCategory,
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/expenseController");

const router = express.Router();

/* ---------- CATEGORY ROUTES ---------- */
router.post("/categories", protect, createCategory);          // Create category
router.get("/categories", protect, getCategories);            // Get all categories
router.put("/categories/:categoryId", protect, updateCategory); // Update category

/* ---------- TRANSACTION ROUTES ---------- */
router.post("/transactions", protect, createTransaction);        // Create transaction
router.get("/transactions", protect, getTransactions);           // Get all transactions
router.put("/transactions/:transactionId", protect, updateTransaction); // Update transaction
router.delete("/transactions/:transactionId", protect, deleteTransaction); // Delete transaction

module.exports = router;
