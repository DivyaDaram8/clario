import React from "react";
import { Edit, Trash2 } from "lucide-react";

export default function TaskCard({ task, onToggleDone, onEdit, onDelete }) {
  return (
    <div
      className={`relative bg-white/5 p-4 rounded-xl shadow-sm hover:shadow-md select-none border-l-4 group
        ${task.priority === "High" ? "border-rose-600" 
          : task.priority === "Medium" ? "border-yellow-500" 
          : "border-green-500"}`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left side: Checkbox + Title */}
        <div className="flex items-center gap-3 flex-1">
          {/* Circle Checkbox */}
          <button
            onClick={() => onToggleDone(task)}
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors 
              ${task.completed ? "bg-green-600 border-green-600" : "border-gray-400 hover:border-white"}`}
          >
            {task.completed && <span className="text-white text-xs">✓</span>}
          </button>

          {/* Title */}
          <div className="flex flex-col">
            <span
              className={`text-sm font-semibold transition-colors
                ${task.completed ? "line-through text-gray-400" : "text-sky-400"}`}
            >
              {task.name || "Untitled Task"}
            </span>
          </div>
        </div>

        {/* Right side: Order, Edit, Delete */}
        <div className="flex items-center gap-3">
          {task.orderIndex != null && (
            <span className="text-xs text-gray-400">#{task.orderIndex + 1}</span>
          )}
          <button
            onClick={() => onEdit(task)}
            className="text-gray-300 hover:text-white"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="text-red-400 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Floating description tooltip (Google Dev style) */}
      {task.description && (
        <div
          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 
                     hidden group-hover:block z-50 w-max max-w-xs
                     bg-gray-800 text-white text-xs px-3 py-2 rounded-md shadow-lg
                     border border-gray-700
                     animate-fadeIn"
        >
          {task.description}
        </div>
      )}
    </div>
  );
}
