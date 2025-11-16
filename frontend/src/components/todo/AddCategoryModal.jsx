// ========== ADD CATEGORY MODAL ==========
import React, { useState } from "react";

const ICONS = [
  "📚", "💼", "🏋️", "📝", "🎯", "💡", "🔥", "🌱",
  "📅", "🎵", "🛒", "💻", "📱", "🧘", "🍔", "✈️",
  "💳", "📊", "🎮", "🎨", "🛏️", "🧹", "🐶", "🏖️",
];

export default function AddCategoryModal({ open, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");
  const [icon, setIcon] = useState("");

  if (!open) return null;

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate({ name, color: "#000000", icon });
    setName("");
    setIcon("");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Category</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Category Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Work, Fitness, Shopping..."
              className="modal-input"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Choose an Icon</label>
            <div className="icon-grid">
              {ICONS.map((i) => (
                <button
                  key={i}
                  onClick={() => setIcon(i)}
                  className={`icon-btn ${icon === i ? "icon-btn-selected" : ""}`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleCreate}>
            Create Category
          </button>
        </div>
      </div>
    </div>
  );
}