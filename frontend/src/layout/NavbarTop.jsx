import { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaPlay, FaPause, FaStepBackward, FaStepForward } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const STORAGE_KEY = "navbar-audio-state-v1";

export default function NavbarTop() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const audioRef = useRef(null);

  const songs = [
    "https://www.bensound.com/bensound-music/bensound-relaxing.mp3", // Calm piano
    "https://www.bensound.com/bensound-music/bensound-slowmotion.mp3", // Deep focus
    "https://www.bensound.com/bensound-music/bensound-inspire.mp3", // Uplifting study
  ];

  // Restore from sessionStorage on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.currentSong === "number") setCurrentSong(parsed.currentSong);
        if (typeof parsed.currentTime === "number" && audioRef.current) {
          // will set time after src assigned (see next effect)
          audioRef.current.currentTime = parsed.currentTime;
        }
        if (parsed.isPlaying) setIsPlaying(true); // we'll try to play after src set
      }
    } catch (e) {
      // ignore parsing errors
    }
  }, []);

  // Whenever song index changes, update audio src and attempt to restore time/play
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const newSrc = songs[currentSong];

    // Always update src and reset time when changing songs
    audio.src = newSrc;
    audio.currentTime = 0;

    // Load the new song
    audio.load();

    // Try to play if state says playing (note: browsers may require user gesture)
    if (isPlaying) {
      const p = audio.play();
      if (p && p.catch) {
        p.catch(() => {
          // autoplay blocked - user must interact
          setIsPlaying(false);
        });
      }
    }

  }, [currentSong, isPlaying]);

  // When isPlaying toggles, actually play/pause audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      const p = audio.play();
      if (p && p.catch) {
        p.catch(() => {
          // autoplay blocked -> revert state
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong]); // Added currentSong dependency

  // Save currentTime and currentSong periodically or on timeupdate
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      try {
        const toSave = {
          currentSong,
          currentTime: Math.floor(audio.currentTime),
          isPlaying,
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      } catch (e) {}
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);

    // also on unload
    const handleBeforeUnload = () => handleTimeUpdate();
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentSong, isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const p = audioRef.current.play();
      if (p && p.catch) {
        p.catch(() => {
          // autoplay blocked
          setIsPlaying(false);
        }).then(() => {
          setIsPlaying(true);
        });
      } else {
        setIsPlaying(true);
      }
    }
  };

  const playNext = () => setCurrentSong((prev) => (prev + 1) % songs.length);
  const playPrevious = () => setCurrentSong((prev) => (prev - 1 + songs.length) % songs.length);

  // handle ended
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => playNext();
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className="flex items-center justify-between gap-12 px-6 py-3 rounded-full shadow-lg bg-black/50 backdrop-blur-md border border-white/10 transition-all duration-300 hover:scale-105 hover:bg-black/70"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="text-white font-semibold tracking-wide text-lg cursor-pointer">Clario</div>

        <div className="flex items-center gap-3 relative min-w-[40px] justify-center">
          {!isPlaying && (
            <button onClick={togglePlay} className="text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all">
              <FaPlay size={14} />
            </button>
          )}

          {isPlaying && isHovered && (
            <div className="flex items-center gap-3">
              <button onClick={playPrevious} className="text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all">
                <FaStepBackward size={14} />
              </button>
              <button onClick={togglePlay} className="text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all">
                <FaPause size={14} />
              </button>
              <button onClick={playNext} className="text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all">
                <FaStepForward size={14} />
              </button>
            </div>
          )}

          {isPlaying && !isHovered && (
            <div className="flex items-end gap-1 h-6">
              <div className="w-1 bg-gradient-to-t from-sky-300 to-sky-500 rounded-full animate-music-bar-1" style={{ animationDelay: "0s" }}></div>
              <div className="w-1 bg-gradient-to-t from-sky-300 to-sky-500 rounded-full animate-music-bar-2" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-1 bg-gradient-to-t from-sky-300 to-sky-500 rounded-full animate-music-bar-3" style={{ animationDelay: "0.4s" }}></div>
              <div className="w-1 bg-gradient-to-t from-sky-300 to-sky-500 rounded-full animate-music-bar-1" style={{ animationDelay: "0.6s" }}></div>
              <div className="w-1 bg-gradient-to-t from-sky-300 to-sky-500 rounded-full animate-music-bar-2" style={{ animationDelay: "0.8s" }}></div>
            </div>
          )}
        </div>

        <div
  className="text-white cursor-pointer hover:text-gray-300 transition-colors"
  onClick={() => navigate("/profile")}
>
  <FaUserCircle size={24} />   {/* <-- Set size explicitly */}
</div>

      </div>

      <audio ref={audioRef} />
      <style>{`
        @keyframes music-bar-1 { 0%,100%{height:8px} 50%{height:24px} }
        @keyframes music-bar-2 { 0%,100%{height:16px} 50%{height:12px} }
        @keyframes music-bar-3 { 0%,100%{height:12px} 50%{height:20px} }
        .animate-music-bar-1 { animation: music-bar-1 0.8s ease-in-out infinite; }
        .animate-music-bar-2 { animation: music-bar-2 0.8s ease-in-out infinite; }
        .animate-music-bar-3 { animation: music-bar-3 0.8s ease-in-out infinite; }
      `}</style>
    </div>
  );
}