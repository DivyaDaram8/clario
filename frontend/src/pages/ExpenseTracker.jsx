import React, { useState, useEffect } from "react";
import {
  FaHome, FaUtensils, FaCar, FaShoppingBag, FaFilm, FaPlus, FaArrowUp, FaArrowDown,
  FaCoffee, FaLaptop, FaBook, FaGift, FaHeart, FaPlane, FaBus, FaMobileAlt,
  FaWallet, FaGamepad, FaMusic, FaCamera, FaMedkit, FaTree, FaDog, FaCat, FaBeer,
  FaGlobe, FaShoppingCart, FaEdit, FaTrash
} from "react-icons/fa";
import NavbarLeft from "../layout/NavbarLeft";
import NavbarTop from "../layout/NavbarTop";
import { apiRequest } from "../api"; // Import your API function

const COLORS = [
  "text-blue-600", "text-green-600", "text-yellow-600", "text-red-600", "text-purple-600",
  "text-pink-600", "text-indigo-600", "text-teal-600", "text-orange-600", "text-gray-600"
];

const ICON_MAP = {
  FaHome, FaUtensils, FaCar, FaShoppingBag, FaFilm, FaPlus, FaArrowUp, FaArrowDown,
  FaCoffee, FaLaptop, FaBook, FaGift, FaHeart, FaPlane, FaBus, FaMobileAlt,
  FaWallet, FaGamepad, FaMusic, FaCamera, FaMedkit, FaTree, FaDog, FaCat, FaBeer,
  FaGlobe, FaShoppingCart
};

const ICONS = Object.entries(ICON_MAP);

const ExpenseTracker = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [transactionType, setTransactionType] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editTransactionId, setEditTransactionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ 
    name: "", 
    icon: "FaHome", 
    type: "Expense" 
  });
  
  const [transactions, setTransactions] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [monthlyBalance, setMonthlyBalance] = useState(0);

  const moneyQuote = "A penny saved is a penny earned.";

  // Filters
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);


  // Load data on component mount
  useEffect(() => {
    loadCategories();
    loadTransactions();
  }, []);

  // Calculate balances when transactions change
  useEffect(() => {
    calculateBalances();
  }, [transactions]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/expenses/categories");
      setCategories(data);
    } catch (err) {
      setError("Failed to load categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/expenses/transactions");
      setTransactions(data);
    } catch (err) {
      setError("Failed to load transactions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateBalances = () => {
    const total = transactions.reduce((acc, t) => {
      return acc + (t.type === "Income" ? t.amount : -t.amount);
    }, 0);
    setTotalBalance(total);

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    const monthly = transactions
      .filter((t) => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() + 1 === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      })
      .reduce((acc, t) => {
        return acc + (t.type === "Income" ? t.amount : -t.amount);
      }, 0);
    setMonthlyBalance(monthly);
  };

  const handleAddTransactionClick = () => setShowOptions(!showOptions);
  
  const handleTypeClick = (type) => {
    setTransactionType(type);
    setNewCategory({ ...newCategory, type });
    setShowTransactionForm(true);
    setShowOptions(false);
    setEditTransactionId(null);
  };

  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.type) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      if (editCategoryId) {
        // Update category
        const updatedCategory = await apiRequest(
          `/expenses/categories/${editCategoryId}`, 
          "PUT", 
          {
            name: newCategory.name,
            icon: newCategory.icon
          }
        );
        setCategories(categories.map(cat => 
          cat._id === editCategoryId ? updatedCategory : cat
        ));
        setEditCategoryId(null);
      } else {
        // Create new category
        const category = await apiRequest("/expenses/categories", "POST", newCategory);
        setCategories([...categories, category]);
      }
      
      setNewCategory({ name: "", icon: "FaHome", type: "Expense" });
      setShowCategoryForm(false);
    } catch (err) {
      setError(err.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionSave = async (e) => {
    e.preventDefault();
    const form = e.target;
    const amount = parseFloat(form.amount.value);
    const categoryId = form.category.value;
    const date = form.date.value;
    const notes = form.notes.value;
    const paymentMethod = form.paymentMethod.value;

    if (!amount || !categoryId || !date) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const transactionData = {
        categoryId,
        amount,
        type: transactionType,
        date,
        notes,
        paymentMethod
      };

      if (editTransactionId) {
        // Update transaction
        const updatedTransaction = await apiRequest(
          `/expenses/transactions/${editTransactionId}`, 
          "PUT", 
          {
            amount,
            date,
            notes,
            paymentMethod
          }
        );
        await loadTransactions(); // Reload to get populated data
      } else {
        // Create new transaction
        await apiRequest("/expenses/transactions", "POST", transactionData);
        await loadTransactions(); // Reload to get populated data
      }
      
      setShowTransactionForm(false);
      setEditTransactionId(null);
    } catch (err) {
      setError(err.message || "Failed to save transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionEdit = (transaction) => {
    setTransactionType(transaction.type);
    setShowTransactionForm(true);
    setEditTransactionId(transaction._id);
    
    setTimeout(() => {
      const form = document.getElementById("transactionForm");
      if (form) {
        form.amount.value = transaction.amount;
        form.category.value = transaction.categoryId._id;
        form.date.value = transaction.date.split('T')[0];
        form.notes.value = transaction.notes || "";
        form.paymentMethod.value = transaction.paymentMethod;
      }
    }, 0);
  };

// Open the modal
const confirmDeleteTransaction = (id) => {
  setTransactionToDelete(id);
  setShowDeleteModal(true);
};

// Actually delete when confirmed
const handleTransactionDelete = async () => {
  if (!transactionToDelete) return;

  try {
    setLoading(true);
    await apiRequest(`/expenses/transactions/${transactionToDelete}`, "DELETE");
    setTransactions(transactions.filter(t => t._id !== transactionToDelete));
  } catch (err) {
    setError(err.message || "Failed to delete transaction");
  } finally {
    setLoading(false);
    setShowDeleteModal(false);
    setTransactionToDelete(null);
  }
};


  const handleCategoryEdit = (category) => {
    setEditCategoryId(category._id);
    setNewCategory({
      name: category.name,
      icon: category.icon,
      type: category.type
    });
    setShowCategoryForm(true);
  };

  const getIconComponent = (iconName) => {
    return ICON_MAP[iconName] || FaHome;
  };

  // Glass input/select components
  const GlassInput = ({ label, name, type = "text", placeholder, required = false }) => (
    <div>
      <label className="block mb-1 font-medium text-gray-700">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 rounded-xl bg-white/30 backdrop-blur-md border border-white/40 
          focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800 shadow-md transition"
      />
    </div>
  );

  const GlassSelect = ({ label, children, name, required = false }) => (
    <div>
      <label className="block mb-1 font-medium text-gray-700">{label}</label>
      <select
        name={name}
        required={required}
        className="w-full px-3 py-2 rounded-xl bg-white/30 backdrop-blur-md border border-white/40 
        focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 shadow-md transition"
      >
        {children}
      </select>
    </div>
  );

  // Filtered transactions
  const filteredTransactions = transactions.filter((t) => {
    const month = new Date(t.date).getMonth() + 1;
    return (
      (filterCategory === "All" || t.categoryId?.name === filterCategory) &&
      (filterType === "All" || t.type === filterType) &&
      (filterMonth === "All" || month === parseInt(filterMonth))
    );
  });

  return (
    <div className="bg-gray-50 min-h-screen overflow-hidden">
      {/* Navbars */}
      <div className="fixed top-0 left-0 h-full w-64 z-20"><NavbarLeft /></div>
      <div className="fixed top-0 left-64 right-0 h-16 z-20"><NavbarTop /></div>

      <div className="ml-64 mt-16 p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Expense Tracker</h1>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
              <button 
                onClick={() => setError("")}
                className="float-right text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">
              Loading...
            </div>
          )}

          {/* Top cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Balance */}
            <div className="bg-gray-50 rounded-xl shadow-md p-5 flex flex-col justify-center items-center hover:shadow-lg transition">
              <h2 className="text-lg font-semibold text-gray-600 mb-2">This Month Balance</h2>
              <p className={`text-3xl font-bold mb-2 ${monthlyBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${monthlyBalance.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                All Time: <span className={`font-semibold ${totalBalance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  ${totalBalance.toLocaleString()}
                </span>
              </p>
            </div>

            {/* Quote + Add transaction */}
            <div className="bg-gray-50 rounded-xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition relative">
              <p className="text-gray-600 italic text-center mb-4">"{moneyQuote}"</p>
              <button
                onClick={handleAddTransactionClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-lg flex items-center justify-center space-x-2"
              >
                <FaPlus /><span>Add Transaction</span>
              </button>

              {showOptions && (
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 flex space-x-6 z-30">
                  <button
                    onClick={() => handleTypeClick("Expense")}
                    className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-red-600 text-white hover:bg-red-700"
                  >
                    <FaArrowUp className="text-2xl" /><span className="text-xs mt-1">Expense</span>
                  </button>
                  <button
                    onClick={() => handleTypeClick("Income")}
                    className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-green-600 text-white hover:bg-green-700"
                  >
                    <FaArrowDown className="text-2xl" /><span className="text-xs mt-1">Income</span>
                  </button>
                </div>
              )}
            </div>

            {/* Categories */}
            <div className="bg-gray-50 rounded-xl shadow-md p-5 hover:shadow-lg transition relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
                <button
                  onClick={() => { 
                    setShowCategoryForm(true); 
                    setEditCategoryId(null);
                    setNewCategory({ name: "", icon: "FaHome", type: "Expense" });
                  }}
                  className="text-blue-600 hover:text-blue-800 flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-md"
                >
                  <FaPlus className="text-sm" />
                </button>
              </div>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {categories.map((cat) => {
                  const IconComponent = getIconComponent(cat.icon);
                  const categoryTransactions = transactions.filter(t => t.categoryId?._id === cat._id);
                  const categoryAmount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
                  
                  return (
                    <div key={cat._id} className="flex items-center justify-between text-base">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="text-blue-600 text-xl" />
                        <span className="text-gray-700 font-medium">{cat.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          cat.type === 'Income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {cat.type}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-800 font-semibold">${Math.abs(categoryAmount).toFixed(2)}</span>
                        <FaEdit
                          onClick={() => handleCategoryEdit(cat)}
                          className="text-blue-500 cursor-pointer hover:text-blue-700"
                        />
                      </div>
                    </div>
                  );
                })}
                {categories.length === 0 && (
                  <p className="text-gray-500 text-center">No categories yet. Add your first category!</p>
                )}
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-gray-50 rounded-xl shadow-md p-5 hover:shadow-lg transition h-[450px] flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Transaction History</h2>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">Filter by Category</label>
                <select 
                  value={filterCategory} 
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/30 backdrop-blur-md border border-white/40 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 shadow-md transition"
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">Filter by Type</label>
                <select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/30 backdrop-blur-md border border-white/40 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 shadow-md transition"
                >
                  <option value="All">All Types</option>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">Filter by Month</label>
                <select 
                  value={filterMonth} 
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/30 backdrop-blur-md border border-white/40 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 shadow-md transition"
                >
                  <option value="All">All Months</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString("default", { month: "long" })}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-y-auto flex-1">
              <table className="w-full min-w-full text-base">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Payment</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Notes</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((t) => (
                    <tr key={t._id} className="border-b border-gray-100 hover:bg-gray-100">
                      <td className="py-2 px-3">{t.categoryId?.name || 'Unknown'}</td>
                      <td className={`py-2 px-3 font-semibold ${t.type === "Income" ? "text-green-600" : "text-red-600"}`}>
                        ${t.amount.toFixed(2)}
                      </td>
                      <td className="py-2 px-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          t.type === "Income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-gray-600">
                        {new Date(t.date).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-3 text-gray-600">{t.paymentMethod}</td>
                      <td className="py-2 px-3 text-gray-600">{t.notes || '-'}</td>
                      <td className="py-2 px-3 flex items-center space-x-2 justify-center">
                        <FaEdit 
                          className="text-blue-500 cursor-pointer hover:text-blue-700" 
                          onClick={() => handleTransactionEdit(t)} 
                        />
                        <FaTrash 
                          className="text-red-500 cursor-pointer hover:text-red-700" 
                          onClick={() => confirmDeleteTransaction(t._id)} 
 
                        />
                      </td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan="7" className="py-4 text-center text-gray-500">
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Floating Transaction Form */}
          {showTransactionForm && (
            <div className="fixed inset-0 z-40 flex items-center justify-center">
              <div className="absolute inset-0 backdrop-blur-sm bg-white/30" />
              <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl p-6 w-96 z-50 relative">
                <h2 className="text-xl font-semibold mb-4">
                  {editTransactionId ? 'Edit' : 'Add'} {transactionType} Transaction
                </h2>
                <form id="transactionForm" className="space-y-4" onSubmit={handleTransactionSave}>
                  <GlassInput 
                    label="Amount" 
                    name="amount"
                    type="number" 
                    step="0.01"
                    placeholder="Enter amount" 
                    required 
                  />
                  
                  <GlassSelect label="Category" name="category" required>
                    <option value="">Select Category</option>
                    {categories
                      .filter(cat => cat.type === transactionType)
                      .map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                  </GlassSelect>
                  
                  <GlassSelect label="Payment Method" name="paymentMethod" required>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="UPI">UPI</option>
                    <option value="Other">Other</option>
                  </GlassSelect>
                  
                  <GlassInput 
                    label="Date" 
                    name="date"
                    type="date" 
                    required 
                  />
                  
                  <GlassInput 
                    label="Notes" 
                    name="notes"
                    placeholder="Add notes..." 
                  />
                  
                  <div className="flex justify-end space-x-2">
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowTransactionForm(false);
                        setEditTransactionId(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-gray-300 hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : (editTransactionId ? 'Update' : 'Save')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Floating Add/Edit Category Form */}
          {showCategoryForm && (
            <div className="fixed inset-0 z-40 flex items-center justify-center">
              <div className="absolute inset-0 backdrop-blur-sm bg-white/30" />
              <div className="bg-white/30 backdrop-blur-lg shadow-xl rounded-2xl p-6 w-96 z-50 relative">
                <h2 className="text-xl font-semibold mb-4">
                  {editCategoryId ? "Edit" : "Add"} Category
                </h2>
                <form className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Category Name</label>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      placeholder="Category Name"
                      className="w-full px-3 py-2 rounded-xl bg-white/30 backdrop-blur-md border border-white/40 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800 shadow-md transition"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Type</label>
                    <select
                      value={newCategory.type}
                      onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/30 backdrop-blur-md border border-white/40 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 shadow-md transition"
                      disabled={editCategoryId} // Don't allow type change for existing categories
                    >
                      <option value="Expense">Expense</option>
                      <option value="Income">Income</option>
                    </select>
                  </div>
                  
                  <label className="block mb-1 font-medium text-gray-700">Icon</label>
                  <div className="grid grid-cols-6 gap-3 max-h-48 overflow-y-auto">
                    {ICONS.map(([iconName, IconComponent], idx) => (
                      <div 
                        key={idx}
                        className={`p-2 cursor-pointer rounded-lg flex items-center justify-center border-2 ${
                          newCategory.icon === iconName ? "border-blue-500 bg-blue-100" : "border-transparent hover:bg-gray-100"
                        }`}
                        onClick={() => setNewCategory({ ...newCategory, icon: iconName })}
                      >
                        <IconComponent className="text-xl" />
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-4">
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowCategoryForm(false);
                        setEditCategoryId(null);
                        setNewCategory({ name: "", icon: "FaHome", type: "Expense" });
                      }}
                      className="px-4 py-2 rounded-xl bg-gray-300 hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      onClick={handleAddCategory}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : (editCategoryId ? "Save Changes" : "Add Category")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showDeleteModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
                <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl shadow-lg p-6 w-[350px] text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Are you sure you want to delete this transaction?
                  </h3>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={handleTransactionDelete}
                      className="px-4 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 rounded-xl bg-gray-300 text-gray-800 font-medium hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;