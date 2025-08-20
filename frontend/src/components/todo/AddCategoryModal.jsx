import React, { useState } from "react";

const ICONS = [
  "📚", "💼", "🏋️‍♀️", "📝", "🎯", "💡", "🔥", "🌱",
  "📅", "🎵", "🛒", "💻", "📱", "🧘‍♀️", "🍔", "✈️",
  "💳", "📊", "🎮", "🎨", "🛏️", "🧹", "🐶", "🏖️",
];

export default function AddCategoryModal({ open, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6d28d9");
  const [icon, setIcon] = useState("");

  if (!open) return null;

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate({ name, color, icon });
    setName("");
    setColor("#6d28d9");
    setIcon("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
      <div className="bg-white/70 backdrop-blur-xl border border-gray-200/60 
                      shadow-2xl rounded-2xl p-6 w-full max-w-lg text-gray-900 relative">
        
        {/* Header */}
        <h3 className="text-2xl font-semibold mb-6 tracking-wide">New Category</h3>

        {/* Name Input */}
        <div className="mb-5">
          <label className="block text-sm mb-2 text-gray-700">Category Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Work, Fitness, Shopping..."
            className="w-full px-4 py-2 rounded-lg 
                       bg-white/80 text-gray-900 placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Color Picker */}
        <div className="mb-6">
          <label className="block text-sm mb-2 text-gray-700">Choose a Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-14 h-10 rounded-lg border border-gray-300 cursor-pointer"
          />
        </div>

        {/* Icon Picker */}
        <div className="mb-6">
          <label className="block text-sm mb-3 text-gray-700">Pick an Icon</label>
          <div className="grid grid-cols-6 gap-3 max-h-40 overflow-y-auto p-2 rounded-lg bg-white/60">
            {ICONS.map((i) => (
              <button
                key={i}
                onClick={() => setIcon(i)}
                className={`text-2xl p-2 rounded-lg transition 
                  ${icon === i 
                    ? "bg-indigo-500/90 text-white border border-indigo-300 scale-105 shadow-md" 
                    : "bg-white/80 hover:bg-indigo-100"
                  }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition text-white shadow-md"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
