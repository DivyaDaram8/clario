import React, { useState, useEffect } from "react";

export default function AddTaskModal({ open, onClose, onCreate, categoryId, categories = [] }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("Medium");

  // Reset fields when modal opens/closes
  useEffect(() => {
    if (!open) {
      setTitle("");
      setDesc("");
      setPriority("Medium");
    }
  }, [open]);

  if (!open) return null;

  // Find category name instead of showing raw id
  const categoryName = categoryId
    ? categories.find((c) => c._id === categoryId)?.name || "Unknown"
    : "Choose on save";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl 
                      p-6 rounded-2xl w-full max-w-lg
                      text-gray-100">
        {/* Title */}
        <h3 className="text-xl font-semibold mb-4 text-white">✨ New Task</h3>

        {/* Task Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="w-full p-3 rounded-lg mb-3 bg-white/20 text-white placeholder-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />

        {/* Description (max 100 chars) */}
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value.slice(0, 100))}
          placeholder="Description (max 100 chars)"
          className="w-full p-3 rounded-lg mb-3 bg-white/20 text-white placeholder-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-indigo-400 transition resize-none"
          rows={3}
        />

        {/* Priority + Category */}
        <div className="flex items-center justify-between gap-4">
         <select
  value={priority}
  onChange={(e) => setPriority(e.target.value)}
  className="p-2 rounded-lg bg-white/20 text-white 
             focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
>
  <option className="text-black">High</option>
  <option className="text-black">Medium</option>
  <option className="text-black">Low</option>
</select>


          <div className="text-sm text-gray-200">
            Category: <strong className="text-indigo-300">{categoryName}</strong>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/20 text-gray-200 hover:bg-white/30 
                       transition focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!title.trim()) return alert("Task needs a title!");
              onCreate({
                name: title,
                description: desc,
                priority,
                date: new Date().toISOString().slice(0, 10),
              });
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white 
                       shadow-md transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
