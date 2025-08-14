import React, { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api";
import NavbarLeft from "../layout/NavbarLeft";
import NavbarTop from "../layout/NavbarTop";
import NoteCard from "../components/notes/NoteCard";
import { FaPlus } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showColors, setShowColors] = useState(false);

  const presetColors = ["#FDE68A", "#86EFAC", "#93C5FD", "#FCA5A5", "#C4B5FD", "#FBBF24"];

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/notes", "GET");
      setNotes(data || []);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Create empty note at the first slot
const createEmptyNote = async (color) => {
  try {
    // Close the color bar first
    setShowColors(false);

    // Wait for the close animation to finish before adding the note
    setTimeout(async () => {
      const created = await apiRequest("/notes", "POST", {
        title: "",
        content: "",
        color,
        isPinned: false,
      });
      if (created && created._id) {
        setNotes((prev) => [created, ...prev]); // top position
      } else {
        fetchNotes();
      }
    }, 200); // match your framer-motion exit animation time
  } catch (e) {
    console.error(e);
  }
};


  const updateNote = async (id, patch) => {
    try {
      setNotes((prev) =>
        prev.map((n) => (n._id === id ? { ...n, ...patch } : n))
      );
      await apiRequest(`/notes/${id}`, "PUT", patch);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteNote = async (id) => {
    try {
      setNotes((prev) => prev.filter((n) => n._id !== id));
      await apiRequest(`/notes/${id}`, "DELETE");
    } catch (e) {
      console.error(e);
      fetchNotes();
    }
  };

  const sortedNotes = useMemo(
    () => [...notes].sort((a, b) => Number(b.isPinned) - Number(a.isPinned)),
    [notes]
  );

  const MAX_SLOTS = 12;
  const placeholders = Math.max(0, MAX_SLOTS - sortedNotes.length);

  return (
    <>
      <NavbarLeft />
      <NavbarTop />
      <div style={{ padding: "24px", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: "100%",
            maxWidth: 1280,
            minHeight: "80vh",
            background: "#F9FAFB",
            borderRadius: 16,
            boxShadow: "0 12px 30px rgba(0,0,0,0.10)",
            padding: 24,
            display: "grid",
            gridTemplateColumns: "90px 1fr",
            gap: 16,
          }}
        >
          {/* Left rail */}
          <div style={{ position: "relative" }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowColors((s) => !s)}
              title="Add Note"
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#FFFFFF",
                display: "grid",
                placeItems: "center",
                boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
                cursor: "pointer",
                userSelect: "none",
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
                    onClick={() => createEmptyNote(c)}
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
                <input
                  type="color"
                  onChange={(e) => createEmptyNote(e.target.value)}
                  title="Custom color"
                  style={{
                    appearance: "none",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                  }}
                />
              </motion.div>
            )}
          </div>

{/* Fixed 4x3 grid scrollable */}
<div
  style={{
    background: "#FFFFFF",
    borderRadius: 16,
    boxShadow: "inset 0 0 0 1px #E5E7EB",
    padding: 16,
    marginTop: 28,
    overflowY: "auto",
    maxHeight: "615px", // fixed height, or use calc for dynamic
  }}
  className="scrollable-grid"
>
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 16,
    }}
  >
    {loading ? (
      <div
        style={{
          gridColumn: "1 / -1",
          display: "grid",
          placeItems: "center",
          color: "#6B7280",
        }}
      >
        Loading…
      </div>
    ) : (
      <>
        <AnimatePresence>
          {sortedNotes.map((note) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <NoteCard
                note={note}
                onUpdate={(patch) => updateNote(note._id, patch)}
                onDelete={() => deleteNote(note._id)}
                onToggleFav={() =>
                  updateNote(note._id, { isPinned: !note.isPinned })
                }
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </>
    )}
  </div>
</div>

        </div>
      </div>
    </>
  );
}
