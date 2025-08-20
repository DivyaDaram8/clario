import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react"; // import delete icon

export default function CategoryBar({
  categories = [],
  onSelect,
  selectedId,
  onOpenAdd,
  onOpenTaskModal,
  onDeleteCategory, // 👈 new prop
}) {
  const [open, setOpen] = useState(false);

  // helper: close rail when task created
  const handleTaskOpen = (catId) => {
    if (onSelect) onSelect(catId);
    if (onOpenTaskModal) onOpenTaskModal(catId);
    setOpen(false); // auto-close after action
  };

  return (
    <div
      className="
        w-60
        bg-black/50 backdrop-blur-md border border-white/10
        rounded-2xl p-3
        flex flex-col items-center gap-3
        shadow-lg
      "
    >
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-md hover:scale-110 transition focus:outline-none focus:ring-0"
        title="Show categories"
      >
        ＋
      </button>

      {/* Sliding Rail */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full overflow-hidden"
          >
            <div className="flex flex-col gap-3 mt-3">
              {categories.length === 0 ? (
                <div className="text-xs text-gray-400 text-center">
                  No categories
                </div>
              ) : (
                categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg text-white text-sm transition hover:scale-[1.02]"
                    style={{
                      backgroundColor: cat.color || "#6366f1", // fallback indigo
                    }}
                  >
                    {/* Category Button */}
                    <button
                      onClick={() => handleTaskOpen(cat._id)}
                      className={`flex items-center gap-2 flex-1 text-left focus:outline-none ${
                        selectedId === cat._id ? "ring-2 ring-indigo-400 rounded-lg" : ""
                      }`}
                    >
                      <span className="w-8 h-8 flex items-center justify-center rounded-md bg-black/20">
                        {cat.icon || cat.name[0]}
                      </span>
                      <span className="truncate">{cat.name}</span>
                    </button>

                    {/* Delete Button */}
                    <button
  onClick={() => onDeleteCategory?.(cat._id)}
  className="p-1 rounded-md hover:bg-red-500/20 text-red-300 hover:text-red-500 transition"
  title="Delete category"
>
  <Trash2 size={16} />
</button>

                  </div>
                ))
              )}

              {/* Add Category shortcut */}
              <button
                onClick={() => {
                  onOpenAdd();
                  setOpen(false); // close after adding too
                }}
                className="flex items-center justify-center gap-2 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition text-sm focus:outline-none focus:ring-0"
              >
                ＋ New Category
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
