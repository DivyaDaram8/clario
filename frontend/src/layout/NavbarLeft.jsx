import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaHouse, 
  FaClock, 
  FaListCheck, 
  FaNoteSticky,  
  FaBook, 
  FaList,
  FaWallet,
  FaAlignLeft,
  FaBookOpen,
  FaPuzzlePiece,
  FaBars,
  FaXmark
} from "react-icons/fa6";

export default function NavbarLeft() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { to: "/home", icon: <FaHouse />, label: "Home" },
    { to: "/pomodoro", icon: <FaClock />, label: "Pomodoro" },
    { to: "/habit-tracker", icon: <FaList />, label: "Habit Tracker" },
    { to: "/notes", icon: <FaNoteSticky />, label: "Quick Notes" },
    { to: "/journal", icon: <FaBook />, label: "Journal" },
    { to: "/todo", icon: <FaListCheck />, label: "Todo" },
    { to: "/expense-tracker", icon: <FaWallet />, label: "Expense Tracker" },
    { to: "/summarizer", icon: <FaAlignLeft />, label: "Summarizer" },
    { to: "/books", icon: <FaBookOpen />, label: "Books" },
    { to: "/brain-games", icon: <FaPuzzlePiece />, label: "Brain Games" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger Button - Shows only on mobile */}
      <button
        onClick={toggleMobileMenu}
        className="
          md:hidden fixed top-7 left-4 z-50
          bg-black/50 backdrop-blur-md border border-white/10
          rounded-xl p-3 text-white text-xl
          hover:bg-white/10 transition-all duration-300
        "
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <FaXmark /> : <FaBars />}
      </button>

      {/* Mobile Overlay - Shows only when menu is open */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Sidebar Menu */}
      <div
        className={`
          md:hidden fixed top-0 left-0 h-full z-40
          bg-black/90 backdrop-blur-md border-r border-white/10
          w-64 p-6 pt-20
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <ul className="flex flex-col gap-2">
          {navItems.map((item, idx) => (
            <li key={idx}>
              <Link
                to={item.to}
                onClick={closeMobileMenu}
                className="
                  flex items-center gap-3 p-3 rounded-xl text-white
                  hover:bg-white/10 hover:scale-105
                  transition-all duration-300
                "
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop Sidebar - Shows only on medium screens and above */}
      <div
        className="
          hidden md:flex
          fixed top-1/2 left-4 -translate-y-1/2 z-50
          bg-black/50 backdrop-blur-md border border-white/10
          rounded-2xl p-2
          transition-all duration-300
          group hover:w-52 w-14
        "
      >
        <ul className="flex flex-col gap-2">
          {navItems.map((item, idx) => (
            <li key={idx}>
              <Link
                to={item.to}
                className="
                  flex items-center gap-3 p-3 rounded-xl text-white
                  hover:bg-white/10 hover:scale-110 hover:shadow-lg
                  transition-all duration-300
                "
              >
                <span className="text-lg">{item.icon}</span>
                <span
                  className="
                    whitespace-nowrap overflow-hidden opacity-0
                    group-hover:opacity-100 group-hover:overflow-visible
                    transition-all duration-300 ease-in-out
                  "
                >
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}