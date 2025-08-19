import React, { useState } from "react";

export default function AddTaskModal({ open, onClose, onCreate, categoryId }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("Medium");

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white/6 backdrop-blur p-6 rounded-xl w-[520px]">
        <h3 className="text-lg font-semibold mb-4">New Task</h3>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Task title" className="w-full p-2 rounded mb-2 bg-white/5"/>
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description" className="w-full p-2 rounded mb-2 bg-white/5"/>
        <div className="flex items-center gap-3">
          <select value={priority} onChange={e=>setPriority(e.target.value)} className="p-2 rounded bg-white/5">
            <option>High</option><option>Medium</option><option>Low</option>
          </select>
          <div className="text-sm text-gray-300">Category: <strong>{categoryId ? categoryId : "Choose on save"}</strong></div>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-3 py-1 rounded bg-white/5">Cancel</button>
          <button onClick={() => { onCreate({ name: title, description: desc, priority, date: new Date().toISOString().slice(0,10) }); setTitle(""); setDesc(""); }} className="px-3 py-1 rounded bg-indigo-600 text-white">Create</button>
        </div>
      </div>
    </div>
  );
}
