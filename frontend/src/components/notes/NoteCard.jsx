import React, { useEffect, useRef, useState } from "react";
import { FaStar, FaRegStar, FaEdit, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";

export default function NoteCard({ note, onUpdate, onDelete, onToggleFav }) {
  const [title, setTitle] = useState(note.title || "");
  const [content, setContent] = useState(note.content || "");
  const titleRef = useRef(null);

  useEffect(() => {
    setTitle(note.title || "");
    setContent(note.content || "");
  }, [note._id, note.title, note.content]);

  const saveTitle = () => {
    if (title !== note.title) onUpdate({ title });
  };
  const saveContent = () => {
    if (content !== note.content) onUpdate({ content });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: "0 8px 20px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.15 }}
      style={{
        background: note.color || "#FFF",
        borderRadius: 12,
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        padding: 12,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 8 }}>
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={onToggleFav}
          title={note.isPinned ? "Unfavorite" : "Favorite"}
          style={iconBtn}
        >
          {note.isPinned ? <FaStar /> : <FaRegStar />}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={onDelete}
          title="Delete note"
          style={iconBtn}
        >
          <FaTrash />
        </motion.button>
      </div>

      <input
        ref={titleRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={saveTitle}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
        placeholder="Title"
        style={{
          background: "transparent",
          border: "none",
          outline: "none",
          fontSize: 16,
          fontWeight: 700,
          marginBottom: 8,
        }}
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={saveContent}
        placeholder="Take a note…"
        rows={5}
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          resize: "none",
          fontSize: 14,
          lineHeight: 1.45,
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, opacity: 0.75 }}>
        <small>{new Date(note.createdAt).toLocaleString()}</small>
        <small style={{ display: "inline-flex", alignItems: "center", gap: 6, opacity: 0.7 }}>
          <FaEdit /> inline edit
        </small>
      </div>
    </motion.div>
  );
}

const iconBtn = {
  background: "#FFFFFF",
  border: "none",
  borderRadius: 8,
  width: 32,
  height: 32,
  display: "grid",
  placeItems: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  cursor: "pointer",
};
