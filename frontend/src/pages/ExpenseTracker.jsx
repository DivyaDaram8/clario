
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

     <style>{`
       /* ========== EXPENSE TRACKER - FULLY RESPONSIVE ========== */
      
       .et-navbar-left {
         position: fixed;
         top: 0;
         left: 0;
         height: 100%;
         width: 16rem;
         z-index: 20;
       }

       .et-navbar-top {
         position: fixed;
         top: 0;
         left: 16rem;
         right: 0;
         height: 4rem;
         z-index: 20;
       }

       .et-container {
         min-height: 100vh;
         background: linear-gradient(to bottom right, #000000, #18181b, #171717);
         display: flex;
       }

       .et-main-wrapper {
         flex: 1;
         margin-top: 4rem;
         display: flex;
         justify-content: center;
         align-items: flex-start;
         padding: 2rem 2rem;
         min-height: calc(100vh - 4rem);
       }

       .et-content {
         width: 100%;
         max-width: 1400px;
       }

       /* ========== SCROLLBAR ========== */
       *::-webkit-scrollbar {
         width: 3px;
         height: 3px;
       }

       *::-webkit-scrollbar-track {
         background: transparent;
       }

       *::-webkit-scrollbar-thumb {
         background: rgba(255, 255, 255, 0.2);
         border-radius: 10px;
       }

       *::-webkit-scrollbar-thumb:hover {
         background: rgba(255, 255, 255, 0.3);
       }

       /* ========== HEADER ========== */
       .et-header {
         margin-bottom: 2rem;
       }

       .et-title {
         font-size: 2.5rem;
         font-weight: 800;
         color: #ffffff;
         letter-spacing: 0.05em;
         text-transform: uppercase;
       }

       /* ========== TOP GRID ========== */
       .et-top-grid {
         display: grid;
         grid-template-columns: 280px 1fr 380px;
         gap: 1.5rem;
         margin-bottom: 2rem;
       }

       .et-left-column {
         display: flex;
         flex-direction: column;
         gap: 1rem;
       }

       .et-card {
         background: linear-gradient(to bottom right, #18181b, #000000);
         border: 1px solid rgba(255, 255, 255, 0.1);
         border-radius: 1rem;
         padding: 1.25rem;
         transition: all 0.5s ease;
         box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
         position: relative;
         overflow: hidden;
       }

       .et-card::before {
         content: '';
         position: absolute;
         inset: 0;
         background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.02), transparent);
         border-radius: 1rem;
         opacity: 0;
         transition: opacity 0.7s ease;
       }

       .et-card:hover {
         border-color: rgba(255, 255, 255, 0.2);
         transform: translateY(-2px);
         box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
       }

       .et-card:hover::before {
         opacity: 1;
       }

       .et-card-title {
         font-size: 1rem;
         font-weight: 600;
         color: rgba(255, 255, 255, 0.7);
         margin-bottom: 1rem;
         position: relative;
         z-index: 10;
       }

       .et-card-header {
         display: flex;
         justify-content: space-between;
         align-items: center;
         margin-bottom: 1rem;
         position: relative;
         z-index: 10;
       }

       /* Balance Card */
       .et-balance-card {
         display: flex;
         flex-direction: column;
         justify-content: center;
         align-items: center;
         flex: 1;
       }

       .et-balance-amount {
         font-size: 2rem;
         font-weight: 700;
         margin-bottom: 0.5rem;
         position: relative;
         z-index: 10;
       }

       .et-positive {
         color: #22c55e;
       }

       .et-negative {
         color: #ef4444;
       }

       .et-balance-subtitle {
         font-size: 0.75rem;
         color: rgba(255, 255, 255, 0.6);
         position: relative;
         z-index: 10;
         text-align: center;
       }

       .et-balance-total {
         font-weight: 600;
       }

       /* Add Transaction Card */
       .et-add-card {
         display: flex;
         flex-direction: column;
         justify-content: space-between;
         align-items: center;
         flex: 1;
       }

       .et-quote {
         font-style: italic;
         color: rgba(255, 255, 255, 0.7);
         text-align: center;
         font-size: 0.875rem;
         margin-bottom: 1rem;
         position: relative;
         z-index: 10;
       }

       .et-add-btn {
         padding: 0.75rem 1.5rem;
         background: rgba(255, 255, 255, 0.9);
         color: #000000;
         border: none;
         border-radius: 0.75rem;
         font-weight: 700;
         cursor: pointer;
         transition: all 0.3s ease;
         display: flex;
         align-items: center;
         gap: 0.5rem;
         position: relative;
         z-index: 10;
         font-size: 0.875rem;
       }

       .et-add-btn:hover {
         background: #ffffff;
         transform: scale(1.05);
         box-shadow: 0 8px 32px rgba(255, 255, 255, 0.2);
       }

       /* Chart Card */
       .et-chart-card {
         height: 320px;
         display: flex;
         flex-direction: column;
         position: relative;
       }

       .et-chart-header {
         display: flex;
         justify-content: space-between;
         align-items: center;
         margin-bottom: 1rem;
         position: relative;
         z-index: 10;
       }

       .et-chart-controls {
         display: flex;
         gap: 0.5rem;
         background: rgba(255, 255, 255, 0.05);
         border-radius: 0.5rem;
         padding: 0.25rem;
       }

       .et-chart-tab {
         padding: 0.5rem 1rem;
         background: transparent;
         border: none;
         border-radius: 0.375rem;
         color: rgba(255, 255, 255, 0.6);
         font-size: 0.75rem;
         font-weight: 600;
         cursor: pointer;
         transition: all 0.3s ease;
       }

       .et-chart-tab:hover {
         color: rgba(255, 255, 255, 0.9);
       }

       .et-chart-tab-active {
         background: rgba(255, 255, 255, 0.1);
         color: #ffffff;
       }

       .et-no-data {
         display: flex;
         align-items: center;
         justify-content: center;
         height: 100%;
         color: rgba(255, 255, 255, 0.5);
         font-size: 0.875rem;
         position: relative;
         z-index: 10;
       }

       /* Categories Card */
       .et-categories-card {
         height: 320px;
         display: flex;
         flex-direction: column;
       }

       .et-icon-btn {
         padding: 0.5rem;
         background: rgba(255, 255, 255, 0.05);
         border: 1px solid rgba(255, 255, 255, 0.1);
         border-radius: 0.5rem;
         color: #ffffff;
         cursor: pointer;
         transition: all 0.3s ease;
         display: flex;
         align-items: center;
         justify-content: center;
       }

       .et-icon-btn:hover {
         background: rgba(255, 255, 255, 0.1);
         transform: scale(1.1);
       }

       .et-categories-grid {
         display: grid;
         grid-template-columns: 1fr auto 1fr;
         gap: 1rem;
         flex: 1;
         position: relative;
         z-index: 10;
         overflow: hidden;
       }

       .et-categories-section {
         display: flex;
         flex-direction: column;
       }

       .et-category-type-label {
         font-size: 0.75rem;
         font-weight: 600;
         color: rgba(255, 255, 255, 0.5);
         text-transform: uppercase;
         letter-spacing: 0.05em;
         margin-bottom: 0.75rem;
       }

       .et-categories-list {
         display: flex;
         flex-direction: column;
         gap: 0.5rem;
       }

       .et-category-item {
         display: flex;
         align-items: center;
         gap: 0.75rem;
         padding: 0.5rem;
         background: rgba(255, 255, 255, 0.03);
         border-radius: 0.5rem;
         transition: all 0.3s ease;
       }

       .et-category-item:hover {
         background: rgba(255, 255, 255, 0.05);
       }

       .et-category-icon {
         color: rgba(255, 255, 255, 0.7);
         font-size: 1rem;
       }

       .et-category-name {
         color: rgba(255, 255, 255, 0.8);
         font-size: 0.875rem;
         font-weight: 500;
       }

       .et-categories-divider {
         width: 1px;
         background: rgba(255, 255, 255, 0.1);
       }

       .et-no-categories {
         color: rgba(255, 255, 255, 0.4);
         font-size: 0.75rem;
         text-align: center;
         padding: 1rem 0;
       }

       .et-view-more-btn {
         width: 100%;
         padding: 0.75rem;
         background: rgba(255, 255, 255, 0.05);
         border: 1px solid rgba(255, 255, 255, 0.1);
         border-radius: 0.75rem;
         color: rgba(255, 255, 255, 0.9);
         font-weight: 600;
         cursor: pointer;
         transition: all 0.3s ease;
         margin-top: 1rem;
         display: flex;
         align-items: center;
         justify-content: center;
         gap: 0.5rem;
         position: relative;
         z-index: 10;
         font-size: 0.875rem;
       }

       .et-view-more-btn:hover {
         background: rgba(255, 255, 255, 0.1);
         border-color: rgba(255, 255, 255, 0.2);
         transform: scale(1.02);
       }

       /* ========== HISTORY CARD ========== */
       .et-history-card {
         height: auto;
         min-height: 500px;
       }

       /* Filters */
       .et-filters {
         display: grid;
         grid-template-columns: repeat(3, 1fr);
         gap: 1rem;
         margin-bottom: 1.5rem;
         position: relative;
         z-index: 10;
       }

       .et-filter-group {
         display: flex;
         flex-direction: column;
         gap: 0.5rem;
       }

       .et-filter-label {
         font-size: 0.75rem;
         font-weight: 600;
         color: rgba(255, 255, 255, 0.7);
       }

       .et-select {
         padding: 0.75rem 1rem;
         background: rgba(255, 255, 255, 0.05);
         border: 1px solid rgba(255, 255, 255, 0.1);
         border-radius: 0.75rem;
         color: #ffffff;
         font-size: 0.875rem;
         transition: all 0.3s ease;
         cursor: pointer;
       }

       .et-select:focus {
         outline: none;
         background: rgba(255, 255, 255, 0.08);
         border-color: rgba(255, 255, 255, 0.3);
       }

       .et-select option {
         background: #18181b;
         color: #ffffff;
       }

       /* Table */
       .et-table-container {
         overflow-x: auto;
         position: relative;
         z-index: 10;
       }

       .et-table {
         width: 100%;
         border-collapse: collapse;
       }

       .et-table thead tr {
         border-bottom: 1px solid rgba(255, 255, 255, 0.1);
       }

       .et-table th {
         text-align: left;
         padding: 1rem;
         font-size: 0.875rem;
         font-weight: 600;
         color: rgba(255, 255, 255, 0.7);
         white-space: nowrap;
       }

       .et-table td {
         padding: 1rem;
         font-size: 0.875rem;
         color: rgba(255, 255, 255, 0.8);
         border-bottom: 1px solid rgba(255, 255, 255, 0.05);
       }

       .et-table tbody tr {
         transition: all 0.3s ease;
       }

       .et-table tbody tr:hover {
         background: rgba(255, 255, 255, 0.03);
       }

       .et-income {
         color: #22c55e;
         font-weight: 600;
       }

       .et-expense {
         color: #ef4444;
         font-weight: 600;
       }

       .et-badge {
         padding: 0.25rem 0.75rem;
         border-radius: 1rem;
         font-size: 0.75rem;
         font-weight: 600;
         white-space: nowrap;
       }

       .et-badge-income {
         background: rgba(34, 197, 94, 0.2);
         color: #22c55e;
       }

       .et-badge-expense {
         background: rgba(239, 68, 68, 0.2);
         color: #ef4444;
       }

       .et-actions {
         display: flex;
         gap: 0.5rem;
         justify-content: center;
       }

       .et-action-btn {
         padding: 0.5rem;
         background: rgba(255, 255, 255, 0.05);
         border: 1px solid rgba(255, 255, 255, 0.1);
         border-radius: 0.5rem;
         color: rgba(255, 255, 255, 0.7);
         cursor: pointer;
         transition: all 0.3s ease;
         display: flex;
         align-items: center;
         justify-content: center;
       }

       .et-action-btn:hover {
         background: rgba(255, 255, 255, 0.1);
         color: #ffffff;
         transform: scale(1.1);
       }

       .et-action-btn.et-delete:hover {
         background: rgba(239, 68, 68, 0.2);
         border-color: rgba(239, 68, 68, 0.5);
         color: #ef4444;
       }

       .et-empty {
         text-align: center;
         color: rgba(255, 255, 255, 0.5);
         padding: 2rem;
       }

       /* ========== MODALS ========== */
       .et-modal-overlay {
         position: fixed;
         inset: 0;
         background: rgba(0, 0, 0, 0.85);
         backdrop-filter: blur(8px);
         display: flex;
         align-items: center;
         justify-content: center;
         z-index: 1000;
         padding: 2rem;
         animation: fadeIn 0.3s ease;
       }

       @keyframes fadeIn {
         from { opacity: 0; }
         to { opacity: 1; }
       }

       .et-modal {
         background: linear-gradient(to bottom right, #18181b, #000000);
         border: 1px solid rgba(255, 255, 255, 0.2);
         border-radius: 1.5rem;
         padding: 2rem;
         width: 100%;
         max-height: 90vh;
         overflow-y: auto;
         box-shadow: 0 25px 80px rgba(0, 0, 0, 0.9);
         position: relative;
         animation: scaleIn 0.3s ease;
       }

       .et-modal-small {
         max-width: 450px;
       }

       .et-modal-medium {
         max-width: 600px;
       }

       .et-type-modal {
         max-width: 400px;
       }

       @keyframes scaleIn {
         from {
           transform: scale(0.9);
           opacity: 0;
         }
         to {
           transform: scale(1);
           opacity: 1;
         }
       }

       .et-modal::before {
         content: '';
         position: absolute;
         inset: 0;
         background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.05), transparent);
         border-radius: 1.5rem;
         pointer-events: none;
       }

       .et-modal-header {
         display: flex;
         justify-content: space-between;
         align-items: center;
         margin-bottom: 1.5rem;
         position: relative;
         z-index: 10;
       }

       .et-modal-header h2 {
         font-size: 1.5rem;
         font-weight: 700;
         color: #ffffff;
       }

       .et-close-btn {
         padding: 0.5rem 0.75rem;
         background: rgba(255, 255, 255, 0.05);
         border: 1px solid rgba(255, 255, 255, 0.1);
         border-radius: 0.75rem;
         color: #ffffff;
         font-size: 1.5rem;
         cursor: pointer;
         transition: all 0.3s ease;
         line-height: 1;
       }

       .et-close-btn:hover {
         background: rgba(239, 68, 68, 0.2);
         border-color: rgba(239, 68, 68, 0.5);
         transform: scale(1.1);
       }

       /* Type Selection Modal */
       .et-type-buttons {
         display: grid;
         grid-template-columns: repeat(2, 1fr);
         gap: 1rem;
         position: relative;
         z-index: 10;
       }

       .et-type-btn {
         padding: 2rem 1rem;
         border: 1px solid rgba(255, 255, 255, 0.1);
         border-radius: 1rem;
         cursor: pointer;
         transition: all 0.3s ease;
         display: flex;
         flex-direction: column;
         align-items: center;
         gap: 1rem;
         font-size: 1.125rem;
         font-weight: 600;
       }

       .et-type-expense {
         background: rgba(239, 68, 68, 0.1);
         color: #ef4444;
       }

       .et-type-expense:hover {
         background: rgba(239, 68, 68, 0.2);
         border-color: rgba(239, 68, 68, 0.5);
         transform: scale(1.05);
       }

       .et-type-income {
         background: rgba(34, 197, 94, 0.1);
         color: #22c55e;
       }

       .et-type-income:hover {
         background: rgba(34, 197, 94, 0.2);
         border-color: rgba(34, 197, 94, 0.5);
         transform: scale(1.05);
       }

       .et-type-icon {
         font-size: 2rem;
       }

       /* Form */
       .et-form {
         display: flex;
         flex-direction: column;
         gap: 1rem;
         position: relative;
         z-index: 10;
       }

       .et-form-group {
         display: flex;
         flex-direction: column;
         gap: 0.5rem;
       }

       .et-label {
         font-size: 0.875rem;
         font-weight: 600;
         color: rgba(255, 255, 255, 0.7);
       }

       .et-input {
         padding: 0.75rem 1rem;
         background: rgba(255, 255, 255, 0.05);
         border: 1px solid rgba(255, 255, 255, 0.1);
         border-radius: 0.75rem;
         color: #ffffff;
         font-size: 0.875rem;
         transition: all 0.3s ease;
       }

       .et-input::placeholder {
         color: rgba(255, 255, 255, 0.4);
       }

       .et-input:focus {
         outline: none;
         background: rgba(255, 255, 255, 0.08);
         border-color: rgba(255, 255, 255, 0.3);
       }

       .et-icon-grid {
         display: grid;
         grid-template-columns: repeat(6, 1fr);
         gap: 0.5rem;
         max-height: 180px;
         overflow-y: auto;
       }

       .et-icon-option {
         padding: 0.75rem;
         background: rgba(255, 255, 255, 0.05);
         border: 2px solid transparent;
         border-radius: 0.75rem;
         cursor: pointer;
         transition: all 0.3s ease;
         display: flex;
         align-items: center;
         justify-content: center;
         color: rgba(255, 255, 255, 0.7);
         font-size: 1.25rem;
       }

       .et-icon-option:hover {
         background: rgba(255, 255, 255, 0.1);
         color: #ffffff;
       }

       .et-icon-selected {
         background: rgba(255, 255, 255, 0.1);
         border-color: rgba(255, 255, 255, 0.3);
         color: #ffffff;
       }

       .et-form-buttons {
         display: flex;
         gap: 1rem;
         justify-content: flex-end;
         margin-top: 0.5rem;
       }

       .et-btn-primary {
         padding: 0.75rem 1.5rem;
         background: rgba(255, 255, 255, 0.9);
         color: #000000;
         border: none;
         border-radius: 0.75rem;
         font-weight: 700;
         cursor: pointer;
         transition: all 0.3s ease;
       }

       .et-btn-primary:hover {
         background: #ffffff;
         transform: scale(1.05);
         box-shadow: 0 8px 32px rgba(255, 255, 255, 0.2);
       }

       .et-btn-primary:disabled {
         opacity: 0.5;
         cursor: not-allowed;
       }

       .et-btn-secondary {
         padding: 0.75rem 1.5rem;
         background: rgba(255, 255, 255, 0.05);
         border: 1px solid rgba(255, 255, 255, 0.1);
         border-radius: 0.75rem;
         color: rgba(255, 255, 255, 0.9);
         font-weight: 600;
         cursor: pointer;
         transition: all 0.3s ease;
       }

       .et-btn-secondary:hover {
         background: rgba(255, 255, 255, 0.1);
         border-color: rgba(255, 255, 255, 0.2);
         transform: scale(1.05);
       }

       .et-btn-danger {
         padding: 0.75rem 1.5rem;
         background: rgba(239, 68, 68, 0.9);
         color: #ffffff;
         border: none;
         border-radius: 0.75rem;
         font-weight: 700;
         cursor: pointer;
         transition: all 0.3s ease;
       }

       .et-btn-danger:hover {
         background: #ef4444;
         transform: scale(1.05);
         box-shadow: 0 8px 32px rgba(239, 68, 68, 0.3);
       }

       /* Category Details */
       .et-category-details {
         position: relative;
         z-index: 10;
       }

       .et-category-section {
         margin-bottom: 1.5rem;
       }

       .et-section-title {
         font-size: 1.125rem;
         font-weight: 700;
         color: #ffffff;
         margin-bottom: 1rem;
       }

       .et-category-details-list {
         display: flex;
         flex-direction: column;
         gap: 0.75rem;
       }

       .et-category-detail-item {
         display: flex;
         justify-content: space-between;
         align-items: center;
         padding: 1rem;
         background: rgba(255, 255, 255, 0.05);
         border: 1px solid rgba(255, 255, 255, 0.1);
         border-radius: 0.75rem;
         transition: all 0.3s ease;
       }

       .et-category-detail-item:hover {
         background: rgba(255, 255, 255, 0.08);
         border-color: rgba(255, 255, 255, 0.2);
       }

       .et-category-detail-info {
         display: flex;
         align-items: center;
         gap: 1rem;
       }

       .et-category-detail-icon {
         font-size: 1.5rem;
         color: rgba(255, 255, 255, 0.7);
       }

       .et-category-detail-name {
         font-size: 1rem;
         font-weight: 600;
         color: #ffffff;
       }

       .et-category-detail-actions {
         display: flex;
         align-items: center;
         gap: 1rem;
       }

       .et-category-detail-amount {
         font-size: 1.125rem;
         font-weight: 700;
         color: #ffffff;
       }

       /* Confirmation Dialog */
       .et-confirm-dialog {
         background: linear-gradient(to bottom right, #18181b, #000000);
         border: 1px solid rgba(255, 255, 255, 0.2);
         border-radius: 1.5rem;
         padding: 2rem;
         max-width: 400px;
         width: 100%;
         box-shadow: 0 25px 80px rgba(0, 0, 0, 0.9);
         animation: scaleIn 0.3s ease;
       }

       .et-confirm-title {
         font-size: 1.25rem;
         font-weight: 700;
         color: #ffffff;
         margin-bottom: 1rem;
       }

       .et-confirm-message {
         font-size: 0.875rem;
         color: rgba(255, 255, 255, 0.8);
         margin-bottom: 1.5rem;
         line-height: 1.6;
       }

       .et-confirm-buttons {
         display: flex;
         gap: 1rem;
         justify-content: flex-end;
       }

       /* Notification */
       .et-notification {
         position: fixed;
         bottom: 2rem;
         right: 2rem;
         padding: 1rem 1.5rem;
         border-radius: 1rem;
         font-weight: 600;
         z-index: 2000;
         animation: slideIn 0.3s ease;
         box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
       }

       @keyframes slideIn {
         from {
           transform: translateX(100%);
           opacity: 0;
         }
         to {
           transform: translateX(0);
           opacity: 1;
         }
       }

       .et-notification.success {
         background: rgba(34, 197, 94, 0.2);
         border: 1px solid rgba(34, 197, 94, 0.5);
         color: #ffffff;
       }

       .et-notification.error {
         background: rgba(239, 68, 68, 0.2);
         border: 1px solid rgba(239, 68, 68, 0.5);
         color: #ffffff;
       }

       /* ========== RESPONSIVE DESIGN ========== */
      
       /* Large Desktops */
       @media (min-width: 1920px) {
         .et-content {
           max-width: 1600px;
         }
        
         .et-title {
           font-size: 3rem;
         }

         .et-top-grid {
           grid-template-columns: 320px 1fr 420px;
           gap: 2rem;
         }
       }

       /* Desktop */
       @media (max-width: 1600px) {
         .et-content {
           max-width: 1200px;
         }
       }

       @media (max-width: 1400px) {
         .et-main-wrapper {
           padding: 2rem 1.5rem;
         }

         .et-top-grid {
           grid-template-columns: 1fr;
           gap: 1.5rem;
         }

         .et-left-column {
           flex-direction: row;
           gap: 1.5rem;
         }

         .et-balance-card,
         .et-add-card {
           flex: 1;
         }

         .et-chart-card,
         .et-categories-card {
           height: 380px;
         }
       }

       /* Tablet */
       @media (max-width: 1024px) {
         .et-navbar-left {
           width: 0;
           display: none;
         }

         .et-navbar-top {
           left: 0;
         }

         .et-main-wrapper {
           margin-left: 0;
           padding: 2rem 1.5rem;
         }

         .et-title {
           font-size: 2rem;
         }

         .et-top-grid {
           gap: 1.25rem;
         }

         .et-filters {
           gap: 0.75rem;
         }
       }

       /* Mobile Landscape & Small Tablets */
       @media (max-width: 768px) {
         .et-main-wrapper {
           padding: 1.5rem 1rem;
         }

         .et-title {
           font-size: 1.75rem;
         }

         .et-left-column {
           flex-direction: column;
           gap: 1rem;
         }

         .et-top-grid {
           gap: 1rem;
         }

         .et-chart-card,
         .et-categories-card {
           height: 300px;
         }

         .et-filters {
           grid-template-columns: 1fr;
           gap: 0.75rem;
         }

         .et-table-container {
           overflow-x: auto;
           -webkit-overflow-scrolling: touch;
         }

         .et-table th,
         .et-table td {
           padding: 0.75rem;
           font-size: 0.8rem;
         }

         .et-categories-grid {
           grid-template-columns: 1fr;
           gap: 1rem;
         }

         .et-categories-divider {
           width: 100%;
           height: 1px;
         }

         .et-modal {
           padding: 1.5rem;
           margin: 1rem;
         }

         .et-modal-header h2 {
           font-size: 1.25rem;
         }

         .et-type-buttons {
           gap: 0.75rem;
         }

         .et-type-btn {
           padding: 1.5rem 1rem;
         }
       }

       /* Mobile Portrait */
       @media (max-width: 480px) {
         .et-main-wrapper {
           padding: 1rem 0.75rem;
         }

         .et-title {
           font-size: 1.5rem;
         }

         .et-balance-amount {
           font-size: 1.75rem;
         }

         .et-chart-card,
         .et-categories-card {
           height: 280px;
         }

         .et-card {
           padding: 1rem;
         }

         .et-table th,
         .et-table td {
           padding: 0.5rem;
           font-size: 0.75rem;
         }

         .et-badge {
           padding: 0.2rem 0.5rem;
           font-size: 0.7rem;
         }

         .et-action-btn {
           padding: 0.4rem;
         }

         .et-type-buttons {
           grid-template-columns: 1fr;
         }

         .et-modal {
           padding: 1rem;
           margin: 0.5rem;
         }

         .et-form-buttons {
           flex-direction: column;
         }

         .et-btn-primary,
         .et-btn-secondary,
         .et-btn-danger {
           width: 100%;
         }

         .et-notification {
           left: 1rem;
           right: 1rem;
           bottom: 1rem;
         }

         .et-icon-grid {
           grid-template-columns: repeat(4, 1fr);
         }
       }

       /* Extra Small Mobile */
       @media (max-width: 360px) {
         .et-title {
           font-size: 1.25rem;
         }

         .et-balance-amount {
           font-size: 1.5rem;
         }

         .et-chart-card,
         .et-categories-card {
           height: 250px;
         }

         .et-icon-grid {
           grid-template-columns: repeat(3, 1fr);
         }
       }
     `}</style>
   </>
 );
};

export default ExpenseTracker;

