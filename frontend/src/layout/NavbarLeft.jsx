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
  FaBookOpen
} from "react-icons/fa6";

export default function NavbarLeft() {
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
  ];

  return (
    <div
      className="
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
  );
}


// import { Link } from "react-router-dom";
// import { 
//   FaHouse, 
//   FaClock, 
//   FaListCheck, 
//   FaNoteSticky, 
//   FaCalendarDays, 
//   FaBook, 
//   FaList 
// } from "react-icons/fa6";

// export default function NavbarLeft() {
//   const navItems = [
//     { to: "/", icon: <FaHouse />, label: "Home" },
//     { to: "/pomodoro", icon: <FaClock />, label: "Pomodoro" },
//     { to: "/habit-tracker", icon: <FaList />, label: "Habit Tracker" },
//     { to: "/notes", icon: <FaNoteSticky />, label: "Quick Notes" },
//     { to: "/calendar", icon: <FaCalendarDays />, label: "Calendar" },
//     { to: "/journal", icon: <FaBook />, label: "Journal" },
//     { to: "/todo", icon: <FaListCheck />, label: "Todo" },
//   ];

//   return (
//     <div
//       className="
//         fixed top-1/2 left-0 -translate-y-1/2 z-50
//         bg-black/50 backdrop-blur-md border border-white/10
//         rounded-r-2xl overflow-hidden
//         w-14 group
//         transition-all duration-300 ease-in-out
//         hover:w-52
//       "
//     >
//       <ul className="flex flex-col gap-2">
//         {navItems.map((item, idx) => (
//           <li key={idx}>
//             <Link
//               to={item.to}
//               className="
//                 flex items-center gap-3 p-3 rounded-r-xl text-white
//                 hover:bg-white/10 hover:scale-110 hover:shadow-lg
//                 transition-all duration-300
//               "
//             >
//               <span className="text-lg">{item.icon}</span>
//               <span
//                 className="
//                   whitespace-nowrap opacity-0
//                   translate-x-[-10px]
//                   group-hover:opacity-100 group-hover:translate-x-0
//                   transition-all duration-300 ease-in-out
//                 "
//               >
//                 {item.label}
//               </span>
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
