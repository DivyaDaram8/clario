const ExpenseCategory = require("../models/ExpenseCategory");
const Transaction = require("../models/Transaction");

/* ----------------- CATEGORY CONTROLLERS ----------------- */

// Create Category
const createCategory = async (req, res) => {
 try {
   const { name, icon, type } = req.body;

   // Prevent duplicate category names for same user
   const existing = await ExpenseCategory.findOne({ userId: req.user._id, name });
   if (existing) {
     return res.status(400).json({ message: "Category name already exists." });
   }

   const category = new ExpenseCategory({
     userId: req.user._id,
     name,
     icon,
     type,
   });

   await category.save();
   res.status(201).json(category);
 } catch (err) {
   res.status(500).json({ message: "Error creating category", error: err.message });
 }
};

// Get All Categories
const getCategories = async (req, res) => {
 try {
   const categories = await ExpenseCategory.find({ userId: req.user._id }).sort({ createdAt: -1 });
   res.json(categories);
 } catch (err) {
   res.status(500).json({ message: "Error fetching categories", error: err.message });
 }
};

// Update Category (only name + icon allowed, type is fixed)
const updateCategory = async (req, res) => {
 try {
   const { categoryId } = req.params;
   const { name, icon } = req.body;

   const category = await ExpenseCategory.findOne({ _id: categoryId, userId: req.user._id });
   if (!category) return res.status(404).json({ message: "Category not found" });

   // Prevent duplicate name
   if (name) {
     const duplicate = await ExpenseCategory.findOne({ userId: req.user._id, name });
     if (duplicate && duplicate._id.toString() !== categoryId) {
       return res.status(400).json({ message: "Category name already exists." });
     }
     category.name = name;
   }

   if (icon) category.icon = icon;

   await category.save();
   res.json(category);
 } catch (err) {
   res.status(500).json({ message: "Error updating category", error: err.message });
 }
};

/* ----------------- TRANSACTION CONTROLLERS ----------------- */

// Create Transaction
const createTransaction = async (req, res) => {
 try {
   const { categoryId, amount, type, date, notes, paymentMethod } = req.body;

   const category = await ExpenseCategory.findOne({ _id: categoryId, userId: req.user._id });
   if (!category) return res.status(404).json({ message: "Category not found" });

   if (category.type !== type) {
     return res.status(400).json({ message: "Transaction type must match category type" });
   }

   const transaction = new Transaction({
     userId: req.user._id,
     categoryId,
     amount,
     type,
     date,
     notes,
     paymentMethod,
   });

   await transaction.save();
   res.status(201).json(transaction);
 } catch (err) {
   res.status(500).json({ message: "Error creating transaction", error: err.message });
 }
};

// Get All Transactions
const getTransactions = async (req, res) => {
 try {
   const transactions = await Transaction.find({ userId: req.user._id })
     .populate("categoryId", "name icon type")
     .sort({ date: -1 });

   res.json(transactions);
 } catch (err) {
   res.status(500).json({ message: "Error fetching transactions", error: err.message });
 }
};

// Update Transaction
const updateTransaction = async (req, res) => {
 try {
   const { transactionId } = req.params;
   const { amount, date, notes, paymentMethod } = req.body;

   const transaction = await Transaction.findOne({ _id: transactionId, userId: req.user._id });
   if (!transaction) return res.status(404).json({ message: "Transaction not found" });

   if (amount !== undefined) transaction.amount = amount;
   if (date) transaction.date = date;
   if (notes) transaction.notes = notes;
   if (paymentMethod) transaction.paymentMethod = paymentMethod;

   await transaction.save();
   res.json(transaction);
 } catch (err) {
   res.status(500).json({ message: "Error updating transaction", error: err.message });
 }
};

// Delete Transaction
const deleteTransaction = async (req, res) => {
 try {
   const { transactionId } = req.params;

   const transaction = await Transaction.findOneAndDelete({
     _id: transactionId,
     userId: req.user._id,
   });
   if (!transaction) return res.status(404).json({ message: "Transaction not found" });

   res.json({ message: "Transaction deleted successfully" });
 } catch (err) {
   res.status(500).json({ message: "Error deleting transaction", error: err.message });
 }
};

module.exports = {
 createCategory,
 getCategories,
 updateCategory,
 createTransaction,
 getTransactions,
 updateTransaction,
 deleteTransaction,
};

