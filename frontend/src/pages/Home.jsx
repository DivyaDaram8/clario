import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaHouse,
  FaClock,
  FaListCheck,
  FaNoteSticky,
  FaBook,
  FaList,
  FaWallet,
  FaPuzzlePiece,
  FaBookOpen,
} from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import NavbarLeft from "../layout/NavbarLeft";
import NavbarTop from "../layout/NavbarTop";

// ========== MYSTERY CARD DATA (3 MONTHS PRE-FILLED) ==========
const MYSTERY_CATEGORIES = {
  0: { name: "Tech Puzzle", bg: "from-zinc-950 to-black" },
  1: { name: "Mindfulness", bg: "from-zinc-950 to-black" },
  2: { name: "AI Spotlight", bg: "from-zinc-950 to-black" },
  3: { name: "Hack Tip", bg: "from-zinc-950 to-black" },
  4: { name: "Tech Fact", bg: "from-zinc-950 to-black" },
  5: { name: "Productivity", bg: "from-zinc-950 to-black" },
  6: { name: "Fun Puzzle", bg: "from-zinc-950 to-black" },
};

const MYSTERY_CONTENT = [
  // Week 1
  {
    day: 0,
    cat: 0,
    title: "Logic Gate Challenge",
    content:
      "What does XOR gate output when both inputs are 1? Answer: 0 (XOR outputs 1 only when inputs differ)",
  },
  {
    day: 1,
    cat: 1,
    title: "Breath Awareness",
    content:
      "Take 3 deep breaths. Inhale for 4 counts, hold for 4, exhale for 6. Reset your mind.",
  },
  {
    day: 2,
    cat: 2,
    title: "Transformer Models",
    content:
      "GPT models use attention mechanisms to weigh the importance of different words in context.",
  },
  {
    day: 3,
    cat: 3,
    title: "Terminal Shortcut",
    content:
      "Use Ctrl+R to search your command history. Type keywords to find previous commands instantly.",
  },
  {
    day: 4,
    cat: 4,
    title: "Moore's Law",
    content:
      "The number of transistors on microchips doubles approximately every two years since 1965.",
  },
  {
    day: 5,
    cat: 5,
    title: "Time Blocking",
    content:
      "Schedule specific blocks for deep work. Protect these like important meetings.",
  },
  {
    day: 6,
    cat: 6,
    title: "Number Sequence",
    content:
      "What comes next? 1, 1, 2, 3, 5, 8, 13... Answer: 21 (Fibonacci sequence)",
  },
  // Week 2
  {
    day: 7,
    cat: 0,
    title: "Binary Math",
    content: "In binary, what is 1010 + 0110? Answer: 10000 (16 in decimal)",
  },
  {
    day: 8,
    cat: 1,
    title: "Posture Check",
    content:
      "Sit up straight. Roll your shoulders back. Relax your jaw. Feel the difference.",
  },
  {
    day: 9,
    cat: 2,
    title: "Neural Networks",
    content:
      "Deep learning models learn by adjusting millions of weighted connections between artificial neurons.",
  },
  {
    day: 10,
    cat: 3,
    title: "Git Alias Power",
    content:
      "Create aliases: git config --global alias.co checkout. Now use 'git co' instead.",
  },
  {
    day: 11,
    cat: 4,
    title: "First Computer Bug",
    content:
      "The first 'computer bug' was an actual moth found in Harvard's Mark II computer in 1947.",
  },
  {
    day: 12,
    cat: 5,
    title: "Two-Minute Rule",
    content:
      "If a task takes less than 2 minutes, do it immediately. Don't add it to your list.",
  },
  {
    day: 13,
    cat: 6,
    title: "Riddle Time",
    content:
      "I speak without a mouth and hear without ears. What am I? Answer: An echo",
  },
  // Week 3
  {
    day: 14,
    cat: 0,
    title: "Algorithm Complexity",
    content:
      "What's faster for searching: O(log n) or O(n)? Answer: O(log n) - logarithmic beats linear",
  },
  {
    day: 15,
    cat: 1,
    title: "Digital Detox",
    content:
      "Put your phone in another room for 30 minutes. Notice how your mind settles.",
  },
  {
    day: 16,
    cat: 2,
    title: "Reinforcement Learning",
    content:
      "AI learns by trial and error, receiving rewards for good actions - like training a virtual pet.",
  },
  {
    day: 17,
    cat: 3,
    title: "VSCode Zen Mode",
    content:
      "Press Ctrl+K Z (Cmd+K Z on Mac) for distraction-free coding. Focus purely on your code.",
  },
  {
    day: 18,
    cat: 4,
    title: "Internet Speed",
    content:
      "The internet can transfer data at up to 1 petabit per second through fiber optic cables.",
  },
  {
    day: 19,
    cat: 5,
    title: "Eat the Frog",
    content:
      "Tackle your hardest task first thing in the morning when your willpower is strongest.",
  },
  {
    day: 20,
    cat: 6,
    title: "Cipher Challenge",
    content:
      "Decode: KHOOR ZRUOG. Answer: HELLO WORLD (Caesar cipher, shift 3)",
  },
  // Week 4
  {
    day: 21,
    cat: 0,
    title: "Recursion Puzzle",
    content:
      "A function calls itself. What's the base case needed? Answer: A condition to stop recursion",
  },
  {
    day: 22,
    cat: 1,
    title: "Gratitude Moment",
    content:
      "List 3 things you're grateful for today. Studies show this boosts mood by 25%.",
  },
  {
    day: 23,
    cat: 2,
    title: "Computer Vision",
    content:
      "CNNs detect patterns in images by learning filters - edges, textures, then complex objects.",
  },
  {
    day: 24,
    cat: 3,
    title: "SSH Jump Hosts",
    content:
      "Use ProxyJump in SSH config to bounce through bastion hosts securely: ssh -J jump.host destination",
  },
  {
    day: 25,
    cat: 4,
    title: "First Email",
    content:
      "Ray Tomlinson sent the first email in 1971. He chose the @ symbol to separate username from host.",
  },
  {
    day: 26,
    cat: 5,
    title: "Pomodoro Power",
    content:
      "Work 25 min, break 5 min. After 4 cycles, take 15-30 min break. Maintains peak focus.",
  },
  {
    day: 27,
    cat: 6,
    title: "Logic Puzzle",
    content:
      "If 5 machines make 5 widgets in 5 minutes, how long for 100 machines to make 100 widgets? Answer: 5 min",
  },
  // Continue for 3 months (90 days)
  ...Array.from({ length: 63 }, (_, i) => ({
    day: 28 + i,
    cat: (28 + i) % 7,
    title: `Mystery ${28 + i + 1}`,
    content: `Discover something amazing today! This is day ${28 + i + 1} of your journey.`,
  })),
];

// // ========== SIDEBAR NAV ==========
// function NavbarLeft() {
//   const navItems = [
//     { to: "/home", icon: <FaHouse />, label: "Home" },
//     { to: "/pomodoro", icon: <FaClock />, label: "Pomodoro" },
//     { to: "/habit-tracker", icon: <FaList />, label: "Habit Tracker" },
//     { to: "/notes", icon: <FaNoteSticky />, label: "Quick Notes" },
//     { to: "/journal", icon: <FaBook />, label: "Journal" },
//     { to: "/todo", icon: <FaListCheck />, label: "Todo" },
//     { to: "/expense-tracker", icon: <FaWallet />, label: "Expense Tracker" },
//     { to: "/brain-games", icon: <FaPuzzlePiece />, label: "Brain Games" },
//     { to: "/books", icon: <FaBookOpen />, label: "Books" },
//   ];
//   return (
//     <div className="fixed top-1/2 left-5 -translate-y-1/2 z-50 bg-black/90 rounded-2xl p-2 border border-white/20 group hover:w-52 w-16 transition-all duration-300 shadow-2xl backdrop-blur-xl">
//       <ul className="flex flex-col gap-2">
//         {navItems.map((item, idx) => (
//           <li key={idx}>
//             <Link
//               to={item.to}
//               className="flex items-center gap-3 p-3 rounded-xl text-white/90 hover:bg-white/10 hover:scale-110 hover:shadow-xl transition-all duration-300"
//             >
//               <span className="text-xl">{item.icon}</span>
//               <span className="whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300 font-medium text-base">
//                 {item.label}
//               </span>
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// // ========== TOP NAVBAR ==========
// function NavbarTop() {
//   const [isPlaying, setIsPlaying] = useState(false);
//   return (
//     <div className="fixed top-7 left-1/2 -translate-x-1/2 z-50 w-fit">
//       <div className="flex items-center justify-between gap-8 px-6 py-3 rounded-full shadow-2xl bg-black/95 border border-white/20 transition-all duration-300 hover:scale-105 backdrop-blur-xl">
//         <div className="font-bold text-2xl text-white tracking-wider uppercase">
//           CLARIO
//         </div>
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => setIsPlaying(!isPlaying)}
//             className="text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all"
//           >
//             {isPlaying ? (
//               <svg className="w-4 h-4" viewBox="0 0 20 20">
//                 <rect
//                   width="4"
//                   height="12"
//                   x="3"
//                   y="4"
//                   rx="1"
//                   fill="currentColor"
//                 />
//                 <rect
//                   width="4"
//                   height="12"
//                   x="13"
//                   y="4"
//                   rx="1"
//                   fill="currentColor"
//                 />
//               </svg>
//             ) : (
//               <svg className="w-4 h-4" viewBox="0 0 20 20">
//                 <polygon points="6,4 16,10 6,16" fill="currentColor" />
//               </svg>
//             )}
//           </button>
//           <span className="text-white text-base font-light">
//             {isPlaying ? "Now Playing" : "Paused"}
//           </span>
//         </div>
//         <div className="text-white cursor-pointer hover:text-gray-300 transition-colors">
//           <FaUserCircle size={28} />
//         </div>
//       </div>
//     </div>
//   );
// }

// ========== GREETING CARD ==========
function GreetingCard() {
  const [greeting, setGreeting] = useState("");
  const [motivation, setMotivation] = useState("");

  const motivationalQuotes = [
    "Every moment is a fresh beginning.",
    "Believe you can and you're halfway there.",
    "Small steps every day lead to big changes.",
    "Your only limit is your mind.",
    "Progress, not perfection.",
    "Make today so awesome yesterday gets jealous.",
    "You are capable of amazing things.",
    "Embrace the journey, trust the process.",
  ];

  useEffect(() => {
    const hour = new Date().getHours();
    let greetingText = "";
    if (hour < 12) greetingText = "Good Morning,";
    else if (hour < 17) greetingText = "Good Afternoon,";
    else if (hour < 21) greetingText = "Good Evening,";
    else greetingText = "Good Night,";
    setGreeting(greetingText);
    setMotivation(
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    );
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative h-full rounded-3xl bg-gradient-to-br from-zinc-950 via-neutral-950 to-black shadow-2xl border border-white/10 px-12 py-10 overflow-hidden group hover:border-white/20 transition-all duration-500"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative z-10 flex items-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl" />
          <img
            src="https://cdn.pixabay.com/photo/2016/11/19/14/00/code-1839406_1280.jpg"
            alt="Character"
            className="relative w-20 h-20 object-cover rounded-2xl grayscale shadow-2xl border-4 border-white/20 hover:scale-105 transition-transform duration-500"
            draggable={false}
          />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2">
            {greeting}{" "}
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Clario.
            </span>
          </h1>
          <p className="text-lg text-white/60 font-medium">
            Welcome back to your advanced dashboard.
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="relative mt-6"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-xl blur-xl" />
        <p className="relative px-6 py-3 italic text-gray-200 text-lg font-medium rounded-xl border border-white/10 bg-black/30 backdrop-blur-xl shadow-xl">
          "{motivation}"
        </p>
      </motion.div>
    </motion.div>
  );
}

// ========== ANALOG + DIGITAL CLOCK ==========
function ClockCard() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const s = date.getSeconds();
  const m = date.getMinutes();
  const h = date.getHours() % 12;

  const hours24 = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="relative w-full h-full flex flex-col gap-2"
    >
      {/* Analog Clock - Reduced height */}
      <div className="relative" style={{ height: "72%" }}>
        <div className="relative w-full h-full rounded-3xl shadow-2xl bg-gradient-to-br from-zinc-950 to-black flex items-center justify-center border border-white/10 group hover:border-white/20 hover:scale-105 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <svg
            width="100%"
            height="100%"
            viewBox="0 0 220 220"
            className="relative z-10 drop-shadow-2xl"
          >
            <defs>
              <radialGradient id="clockFace">
                <stop offset="0%" stopColor="#1a1a1a" />
                <stop offset="100%" stopColor="#0a0a0a" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <circle
              cx="110"
              cy="110"
              r="95"
              fill="url(#clockFace)"
              stroke="white"
              strokeWidth="2"
              opacity="0.3"
            />

            {/* Hour markers */}
            {[...Array(12)].map((_, i) => (
              <line
                key={`tick-${i}`}
                x1="110"
                y1="25"
                x2="110"
                y2={i % 3 === 0 ? "40" : "35"}
                stroke="white"
                strokeWidth={i % 3 === 0 ? 3 : 2}
                opacity={i % 3 === 0 ? 0.8 : 0.3}
                transform={`rotate(${i * 30} 110 110)`}
              />
            ))}

            {/* Hour hand */}
            <line
              x1="110"
              y1="110"
              x2={110 + 45 * Math.sin((Math.PI / 6) * h + (Math.PI / 360) * m)}
              y2={110 - 45 * Math.cos((Math.PI / 6) * h + (Math.PI / 360) * m)}
              stroke="white"
              strokeWidth={8}
              strokeLinecap="round"
              opacity="0.9"
              filter="url(#glow)"
            />

            {/* Minute hand */}
            <line
              x1="110"
              y1="110"
              x2={110 + 70 * Math.sin((Math.PI / 30) * m)}
              y2={110 - 70 * Math.cos((Math.PI / 30) * m)}
              stroke="white"
              strokeWidth={5}
              strokeLinecap="round"
              opacity="0.95"
              filter="url(#glow)"
            />

            {/* Second hand */}
            <line
              x1="110"
              y1="110"
              x2={110 + 85 * Math.sin((Math.PI / 30) * s)}
              y2={110 - 85 * Math.cos((Math.PI / 30) * s)}
              stroke="#fff"
              strokeWidth={2}
              strokeLinecap="round"
              opacity="0.9"
              filter="url(#glow)"
            />

            {/* Center circle */}
            <circle
              cx="110"
              cy="110"
              r="8"
              fill="white"
              stroke="#666"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* Digital Clock - Fixed height */}
      <div className="relative" style={{ height: "25%" }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative w-full h-full rounded-3xl shadow-2xl bg-gradient-to-br from-zinc-950 to-black border border-white/10 group hover:border-white/20 hover:scale-105 transition-all duration-500 px-4 py-3 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative z-10 flex items-center justify-center gap-1">
            <motion.span
              key={`h-${hours24}`}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl font-bold text-white font-mono"
            >
              {hours24}
            </motion.span>

            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-4xl font-bold text-white/80"
            >
              :
            </motion.span>

            <motion.span
              key={`m-${minutes}`}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl font-bold text-white font-mono"
            >
              {minutes}
            </motion.span>

            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-4xl font-bold text-white/80"
            >
              :
            </motion.span>

            <motion.span
              key={`s-${seconds}`}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl font-bold text-white font-mono"
            >
              {seconds}
            </motion.span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ========== CALENDAR ==========
function CalendarCard() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const days = getDaysInMonth(currentDate);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="h-full rounded-3xl shadow-2xl border border-white/10 bg-gradient-to-br from-zinc-950 to-black px-6 py-6 hover:border-white/20 transition-all duration-500 group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() - 1
                  )
                )
              }
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all hover:scale-110 border border-white/10"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1
                  )
                )
              }
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all hover:scale-110 border border-white/10"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day, idx) => (
            <div
              key={idx}
              className="text-center text-xs font-bold text-white/50"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 flex-1">
          {days.map((day, idx) => (
            <motion.div
              key={idx}
              whileHover={day ? { scale: 1.1 } : {}}
              className={`
                flex items-center justify-center text-sm font-medium transition-all duration-300
                ${day === null ? "invisible" : ""}
                ${
                  isToday(day)
                    ? "bg-white text-black scale-110 font-bold shadow-xl shadow-white/20 rounded-full"
                    : "text-white/80 hover:bg-white/10 cursor-pointer border border-white/5 rounded-xl"
                }
              `}
            >
              {day}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ========== INFINITY VIDEO ==========
function InfinitySymbol() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative w-full h-full flex items-center justify-center"
    >
      <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-zinc-950 to-black shadow-2xl border border-white/10 group hover:border-white/20 hover:scale-105 transition-all duration-500 overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Local video instead of YouTube iframe */}
        <video
          src="/infinity.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover rounded-3xl"
        />

        {/* Overlay for soft glow / to hide video edges */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>
    </motion.div>
  );
}

// ========== MYSTERY CARD ==========
function MysteryCard() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [todaysMystery, setTodaysMystery] = useState(null);
  const [canReveal, setCanReveal] = useState(true);

  useEffect(() => {
    const startDate = new Date(2025, 0, 1);
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const dayIndex = diffDays % 90;

    const mystery = MYSTERY_CONTENT[dayIndex];
    setTodaysMystery(mystery);

    const lastReveal = localStorage.getItem("mysteryLastReveal");
    const todayStr = today.toDateString();
    if (lastReveal === todayStr) {
      setIsRevealed(true);
      setCanReveal(false);
    }
  }, []);

  const handleReveal = () => {
    if (!canReveal || isRevealed) return;
    setIsRevealed(true);
    setCanReveal(false);
    localStorage.setItem("mysteryLastReveal", new Date().toDateString());
  };

  if (!todaysMystery) return null;

  const category = MYSTERY_CATEGORIES[todaysMystery.cat];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="relative w-full h-full"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="relative w-full h-full rounded-3xl shadow-2xl cursor-pointer"
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        style={{ transformStyle: "preserve-3d" }}
        onClick={handleReveal}
      >
        {/* Front face - Locked */}
        <div
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-zinc-950 to-black border border-white/10 flex flex-col items-center justify-center group hover:border-white/20 hover:scale-105 transition-all duration-500"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <motion.div
            animate={canReveal ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative z-10"
          >
            <Lock size={48} className="text-white/80 mb-4" />
          </motion.div>

          <h3 className="text-2xl font-bold text-white mb-2">
            Mystery of the Day
          </h3>
          <p className="text-white/60 text-base mb-4">{category.name}</p>

          {canReveal ? (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white/40 text-sm"
            >
              Click to reveal
            </motion.div>
          ) : (
            <div className="text-white/40 text-sm">Revealed for today</div>
          )}
        </div>

        {/* Back face - Revealed */}
        <div
          className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${category.bg} border border-white/20 p-8 flex flex-col justify-center shadow-2xl`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />

          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white mb-3">
              {category.name}
            </h3>
            <h4 className="text-lg font-semibold text-white/90 mb-4">
              {todaysMystery.title}
            </h4>

            <p className="text-white/80 text-sm leading-relaxed">
              {todaysMystery.content}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ========== MAIN HOME COMPONENT ==========
export default function Home() {
  return (
    <div className="fixed inset-0 min-h-screen w-full bg-gradient-to-br from-black via-zinc-950 to-neutral-950 overflow-hidden">
      {/* <NavbarTop />
      <NavbarLeft /> */}

      <div
        className="absolute left-28 right-8 top-28 bottom-8 flex flex-col gap-6"
        style={{ height: "calc(100vh - 10rem)" }}
      >
        {/* TOP ROW: Greeting (65%) + Calendar (35%) */}
        <div className="flex gap-6" style={{ height: "55%" }}>
          <div style={{ width: "65%" }}>
            <GreetingCard />
          </div>
          <div style={{ width: "35%" }}>
            <CalendarCard />
          </div>
        </div>

        {/* BOTTOM ROW: Clock (38%) + Infinity (62%) under Greeting | Mystery under Calendar */}
        <div className="flex gap-6" style={{ height: "45%" }}>
          {/* Left side - Clock + Infinity (under greeting card) */}
          <div className="flex gap-6" style={{ width: "65%" }}>
            <div style={{ width: "38%" }}>
              <ClockCard />
            </div>
            <div style={{ width: "62%" }}>
              <InfinitySymbol />
            </div>
          </div>

          {/* Right side - Mystery Card (under calendar) */}
          <div style={{ width: "35%" }}>
            <MysteryCard />
          </div>
        </div>
      </div>
    </div>
  );
}