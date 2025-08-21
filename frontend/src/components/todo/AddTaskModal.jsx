import React, { useState, useEffect } from "react";

export default function AddTaskModal({
  open,
  onClose,
  onCreate,
  onUpdate,   // 👈 new
  categoryId,
  categories = [],
  task        // 👈 optional task to edit
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("Medium");

  // Reset or prefill
  useEffect(() => {
    if (open) {
      if (task) {
        setTitle(task.name);
        setDesc(task.description || "");
        setPriority(task.priority || "Medium");
      } else {
        setTitle("");
        setDesc("");
        setPriority("Medium");
      }
    }
  }, [open, task]);

  if (!open) return null;

  const categoryName = categoryId
    ? categories.find((c) => c._id === categoryId)?.name || "Unknown"
    : "Choose on save";

  function handleSubmit() {
    if (!title.trim()) return alert("Task needs a title!");

    const payload = {
      name: title,
      description: desc,
      priority,
      date: new Date().toISOString().slice(0, 10),
    };

    if (task) {
      onUpdate(task._id, payload); // 👈 update existing
    } else {
      onCreate(payload); // 👈 create new
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl 
                      p-6 rounded-2xl w-full max-w-lg
                      text-gray-100">

        <h3 className="text-xl font-semibold mb-4 text-white">
          {task ? "✏️ Edit Task" : "✨ New Task"}
        </h3>

        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="w-full p-3 rounded-lg mb-3 bg-white/20 text-white placeholder-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />

        {/* Description */}
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
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-white/20">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {task ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
