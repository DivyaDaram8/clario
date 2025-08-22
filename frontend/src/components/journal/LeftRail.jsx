// src/components/journal/LeftRail.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";

const presetColors = ["#FDE68A", "#BBF7D0", "#BFDBFE", "#FBCFE8", "#E9D5FF", "#FCA5A5"];

export default function LeftRail({ onCreate }) {
  const [showColors, setShowColors] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowColors((s) => !s)}
        title="Add Journal"
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#FFFFFF",
          display: "grid",
          placeItems: "center",
          boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
          cursor: "pointer",
        }}
      >
        <FaPlus />
      </motion.div>

      {showColors && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          style={{
            marginTop: 12,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {presetColors.map((c) => (
            <motion.button
              key={c}
              onClick={() => onCreate(c)}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "none",
                background: c,
                boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                cursor: "pointer",
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
