// ========== ADD TASK MODAL ==========
import React, { useState, useEffect } from "react";

export default function AddTaskModal({
  open,
  onClose,
  onCreate,
  onUpdate,
  categoryId,
  categories = [],
  task
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("Medium");

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
      onUpdate(task._id, payload);
    } else {
      onCreate(payload);
    }
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container task-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task ? "✏️ Edit Task" : "✨ Create New Task"}</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Task Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="modal-input"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Description (optional)</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value.slice(0, 150))}
              placeholder="Add details about this task..."
              className="modal-textarea"
              rows={3}
            />
            <span className="char-count">{desc.length}/150</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="modal-select"
              >
                <option value="High">🔴 High</option>
                <option value="Medium">🟡 Medium</option>
                <option value="Low">🟢 Low</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <div className="category-display">{categoryName}</div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            {task ? "Update Task" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}