// ========== TASK CARD ==========
import React from "react";
import { Edit, Trash2 } from "lucide-react";

export default function TaskCard({ task, onToggleDone, onEdit, onDelete }) {
  const priorityColors = {
    High: "#ef4444",
    Medium: "#f59e0b", 
    Low: "#10b981"
  };

  return (
    <div className="task-card" style={{ borderLeftColor: priorityColors[task.priority] }}>
      <div className="task-card-content">
        <div className="task-main">
          <button
            onClick={() => onToggleDone(task)}
            className={`task-checkbox ${task.completed ? "task-checkbox-checked" : ""}`}
          >
            {task.completed && <span className="checkmark">✓</span>}
          </button>

          <div className="task-info">
            <span className={`task-title ${task.completed ? "task-title-completed" : ""}`}>
              {task.name || "Untitled Task"}
            </span>
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
          </div>
        </div>

        <div className="task-actions">
          {task.orderIndex != null && (
            <span className="task-order">#{task.orderIndex + 1}</span>
          )}
          <button onClick={() => onEdit(task)} className="task-action-btn">
            <Edit size={16} />
          </button>
          <button onClick={() => onDelete(task)} className="task-action-btn task-delete">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}