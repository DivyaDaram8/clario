import React, { useState, useEffect } from "react";
import {
  FaHome, FaUtensils, FaCar, FaShoppingBag, FaFilm, FaPlus, FaArrowUp, FaArrowDown,
  FaCoffee, FaLaptop, FaBook, FaGift, FaHeart, FaPlane, FaBus, FaMobileAlt,
  FaWallet, FaGamepad, FaMusic, FaCamera, FaMedkit, FaTree, FaDog, FaCat, FaBeer,
  FaGlobe, FaShoppingCart, FaEdit, FaTrash
} from "react-icons/fa";
import NavbarLeft from "../layout/NavbarLeft";
import NavbarTop from "../layout/NavbarTop";

const COLORS = [
  "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500", "bg-purple-500",
  "bg-pink-500", "bg-indigo-500", "bg-teal-500", "bg-orange-500", "bg-gray-500"
];

const ICONS = [
  FaHome, FaUtensils, FaCar, FaShoppingBag, FaFilm, FaPlus, FaArrowUp, FaArrowDown,
  FaCoffee, FaLaptop, FaBook, FaGift, FaHeart, FaPlane, FaBus, FaMobileAlt,
  FaWallet, FaGamepad, FaMusic, FaCamera, FaMedkit, FaTree, FaDog, FaCat, FaBeer,
  FaGlobe, FaShoppingCart
];

const ExpenseTracker = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [transactionType, setTransactionType] = useState("");
  const [editCategoryIndex, setEditCategoryIndex] = useState(null);
  const [editTransactionId, setEditTransactionId] = useState(null);

  const [categories, setCategories] = useState([
    { name: "Rent", icon: FaHome, amount: 1200, color: "text-blue-600" },
    { name: "Food", icon: FaUtensils, amount: 450, color: "text-green-600" },
    { name: "Transport", icon: FaCar, amount: 180, color: "text-yellow-600" },
    { name: "Shopping", icon: FaShoppingBag, amount: 320, color: "text-purple-600" },
    { name: "Entertainment", icon: FaFilm, amount: 150, color: "text-red-600" },
  ]);

  const [newCategory, setNewCategory] = useState({ name: "", color: "", icon: FaHome });

  const [transactions, setTransactions] = useState([
    { id: 1, category: "Food", amount: -25.5, type: "Expense", date: "2024-09-20", notes: "Lunch at cafe" },
    { id: 2, category: "Salary", amount: 3200.0, type: "Income", date: "2024-09-19", notes: "Monthly salary" },
    { id: 3, category: "Transport", amount: -15.0, type: "Expense", date: "2024-09-18", notes: "Bus fare" },
    { id: 4, category: "Entertainment", amount: -45.0, type: "Expense", date: "2024-09-17", notes: "Movie tickets" },
    { id: 5, category: "Food", amount: -78.3, type: "Expense", date: "2024-09-16", notes: "Groceries" },
    { id: 6, category: "Freelance", amount: 500.0, type: "Income", date: "2024-09-15", notes: "Web design project" },
    { id: 7, category: "Shopping", amount: -120.0, type: "Expense", date: "2024-09-14", notes: "Clothing" },
    { id: 8, category: "Transport", amount: -25.0, type: "Expense", date: "2024-09-13", notes: "Taxi fare" },
  ]);

  const [totalBalance, setTotalBalance] = useState(0);

  const moneyQuote = "A penny saved is a penny earned.";

  useEffect(() => {
    const balance = transactions.reduce((acc, t) => acc + t.amount, 0);
    setTotalBalance(balance);
  }, [transactions]);

  const handleAddTransactionClick = () => setShowOptions(!showOptions);
  const handleTypeClick = (type) => {
    setTransactionType(type);
    setShowTransactionForm(true);
    setShowOptions(false);
    setEditTransactionId(null);
  };

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.color && newCategory.icon) {
      if (editCategoryIndex !== null) {
        const updated = [...categories];
        updated[editCategoryIndex] = { ...newCategory, amount: categories[editCategoryIndex].amount };
        setCategories(updated);
        setEditCategoryIndex(null);
      } else {
        setCategories([...categories, { ...newCategory, amount: 0 }]);
      }
      setNewCategory({ name: "", color: "", icon: FaHome });
      setShowCategoryForm(false);
    }
  };

  const handleTransactionSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const amount = parseFloat(form.amount.value);
    const category = form.category.value;
    const type = transactionType;
    const date = form.date.value;
    const notes = form.notes.value;

    if (editTransactionId !== null) {
      setTransactions(transactions.map(t => t.id === editTransactionId ? { ...t, amount: type === "Income" ? amount : -amount, category, type, date, notes } : t));
    } else {
      const newTransaction = {
        id: Date.now(),
        amount: type === "Income" ? amount : -amount,
        category,
        type,
        date,
        notes
      };
      setTransactions([newTransaction, ...transactions]);
    }
    setShowTransactionForm(false);
  };

  const handleTransactionEdit = (transaction) => {
    setTransactionType(transaction.type);
    setShowTransactionForm(true);
    setEditTransactionId(transaction.id);
    setTimeout(() => {
      const form = document.getElementById("transactionForm");
      form.amount.value = Math.abs(transaction.amount);
      form.category.value = transaction.category;
      form.date.value = transaction.date;
      form.notes.value = transaction.notes;
    }, 0);
  };

  const handleTransactionDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // Glass input/select components
  const GlassInput = ({ label, value, onChange, type = "text", placeholder }) => (
    <div>
      <label className="block mb-1 font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-xl bg-white/30 backdrop-blur-md border border-white/40 
          focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-800 shadow-md transition"
      />
    </div>
  );

  const GlassSelect = ({ label, children }) => (
    <div>
      <label className="block mb-1 font-medium text-gray-700">{label}</label>
      <select id="category" className="w-full px-3 py-2 rounded-xl bg-white/30 backdrop-blur-md border border-white/40 
        focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 shadow-md transition">
        {children}
      </select>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen overflow-hidden">
      {/* Navbars */}
      <div className="fixed top-0 left-0 h-full w-64 z-20"><NavbarLeft /></div>
      <div className="fixed top-0 left-64 right-0 h-16 z-20"><NavbarTop /></div>

      <div className="ml-64 mt-16 p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Expense Tracker</h1>

          {/* Top cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Balance */}
            <div className="bg-gray-50 rounded-xl shadow-md p-5 flex flex-col justify-center items-center hover:shadow-lg transition">
              <h2 className="text-lg font-semibold text-gray-600 mb-2">Total Balance</h2>
              <p className="text-3xl font-bold text-green-600">${totalBalance.toLocaleString()}</p>
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
                <h2 className="text-lg font-semibold text-gray-800">Spending by Category</h2>
                <button
                  onClick={() => { setShowCategoryForm(true); setEditCategoryIndex(null); }}
                  className="text-blue-600 hover:text-blue-800 flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-md"
                >
                  <FaPlus className="text-sm" />
                </button>
              </div>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {categories.map((cat, index) => {
                  const Icon = cat.icon;
                  return (
                    <div key={index} className="flex items-center justify-between text-base">
                      <div className="flex items-center space-x-3">
                        <Icon className={`${cat.color} text-xl`} />
                        <span className="text-gray-700 font-medium">{cat.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-800 font-semibold">${cat.amount}</span>
                        <FaEdit
                          onClick={() => { setEditCategoryIndex(index); setNewCategory(cat); setShowCategoryForm(true); }}
                          className="text-blue-500 cursor-pointer hover:text-blue-700"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Floating Transaction Form */}
          {showTransactionForm && (
            <div className="fixed inset-0 z-40 flex items-center justify-center">
              <div className="absolute inset-0 backdrop-blur-sm bg-white/30" />
              <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl p-6 w-96 z-50 relative">
                <h2 className="text-xl font-semibold mb-4">{transactionType} Transaction</h2>
                <form id="transactionForm" className="space-y-4" onSubmit={handleTransactionSave}>
                  <GlassInput label="Amount" type="number" placeholder="Enter amount" />
                  <GlassSelect label="Category">
                    {categories.map((cat, idx) => <option key={idx}>{cat.name}</option>)}
                  </GlassSelect>
                  <GlassSelect label="Payment Method">
                    <option>Cash</option><option>Card</option><option>UPI</option>
                  </GlassSelect>
                  <GlassInput label="Date" type="date" />
                  <GlassInput label="Notes" placeholder="Add notes..." />
                  <div className="flex justify-end space-x-2">
                    <button type="button" onClick={() => setShowTransactionForm(false)}
                      className="px-4 py-2 rounded-xl bg-gray-300 hover:bg-gray-400">Cancel</button>
                    <button type="submit"
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">Save</button>
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
                <h2 className="text-xl font-semibold mb-4">{editCategoryIndex !== null ? "Edit" : "Add"} Category</h2>
                <form className="space-y-4">
                  <GlassInput
                    label="Category Name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Category Name"
                  />
                  <label className="block mb-1 font-medium text-gray-700">Color</label>
                  <div className="flex flex-wrap gap-2 mb-4 max-h-32 overflow-y-auto">
                    {COLORS.map((color, idx) => (
                      <div key={idx}
                        className={`w-8 h-8 rounded-full cursor-pointer border-2 ${newCategory.color === color ? "border-black" : "border-transparent"} ${color}`}
                        onClick={() => setNewCategory({ ...newCategory, color })}></div>
                    ))}
                  </div>
                  <label className="block mb-1 font-medium text-gray-700">Icon</label>
                  <div className="grid grid-cols-6 gap-3 max-h-48 overflow-y-auto">
                    {ICONS.map((IconComponent, idx) => (
                      <div key={idx}
                        className={`p-2 cursor-pointer rounded-lg flex items-center justify-center border-2 ${newCategory.icon === IconComponent ? "border-black" : "border-transparent"} hover:bg-gray-100`}
                        onClick={() => setNewCategory({ ...newCategory, icon: IconComponent })}>
                        <IconComponent className="text-xl" />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <button type="button" onClick={() => setShowCategoryForm(false)}
                      className="px-4 py-2 rounded-xl bg-gray-300 hover:bg-gray-400">Cancel</button>
                    <button type="button" onClick={handleAddCategory}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
                      {editCategoryIndex !== null ? "Save Changes" : "Add Category"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Transaction History */}
          <div className="bg-gray-50 rounded-xl shadow-md p-5 hover:shadow-lg transition h-[450px] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Transaction History</h2>
            <table className="w-full min-w-full text-base">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Notes</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-100">
                    <td className="py-2 px-3">{t.category}</td>
                    <td className={`py-2 px-3 font-semibold ${t.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                      ${Math.abs(t.amount).toFixed(2)}
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${t.type === "Income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-gray-600">{t.date}</td>
                    <td className="py-2 px-3 text-gray-600">{t.notes}</td>
                    <td className="py-2 px-3 flex items-center space-x-2 justify-center">
                      <FaEdit className="text-blue-500 cursor-pointer hover:text-blue-700" onClick={() => handleTransactionEdit(t)} />
                      <FaTrash className="text-red-500 cursor-pointer hover:text-red-700" onClick={() => handleTransactionDelete(t.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
