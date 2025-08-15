import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-white to-emerald-50 text-gray-800 flex flex-col overflow-hidden relative">
      
      {/* Floating glowing background shapes */}
      <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-sky-300/30 rounded-full blur-[200px] animate-pulse" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-emerald-300/30 rounded-full blur-[200px] animate-pulse" />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center flex-1 px-6 text-center z-10">
        
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl md:text-8xl font-extrabold tracking-tight bg-gradient-to-r from-sky-500 via-emerald-400 to-sky-500 text-transparent bg-clip-text drop-shadow-lg"
        >
          Clario
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mt-6 text-lg md:text-2xl text-gray-600 max-w-2xl"
        >
          The productivity OS of the future — calm, intuitive, and impossibly beautiful.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-10 flex gap-6"
        >
          <Link
            to="/signup"
            className="px-8 py-4 rounded-full bg-gradient-to-r from-sky-500 to-emerald-400 text-white text-lg shadow-lg hover:shadow-sky-300/50 hover:scale-105 transition-all"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 rounded-full bg-white border border-sky-200 text-lg shadow hover:shadow-lg hover:scale-105 transition-all"
          >
            Log In
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24 bg-gradient-to-br from-white to-sky-50 backdrop-blur-md relative z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          {[
            {
              title: "Pomodoro Flow",
              desc: "Focus cycles tuned to your energy waves with a calming interface.",
            },
            {
              title: "Habit Horizon",
              desc: "Track routines and see your growth in living, breathing visuals.",
            },
            {
              title: "Time Waves",
              desc: "Your schedule displayed like an ocean current — smooth and flowing.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.07, y: -5 }}
              className="p-6 rounded-2xl bg-white/40 border border-sky-100 shadow-lg backdrop-blur-xl"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-700">{feature.title}</h3>
              <p className="text-gray-500">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-gray-500 text-sm border-t border-sky-100 relative z-10">
        ©Clario. Cool, calm, and future-ready.
      </footer>
    </div>
  );
}
