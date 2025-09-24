import React from "react";
import { FaHome, FaUtensils, FaCar, FaShoppingBag, FaFilm, FaPlus } from "react-icons/fa";
import NavbarLeft from "../layout/NavbarLeft";
import NavbarTop from "../layout/NavbarTop";

const ExpenseTracker = () => {
  const categories = [
    { name: "Rent", icon: FaHome, amount: 1200, color: "text-blue-600" },
    { name: "Food", icon: FaUtensils, amount: 450, color: "text-green-600" },
    { name: "Transport", icon: FaCar, amount: 180, color: "text-yellow-600" },
    { name: "Shopping", icon: FaShoppingBag, amount: 320, color: "text-purple-600" },
    { name: "Entertainment", icon: FaFilm, amount: 150, color: "text-red-600" },
  ];

  const transactions = [
    { id: 1, category: "Food", amount: -25.5, type: "Expense", date: "2024-09-20", notes: "Lunch at cafe" },
    { id: 2, category: "Salary", amount: 3200.0, type: "Income", date: "2024-09-19", notes: "Monthly salary" },
    { id: 3, category: "Transport", amount: -15.0, type: "Expense", date: "2024-09-18", notes: "Bus fare" },
    { id: 4, category: "Entertainment", amount: -45.0, type: "Expense", date: "2024-09-17", notes: "Movie tickets" },
    { id: 5, category: "Food", amount: -78.3, type: "Expense", date: "2024-09-16", notes: "Groceries" },
    { id: 6, category: "Freelance", amount: 500.0, type: "Income", date: "2024-09-15", notes: "Web design project" },
    { id: 7, category: "Shopping", amount: -120.0, type: "Expense", date: "2024-09-14", notes: "Clothing" },
    { id: 8, category: "Transport", amount: -25.0, type: "Expense", date: "2024-09-13", notes: "Taxi fare" },
  ];

  const totalBalance = 2850.75;
  const moneyQuote = "A penny saved is a penny earned.";

  return (
    <div className="bg-gray-50 min-h-screen overflow-hidden">
      {/* Fixed Navbars */}
      <div className="fixed top-0 left-0 h-full w-64 z-20">
        <NavbarLeft />
      </div>
      <div className="fixed top-0 left-64 right-0 h-16 z-20">
        <NavbarTop />
      </div>

      {/* Main Board */}
      <div className="ml-64 mt-16 p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
            Expense Tracker
          </h1>

          {/* Top Section - 3 Elevated Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Balance */}
            <div className="bg-gray-50 rounded-xl shadow-md p-5 flex flex-col justify-center items-center hover:shadow-lg transition">
              <h2 className="text-lg md:text-xl font-semibold text-gray-600 mb-2">Total Balance</h2>
              <p className="text-3xl md:text-4xl font-bold text-green-600">
                ${totalBalance.toLocaleString()}
              </p>
            </div>

            {/* Quote + Button */}
            <div className="bg-gray-50 rounded-xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition">
              <p className="text-gray-600 italic text-base md:text-lg text-center mb-4">
                "{moneyQuote}"
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-lg flex items-center justify-center space-x-2 text-base md:text-lg">
                <FaPlus className="text-sm md:text-base" />
                <span>Add Transaction</span>
              </button>
            </div>

            {/* Categories */}
            <div className="bg-gray-50 rounded-xl shadow-md p-5 hover:shadow-lg transition">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                Spending by Category
              </h2>
              <div className="space-y-3">
                {categories.map((cat, index) => {
                  const Icon = cat.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between text-base md:text-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`text-lg md:text-xl ${cat.color}`} />
                        <span className="text-gray-700 font-medium">{cat.name}</span>
                      </div>
                      <span className="text-gray-800 font-semibold">${cat.amount}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-gray-50 rounded-xl shadow-md p-5 hover:shadow-lg transition h-[450px] overflow-y-auto">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
              Transaction History
            </h2>
            <table className="w-full min-w-full text-base md:text-lg">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Notes</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-100 transition">
                    <td className="py-2 px-3">{t.category}</td>
                    <td
                      className={`py-2 px-3 font-semibold ${
                        t.amount > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      ${Math.abs(t.amount).toFixed(2)}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
                          t.type === "Income"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-gray-600">{t.date}</td>
                    <td className="py-2 px-3 text-gray-600">{t.notes}</td>
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
