import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaPlay, FaPause } from "react-icons/fa";

export default function NavbarTop() {
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate(); // for navigation

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className="
          flex items-center justify-between
          gap-8 px-6 py-3
          rounded-full shadow-lg
          bg-black/50 backdrop-blur-md border border-white/10
          transition-all duration-300
          hover:scale-105 hover:bg-black/70
        "
      >
        {/* Left: Brand */}
        <div
          onClick={() => navigate("/home")}
          className="text-white font-semibold tracking-wide text-lg cursor-pointer hover:text-gray-300"
        >
          clario
        </div>

        {/* Center: Music Player */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <span className="text-white text-sm font-light">
            {isPlaying ? "Now Playing" : "Paused"}
          </span>
        </div>

        {/* Right: Profile Icon */}
        <div
          onClick={() => navigate("/profile")} // avigate to profile page
          className="text-white cursor-pointer hover:text-gray-300 transition-colors"
        >
          <FaUserCircle size={28} />
        </div>
      </div>
    </div>
  );
}
