import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

export default function App() {
  const shouldReduce = useReducedMotion();

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col overflow-hidden relative">
      {/* ====== Decorative background (put BEFORE main content) ====== */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full z-0 will-change-transform"
        animate={shouldReduce ? {} : { x: [0, 20, 0], y: [0, -12, 0] }}
        transition={shouldReduce ? {} : { duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "radial-gradient(closest-side, rgba(255,255,255,0.18), rgba(255,255,255,0.03))",
          filter: "blur(120px)",
        }}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full z-0 will-change-transform"
        animate={shouldReduce ? {} : { x: [0, -20, 0], y: [0, 12, 0] }}
        transition={shouldReduce ? {} : { duration: 22, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "radial-gradient(closest-side, rgba(255,255,255,0.14), rgba(255,255,255,0.02))",
          filter: "blur(110px)",
        }}
      />

      {/* subtle grid overlay — ensure z is between bg shapes and content (z-5 not valid; use z-5 equivalent z-10 for content so grid behind content) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "100px 100px",
          maskImage: "radial-gradient(ellipse 80% 50% at 50% 50%, black, transparent)",
        }}
      />

      {/* ====== Main content (higher z) ====== */}
      <section className="relative flex flex-col items-center justify-center flex-1 px-6 text-center z-20">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl md:text-8xl font-extrabold tracking-tight text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.25)]"
        >
          cLarIo
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.9 }}
          className="mt-6 text-lg md:text-2xl text-white/70 max-w-2xl"
        >
          Clarity engineered. Chaos deleted.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-10 flex gap-6"
        >
          <Link to="/signup" className="px-8 py-4 rounded-full bg-white text-black text-lg font-semibold shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:shadow-[0_0_60px_rgba(255,255,255,0.45)] hover:scale-105 transition-all">
            Get Started
          </Link>
          <Link to="/login" className="px-8 py-4 rounded-full bg-transparent border-2 border-white/20 text-white text-lg font-semibold backdrop-blur-sm hover:bg-white/10 hover:border-white/40 hover:scale-105 transition-all">
            Log In
          </Link>
        </motion.div>
      </section>

      <footer className="px-6 py-8 text-center text-white/50 text-sm border-t border-white/10 relative z-20">
        <strong>cLarIo</strong>
        <br />
        Designed and Developed by
        <br />
        <strong>LDD &amp; IN</strong>
      </footer>
    </div>
  );
}
