import React from "react";

export default function TaskCard({ task, onToggleDone, onEdit }) {
  return (
    <div className="bg-white/5 p-3 rounded-xl shadow-sm hover:shadow-md cursor-grab select-none">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-semibold">{task.name}</div>
          {task.description && <div className="text-xs text-gray-300 mt-1 line-clamp-2">{task.description}</div>}
          <div className="text-xs mt-2 flex gap-2">
            <span className={`px-2 py-1 rounded-full text-[11px] ${task.priority === "High" ? "bg-rose-600" : task.priority === "Medium" ? "bg-yellow-500" : "bg-green-500"}`}>{task.priority}</span>
            <span className="text-gray-400">{task.orderIndex != null ? `#${task.orderIndex+1}` : ""}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button onClick={() => onToggleDone(task)} className={`px-2 py-1 rounded ${task.completed ? "bg-green-600" : "bg-white/5"}`}>
            {task.completed ? "✓" : "○"}
          </button>
          <button onClick={() => onEdit(task)} className="text-xs text-gray-300">Edit</button>
        </div>
      </div>
    </div>
  );
}
