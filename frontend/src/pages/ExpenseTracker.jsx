
import React, { useState, useEffect } from "react";
import {
 FaHome, FaUtensils, FaCar, FaShoppingBag, FaFilm, FaPlus, FaArrowUp, FaArrowDown,
 FaCoffee, FaLaptop, FaBook, FaGift, FaHeart, FaPlane, FaBus, FaMobileAlt,
 FaWallet, FaGamepad, FaMusic, FaCamera, FaMedkit, FaTree, FaDog, FaCat, FaBeer,
 FaGlobe, FaShoppingCart, FaEdit, FaTrash, FaEye
} from "react-icons/fa";
import NavbarLeft from "../layout/NavbarLeft";
import NavbarTop from "../layout/NavbarTop";
import { apiRequest } from "../api";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import "../styles/ExpenseTracker.css";
const ICON_MAP = {
 FaHome, FaUtensils, FaCar, FaShoppingBag, FaFilm, FaPlus, FaArrowUp, FaArrowDown,
 FaCoffee, FaLaptop, FaBook, FaGift, FaHeart, FaPlane, FaBus, FaMobileAlt,
 FaWallet, FaGamepad, FaMusic, FaCamera, FaMedkit, FaTree, FaDog, FaCat, FaBeer,
 FaGlobe, FaShoppingCart
};

const ICONS = Object.entries(ICON_MAP);

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'];

const ExpenseTracker = () => {
 const [showAddModal, setShowAddModal] = useState(false);
 const [showTransactionForm, setShowTransactionForm] = useState(false);
 const [showCategoryForm, setShowCategoryForm] = useState(false);
 const [showCategoryDetails, setShowCategoryDetails] = useState(false);
 const [transactionType, setTransactionType] = useState("");
 const [editCategoryId, setEditCategoryId] = useState(null);
 const [editTransactionId, setEditTransactionId] = useState(null);
 const [loading, setLoading] = useState(false);
 const [notification, setNotification] = useState({ message: '', type: '', show: false });

 const [categories, setCategories] = useState([]);
 const [newCategory, setNewCategory] = useState({
   name: "",
   icon: "FaHome",
   type: "Expense"
 });
  const [transactions, setTransactions] = useState([]);
 const [totalBalance, setTotalBalance] = useState(0);
 const [monthlyBalance, setMonthlyBalance] = useState(0);
 const [chartView, setChartView] = useState("expense");

 const [filterCategory, setFilterCategory] = useState("All");
 const [filterType, setFilterType] = useState("All");
 const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);

 const [showDeleteModal, setShowDeleteModal] = useState(false);
 const [transactionToDelete, setTransactionToDelete] = useState(null);

 useEffect(() => {
   loadCategories();
   loadTransactions();
 }, []);

 useEffect(() => {
   calculateBalances();
 }, [transactions]);

 const showNotification = (message, type = 'success') => {
   setNotification({ message, type, show: true });
   setTimeout(() => {
     setNotification({ message: '', type: '', show: false });
   }, 3000);
 };

 const loadCategories = async () => {
   try {
     setLoading(true);
     const data = await apiRequest("/expenses/categories");
     setCategories(data);
   } catch (err) {
     showNotification("Failed to load categories", "error");
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
     showNotification("Failed to load transactions", "error");
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

 const handleAddCategory = async () => {
   if (!newCategory.name || !newCategory.type) {
     showNotification("Please fill all required fields", "error");
     return;
   }

   try {
     setLoading(true);
    
     if (editCategoryId) {
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
       showNotification("Category updated successfully!");
     } else {
       const category = await apiRequest("/expenses/categories", "POST", newCategory);
       setCategories([...categories, category]);
       showNotification("Category created successfully!");
     }
    
     setNewCategory({ name: "", icon: "FaHome", type: "Expense" });
     setShowCategoryForm(false);
   } catch (err) {
     showNotification(err.message || "Failed to save category", "error");
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
     showNotification("Please fill all required fields", "error");
     return;
   }

   try {
     setLoading(true);

     const transactionData = {
       categoryId,
       amount,
       type: transactionType,
       date,
       notes,
       paymentMethod
     };

     if (editTransactionId) {
       await apiRequest(
         `/expenses/transactions/${editTransactionId}`,
         "PUT",
         {
           amount,
           date,
           notes,
           paymentMethod
         }
       );
       await loadTransactions();
       showNotification("Transaction updated successfully!");
     } else {
       await apiRequest("/expenses/transactions", "POST", transactionData);
       await loadTransactions();
       showNotification("Transaction created successfully!");
     }
    
     setShowTransactionForm(false);
     setEditTransactionId(null);
   } catch (err) {
     showNotification(err.message || "Failed to save transaction", "error");
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

 const confirmDeleteTransaction = (id) => {
   setTransactionToDelete(id);
   setShowDeleteModal(true);
 };

 const handleTransactionDelete = async () => {
   if (!transactionToDelete) return;

   try {
     setLoading(true);
     await apiRequest(`/expenses/transactions/${transactionToDelete}`, "DELETE");
     setTransactions(transactions.filter(t => t._id !== transactionToDelete));
     showNotification("Transaction deleted successfully!");
   } catch (err) {
     showNotification(err.message || "Failed to delete transaction", "error");
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

 const expenseCategories = categories.filter(c => c.type === "Expense");
 const incomeCategories = categories.filter(c => c.type === "Income");

 const getChartDataByType = (type) => {
   const categoryData = {};
  
   transactions.forEach(t => {
     if (t.type === type) {
       const catName = t.categoryId?.name || 'Unknown';
       if (!categoryData[catName]) {
         categoryData[catName] = 0;
       }
       categoryData[catName] += t.amount;
     }
   });

   return Object.entries(categoryData).map(([name, value]) => ({
     name,
     value: parseFloat(value.toFixed(2))
   }));
 };

 const chartData = getChartDataByType(chartView === "expense" ? "Expense" : "Income");

 const filteredTransactions = transactions.filter((t) => {
   const month = new Date(t.date).getMonth() + 1;
   return (
     (filterCategory === "All" || t.categoryId?.name === filterCategory) &&
     (filterType === "All" || t.type === filterType) &&
     (filterMonth === "All" || month === parseInt(filterMonth))
   );
 });

 return (
   <>
   <div className="et-container">
     <div className="et-navbar-left"><NavbarLeft /></div>
     <div className="et-navbar-top"><NavbarTop /></div>

     <div className="et-main-wrapper">
       <div className="et-content">
         <div className="et-header">
           <h1 className="et-title">Expense Tracker</h1>
         </div>

         {/* Top Cards Grid */}
         <div className="et-top-grid">
           {/* Left Column */}
           <div className="et-left-column">
             {/* Total Balance Card */}
             <div className="et-card et-balance-card">
               <h2 className="et-card-title">This Month</h2>
               <p className={`et-balance-amount ${monthlyBalance >= 0 ? 'et-positive' : 'et-negative'}`}>
                 ${Math.abs(monthlyBalance).toLocaleString()}
               </p>
               <p className="et-balance-subtitle">
                 All Time: <span className={`et-balance-total ${totalBalance >= 0 ? 'et-positive' : 'et-negative'}`}>
                   ${Math.abs(totalBalance).toLocaleString()}
                 </span>
               </p>
             </div>

             {/* Add Transaction Card */}
             <div className="et-card et-add-card">
               <p className="et-quote">"A penny saved is a penny earned."</p>
               <button onClick={() => setShowAddModal(true)} className="et-add-btn">
                 <FaPlus /> Add
               </button>
             </div>
           </div>

           {/* Middle Column - Chart */}
           <div className="et-card et-chart-card">
             <div className="et-chart-header">
               <h2 className="et-card-title">{chartView === "expense" ? "Expense" : "Income"} Breakdown</h2>
               <div className="et-chart-controls">
                 <button
                   onClick={() => setChartView("expense")}
                   className={`et-chart-tab ${chartView === "expense" ? "et-chart-tab-active" : ""}`}
                 >
                   Expense
                 </button>
                 <button
                   onClick={() => setChartView("income")}
                   className={`et-chart-tab ${chartView === "income" ? "et-chart-tab-active" : ""}`}
                 >
                   Income
                 </button>
               </div>
             </div>
             {chartData.length > 0 ? (
               <ResponsiveContainer width="100%" height="85%">
                 <PieChart>
                   <Pie
                     data={chartData}
                     cx="50%"
                     cy="50%"
                     labelLine={false}
                     label={(entry) => `${entry.name}: ${entry.value}`}
                     outerRadius={70}
                     fill="#8884d8"
                     dataKey="value"
                   >
                     {chartData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip />
                 </PieChart>
               </ResponsiveContainer>
             ) : (
               <div className="et-no-data">No {chartView} data to display</div>
             )}
           </div>

           {/* Right Column - Categories */}
           <div className="et-card et-categories-card">
             <div className="et-card-header">
               <h2 className="et-card-title">Categories</h2>
               <button onClick={() => {
                 setShowCategoryForm(true);
                 setEditCategoryId(null);
                 setNewCategory({ name: "", icon: "FaHome", type: "Expense" });
               }} className="et-icon-btn">
                 <FaPlus />
               </button>
             </div>
            
             <div className="et-categories-grid">
               <div className="et-categories-section">
                 <div className="et-category-type-label">Expenses</div>
                 <div className="et-categories-list">
                   {expenseCategories.slice(0, 4).map((cat) => {
                     const IconComponent = getIconComponent(cat.icon);
                     return (
                       <div key={cat._id} className="et-category-item">
                         <IconComponent className="et-category-icon" />
                         <span className="et-category-name">{cat.name}</span>
                       </div>
                     );
                   })}
                   {expenseCategories.length === 0 && (
                     <div className="et-no-categories">No expense categories</div>
                   )}
                 </div>
               </div>

               <div className="et-categories-divider"></div>

               <div className="et-categories-section">
                 <div className="et-category-type-label">Income</div>
                 <div className="et-categories-list">
                   {incomeCategories.slice(0, 4).map((cat) => {
                     const IconComponent = getIconComponent(cat.icon);
                     return (
                       <div key={cat._id} className="et-category-item">
                         <IconComponent className="et-category-icon" />
                         <span className="et-category-name">{cat.name}</span>
                       </div>
                     );
                   })}
                   {incomeCategories.length === 0 && (
                     <div className="et-no-categories">No income categories</div>
                   )}
                 </div>
               </div>
             </div>

             <button onClick={() => setShowCategoryDetails(true)} className="et-view-more-btn">
               <FaEye /> View More
             </button>
           </div>
         </div>

         {/* Transaction History */}
         <div className="et-card et-history-card">
           <h2 className="et-card-title">Transaction History</h2>

           {/* Filters */}
           <div className="et-filters">
             <div className="et-filter-group">
               <label className="et-filter-label">Category</label>
               <select
                 value={filterCategory}
                 onChange={(e) => setFilterCategory(e.target.value)}
                 className="et-select"
               >
                 <option value="All">All Categories</option>
                 {categories.map((c) => (
                   <option key={c._id} value={c.name}>{c.name}</option>
                 ))}
               </select>
             </div>

             <div className="et-filter-group">
               <label className="et-filter-label">Type</label>
               <select
                 value={filterType}
                 onChange={(e) => setFilterType(e.target.value)}
                 className="et-select"
               >
                 <option value="All">All Types</option>
                 <option value="Income">Income</option>
                 <option value="Expense">Expense</option>
               </select>
             </div>

             <div className="et-filter-group">
               <label className="et-filter-label">Month</label>
               <select
                 value={filterMonth}
                 onChange={(e) => setFilterMonth(e.target.value)}
                 className="et-select"
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

           <div className="et-table-container">
             <table className="et-table">
               <thead>
                 <tr>
                   <th>Category</th>
                   <th>Amount</th>
                   <th>Type</th>
                   <th>Date</th>
                   <th>Payment</th>
                   <th>Notes</th>
                   <th>Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {filteredTransactions.map((t) => (
                   <tr key={t._id}>
                     <td>{t.categoryId?.name || 'Unknown'}</td>
                     <td className={t.type === "Income" ? "et-income" : "et-expense"}>
                       ${t.amount.toFixed(2)}
                     </td>
                     <td>
                       <span className={`et-badge ${t.type === "Income" ? "et-badge-income" : "et-badge-expense"}`}>
                         {t.type}
                       </span>
                     </td>
                     <td>{new Date(t.date).toLocaleDateString()}</td>
                     <td>{t.paymentMethod}</td>
                     <td>{t.notes || '-'}</td>
                     <td>
                       <div className="et-actions">
                         <button onClick={() => handleTransactionEdit(t)} className="et-action-btn">
                           <FaEdit />
                         </button>
                         <button onClick={() => confirmDeleteTransaction(t._id)} className="et-action-btn et-delete">
                           <FaTrash />
                         </button>
                       </div>
                     </td>
                   </tr>
                 ))}
                 {filteredTransactions.length === 0 && (
                   <tr>
                     <td colSpan="7" className="et-empty">No transactions found.</td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
         </div>
       </div>
     </div>

     {/* Add Transaction Type Modal */}
     {showAddModal && (
       <div className="et-modal-overlay" onClick={() => setShowAddModal(false)}>
         <div className="et-modal et-type-modal" onClick={(e) => e.stopPropagation()}>
           <div className="et-modal-header">
             <h2>Select Transaction Type</h2>
             <button onClick={() => setShowAddModal(false)} className="et-close-btn">✕</button>
           </div>
           <div className="et-type-buttons">
             <button
               onClick={() => {
                 setTransactionType("Expense");
                 setShowAddModal(false);
                 setShowTransactionForm(true);
                 setEditTransactionId(null);
               }}
               className="et-type-btn et-type-expense"
             >
               <FaArrowUp className="et-type-icon" />
               <span>Expense</span>
             </button>
             <button
               onClick={() => {
                 setTransactionType("Income");
                 setShowAddModal(false);
                 setShowTransactionForm(true);
                 setEditTransactionId(null);
               }}
               className="et-type-btn et-type-income"
             >
               <FaArrowDown className="et-type-icon" />
               <span>Income</span>
             </button>
           </div>
         </div>
       </div>
     )}

     {/* Transaction Form Modal */}
     {showTransactionForm && (
       <div className="et-modal-overlay" onClick={() => setShowTransactionForm(false)}>
         <div className="et-modal et-modal-small" onClick={(e) => e.stopPropagation()}>
           <div className="et-modal-header">
             <h2>{editTransactionId ? 'Edit' : 'Add'} {transactionType}</h2>
             <button onClick={() => setShowTransactionForm(false)} className="et-close-btn">✕</button>
           </div>
           <form id="transactionForm" className="et-form" onSubmit={handleTransactionSave}>
             <div className="et-form-group">
               <label className="et-label">Amount</label>
               <input
                 name="amount"
                 type="number"
                 step="0.01"
                 placeholder="Enter amount"
                 required
                 className="et-input"
               />
             </div>
            
             <div className="et-form-group">
               <label className="et-label">Category</label>
               <select name="category" required className="et-select">
                 <option value="">Select Category</option>
                 {categories
                   .filter(cat => cat.type === transactionType)
                   .map((cat) => (
                     <option key={cat._id} value={cat._id}>{cat.name}</option>
                   ))}
               </select>
             </div>
            
             <div className="et-form-group">
               <label className="et-label">Payment Method</label>
               <select name="paymentMethod" required className="et-select">
                 <option value="Cash">Cash</option>
                 <option value="Card">Card</option>
                 <option value="UPI">UPI</option>
                 <option value="Other">Other</option>
               </select>
             </div>
            
             <div className="et-form-group">
               <label className="et-label">Date</label>
               <input name="date" type="date" required className="et-input" />
             </div>
            
             <div className="et-form-group">
               <label className="et-label">Notes</label>
               <input name="notes" placeholder="Add notes..." className="et-input" />
             </div>
            
             <div className="et-form-buttons">
               <button type="button" onClick={() => setShowTransactionForm(false)} className="et-btn-secondary">
                 Cancel
               </button>
               <button type="submit" className="et-btn-primary" disabled={loading}>
                 {loading ? 'Saving...' : (editTransactionId ? 'Update' : 'Save')}
               </button>
             </div>
           </form>
         </div>
       </div>
     )}

     {/* Category Form Modal */}
     {showCategoryForm && (
       <div className="et-modal-overlay" onClick={() => setShowCategoryForm(false)}>
         <div className="et-modal et-modal-small" onClick={(e) => e.stopPropagation()}>
           <div className="et-modal-header">
             <h2>{editCategoryId ? "Edit" : "Add"} Category</h2>
             <button onClick={() => setShowCategoryForm(false)} className="et-close-btn">✕</button>
           </div>
           <form className="et-form">
             <div className="et-form-group">
               <label className="et-label">Category Name</label>
               <input
                 type="text"
                 value={newCategory.name}
                 onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                 placeholder="Category Name"
                 className="et-input"
               />
             </div>
            
             <div className="et-form-group">
               <label className="et-label">Type</label>
               <select
                 value={newCategory.type}
                 onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
                 className="et-select"
                 disabled={editCategoryId}
               >
                 <option value="Expense">Expense</option>
                 <option value="Income">Income</option>
               </select>
             </div>
            
             <div className="et-form-group">
               <label className="et-label">Icon</label>
               <div className="et-icon-grid">
                 {ICONS.map(([iconName, IconComponent], idx) => (
                   <div
                     key={idx}
                     className={`et-icon-option ${newCategory.icon === iconName ? "et-icon-selected" : ""}`}
                     onClick={() => setNewCategory({ ...newCategory, icon: iconName })}
                   >
                     <IconComponent />
                   </div>
                 ))}
               </div>
             </div>
            
             <div className="et-form-buttons">
               <button type="button" onClick={() => setShowCategoryForm(false)} className="et-btn-secondary">
                 Cancel
               </button>
               <button type="button" onClick={handleAddCategory} className="et-btn-primary" disabled={loading}>
                 {loading ? 'Saving...' : (editCategoryId ? "Save Changes" : "Add Category")}
               </button>
             </div>
           </form>
         </div>
       </div>
     )}

     {/* Category Details Modal */}
     {showCategoryDetails && (
       <div className="et-modal-overlay" onClick={() => setShowCategoryDetails(false)}>
         <div className="et-modal et-modal-medium" onClick={(e) => e.stopPropagation()}>
           <div className="et-modal-header">
             <h2>All Categories</h2>
             <button onClick={() => setShowCategoryDetails(false)} className="et-close-btn">✕</button>
           </div>
          
           <div className="et-category-details">
             <div className="et-category-section">
               <h3 className="et-section-title">Expense Categories</h3>
               <div className="et-category-details-list">
                 {expenseCategories.map((cat) => {
                   const IconComponent = getIconComponent(cat.icon);
                   const categoryTransactions = transactions.filter(t => t.categoryId?._id === cat._id);
                   const categoryAmount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
                  
                   return (
                     <div key={cat._id} className="et-category-detail-item">
                       <div className="et-category-detail-info">
                         <IconComponent className="et-category-detail-icon" />
                         <span className="et-category-detail-name">{cat.name}</span>
                       </div>
                       <div className="et-category-detail-actions">
                         <span className="et-category-detail-amount">${categoryAmount.toFixed(2)}</span>
                         <button onClick={() => {
                           setShowCategoryDetails(false);
                           handleCategoryEdit(cat);
                         }} className="et-action-btn">
                           <FaEdit />
                         </button>
                       </div>
                     </div>
                   );
                 })}
                 {expenseCategories.length === 0 && (
                   <div className="et-no-data">No expense categories</div>
                 )}
               </div>
             </div>

             <div className="et-category-section">
               <h3 className="et-section-title">Income Categories</h3>
               <div className="et-category-details-list">
                 {incomeCategories.map((cat) => {
                   const IconComponent = getIconComponent(cat.icon);
                   const categoryTransactions = transactions.filter(t => t.categoryId?._id === cat._id);
                   const categoryAmount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
                  
                   return (
                     <div key={cat._id} className="et-category-detail-item">
                       <div className="et-category-detail-info">
                         <IconComponent className="et-category-detail-icon" />
                         <span className="et-category-detail-name">{cat.name}</span>
                       </div>
                       <div className="et-category-detail-actions">
                         <span className="et-category-detail-amount">${categoryAmount.toFixed(2)}</span>
                         <button onClick={() => {
                           setShowCategoryDetails(false);
                           handleCategoryEdit(cat);
                         }} className="et-action-btn">
                           <FaEdit />
                         </button>
                       </div>
                     </div>
                   );
                 })}
                 {incomeCategories.length === 0 && (
                   <div className="et-no-data">No income categories</div>
                 )}
               </div>
             </div>
           </div>
         </div>
       </div>
     )}

     {/* Delete Confirmation Modal */}
     {showDeleteModal && (
       <div className="et-modal-overlay" onClick={() => setShowDeleteModal(false)}>
         <div className="et-confirm-dialog" onClick={(e) => e.stopPropagation()}>
           <h3 className="et-confirm-title">Delete Transaction</h3>
           <p className="et-confirm-message">
             Are you sure you want to delete this transaction? This action cannot be undone.
           </p>
           <div className="et-confirm-buttons">
             <button onClick={() => setShowDeleteModal(false)} className="et-btn-secondary">
               Cancel
             </button>
             <button onClick={handleTransactionDelete} className="et-btn-danger">
               Delete
             </button>
           </div>
         </div>
       </div>
     )}

     {/* Notification */}
     {notification.show && (
       <div className={`et-notification ${notification.type}`}>
         {notification.message}
       </div>
     )}
   </div>
   </>
 );
};

export default ExpenseTracker;

