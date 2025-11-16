import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function App() {
  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col overflow-hidden relative">
      
      {/* Floating glowing background shapes - white glow */}
      <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-white/5 rounded-full blur-[200px] animate-pulse" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-white/5 rounded-full blur-[200px] animate-pulse" />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center flex-1 px-6 text-center z-10">
        
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl md:text-8xl font-extrabold tracking-tight text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.3)]"
        >
          Clario
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mt-6 text-lg md:text-2xl text-white/70 max-w-2xl"
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
            className="px-8 py-4 rounded-full bg-white text-black text-lg font-semibold shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:scale-105 transition-all"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 rounded-full bg-transparent border-2 border-white/20 text-white text-lg font-semibold backdrop-blur-sm hover:bg-white/10 hover:border-white/40 hover:scale-105 transition-all"
          >
            Log In
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      {/* <footer className="px-6 py-8 text-center text-white/50 text-sm border-t border-white/10 relative z-10">
        ©Clario. Cool, calm, and future-ready.
      </footer> */}
    </div>
  );
}