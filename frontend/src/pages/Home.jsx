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
import { MYSTERY_CATEGORIES, MYSTERY_CONTENT } from "../data/mysteryData.js";







// FRONTEND-ONLY: Quote of the Day (MINIMAL)
function DailyQuoteFrontendOnly({
  storageKey = "clario_qotd_minimal_v1",
  fetchUrl = "https://api.api-ninjas.com/v2/quoteoftheday"
}) {
  const [quote, setQuote] = useState(null);

  const today = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  useEffect(() => {
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed?.date === today()) {
          setQuote(parsed.quote);
          return;
        }
      } catch {}
    }

    (async () => {
      try {
        const key = import.meta.env.VITE_API_NINJAS_KEY;
        if (!key) return;

        const res = await fetch(fetchUrl, {
          headers: { "X-Api-Key": key }
        });
        if (!res.ok) return;

        const data = await res.json();
        const q = Array.isArray(data) ? data[0] : data;

        const normalized = {
          quote: q?.quote || "",
          author: q?.author || ""
        };

        localStorage.setItem(storageKey, JSON.stringify({
          date: today(),
          quote: normalized
        }));

        setQuote(normalized);
      } catch (e) {
        console.log("QOTD Error", e);
      }
    })();
  }, []);

  if (!quote) return null; // don't show anything until fetched

  return (
    <div className="mt-6">
      <h4 className="text-sm text-white/60 mb-2">Quote of the Day</h4>
      <p className="text-2xl text-white/90 leading-relaxed">“{quote.quote}”</p>
      <p className="mt-1 text-xs text-white/60">- {quote.author}</p>
    </div>
  );
}



// ========== GREETING CARD ==========
function GreetingCard() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    let txt = "";
    if (hour < 12) txt = "Good Morning";
    else if (hour < 17) txt = "Good Afternoon";
    else if (hour < 21) txt = "Good Evening";
    else txt = "Good Night,";
    setGreeting(txt);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative h-full rounded-3xl bg-gradient-to-br from-zinc-950 via-neutral-950 to-black shadow-2xl border border-white/10 px-6 md:px-8 lg:px-12 py-6 md:py-8 lg:py-10 overflow-hidden group hover:border-white/20 transition-all duration-500"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative z-10 flex items-center gap-3 md:gap-4 lg:gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl" />

          <picture>
            <source
              srcSet="/clario-icons/android-chrome-512x512.png"
              media="(min-width: 1024px)"
            />
            <source
              srcSet="/clario-icons/android-chrome-192x192.png"
              media="(min-width: 640px)"
            />
            <img
              src="/clario-icons/favicon-32x32.png"
              alt="Clario Icon"
              className="relative w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-cover rounded-2xl grayscale shadow-2xl hover:scale-105 transition-transform duration-500 clario-float"
              draggable={false}
            />
          </picture>
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-1 md:mb-2">
            {greeting}{" "}
            {/* <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Clario.
            </span> */}
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-white/60 font-medium">
            Welcome back to your advanced dashboard.
          </p>
        </div>
      </div>

      {/* Minimal Quote of the Day */}
      <DailyQuoteFrontendOnly />
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

       {/* Local video - FIXED to fit properly */}
       <video
         src="/infinity.mp4"
         autoPlay
         loop
         muted
         playsInline
         className="absolute inset-0 w-full h-full object-contain rounded-3xl"
       />

       {/* Overlay for soft glow / to hide video edges */}
       <div className="absolute inset-0 bg-black/20 pointer-events-none rounded-3xl" />
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
    // start date that seeds the cycle
    const startDate = new Date(2025, 0, 1);

    // compute difference in days using UTC midnights (avoid timezone pitfalls)
    const today = new Date();
    const utcStart = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const diffDays = Math.floor((utcToday - utcStart) / (1000 * 60 * 60 * 24));

    const dayIndex = diffDays % MYSTERY_CONTENT.length;


    const mystery = MYSTERY_CONTENT[dayIndex];
    setTodaysMystery(mystery);

    // check localStorage using ISO date
    const lastReveal = localStorage.getItem("mysteryLastReveal"); // stored as YYYY-MM-DD
    const todayStr = new Date().toISOString().slice(0, 10);
    if (lastReveal === todayStr) {
      setIsRevealed(true);
      setCanReveal(false);
    } else {
      setIsRevealed(false);
      setCanReveal(true);
    }
  }, []);

  const handleReveal = () => {
    if (!canReveal || isRevealed) return;
    const todayStr = new Date().toISOString().slice(0, 10);
    localStorage.setItem("mysteryLastReveal", todayStr);
    setIsRevealed(true);
    setCanReveal(false);
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
        onClick={handleReveal}
        style={{
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* Front face - Locked */}
        <div
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-zinc-950 to-black border border-white/10 flex flex-col items-center justify-center group hover:border-white/20 hover:scale-105 transition-all duration-500"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            pointerEvents: isRevealed ? "none" : "auto", // let back receive clicks after reveal
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <motion.div
            animate={canReveal ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 2, repeat: canReveal ? Infinity : 0 }}
            className="relative z-10"
          >
            <Lock size={48} className="text-white/80 mb-4" />
          </motion.div>

          <h3 className="text-2xl font-bold text-white mb-2">Mystery of the Day</h3>
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
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            WebkitTransform: "rotateY(180deg)",
            pointerEvents: isRevealed ? "auto" : "none",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />

          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white mb-3">{category.name}</h3>
            <h4 className="text-lg font-semibold text-white/90 mb-4">{todaysMystery.title}</h4>
            <p className="text-white/80 text-sm leading-relaxed">{todaysMystery.content}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}



// ========== MAIN HOME COMPONENT ==========
// ========== MAIN HOME COMPONENT ==========
export default function Home() {
 return (
   <div className="fixed inset-0 min-h-screen w-full bg-gradient-to-br from-black via-zinc-950 to-neutral-950 overflow-hidden">
     {/* <NavbarTop />
     <NavbarLeft /> */}

     {/* Desktop Layout (1024px and above) */}
     <div className="hidden lg:block absolute left-28 right-8 top-25 bottom-8">
       <div className="flex flex-col gap-6 h-full">
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

     {/* iPad/Tablet Layout (768px to 1023px) */}
     <div className="hidden md:block lg:hidden absolute inset-0 overflow-y-auto px-6 pt-20 py-8">
       <div className="flex flex-col gap-6 pb-8">
         {/* Row 1: Greeting Card (Full Width) */}
         <div className="h-[320px]">
           <GreetingCard />
         </div>

         {/* Row 2: Calendar + Mystery (50-50) */}
         <div className="flex gap-6 h-[380px]">
           <div className="flex-1">
             <CalendarCard />
           </div>
           <div className="flex-1">
             <MysteryCard />
           </div>
         </div>

         {/* Row 3: Clock + Infinity (40-60) */}
         <div className="flex gap-6 h-[320px]">
           <div className="w-[40%]">
             <ClockCard />
           </div>
           <div className="w-[60%]">
             <InfinitySymbol />
           </div>
         </div>
       </div>
     </div>

     {/* Mobile Layout - Vertical Stack (below 768px) - WITH TOP SPACING */}
     <div className="md:hidden absolute inset-0 overflow-y-auto px-4 pt-20 pb-6">
       <div className="flex flex-col gap-6 pb-6">
         {/* Greeting Card */}
         <div className="h-[400px]">
           <GreetingCard />
         </div>

         {/* Calendar Card */}
         <div className="h-[400px]">
           <CalendarCard />
         </div>

         {/* Clock Card */}
         <div className="h-[400px]">
           <ClockCard />
         </div>

         {/* Infinity Video */}
         <div className="h-[400px]">
           <InfinitySymbol />
         </div>

         {/* Mystery Card */}
         <div className="h-[400px]">
           <MysteryCard />
         </div>
       </div>
     </div>
   </div>
 );
}



