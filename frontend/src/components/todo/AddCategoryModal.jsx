import React, { useState } from "react";

const ICONS = ["📚", "💼", "🏋️‍♀️", "📝", "🎯", "💡", "🔥", "🌱"];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-[420px]">
        <h3 className="text-xl font-semibold mb-4">Create New Category</h3>

        {/* Category Name */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category Name"
          className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        {/* Color + Icon */}
        <div className="flex items-center gap-3 mb-4">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-10 border rounded cursor-pointer"
          />

          <div className="flex flex-wrap gap-2">
            {ICONS.map((i) => (
              <button
                key={i}
                onClick={() => setIcon(i)}
                className={`text-xl px-2 py-1 rounded ${
                  icon === i ? "bg-indigo-100 border border-indigo-400" : "bg-gray-100"
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
            className="px-4 py-2 rounded-lg border bg-gray-50 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
