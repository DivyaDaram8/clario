// ========== CATEGORY BAR ==========
import React, { useState } from "react";
import { Trash2, Plus } from "lucide-react";

export default function CategoryBar({
  categories = [],
  onSelect,
  selectedId,
  onOpenAdd,
  onOpenTaskModal,
  onDeleteCategory,
}) {
  const [expanded, setExpanded] = useState(true);

  const handleTaskOpen = (catId) => {
    if (onSelect) onSelect(catId);
    if (onOpenTaskModal) onOpenTaskModal(catId);
  };

  return (
    <div className="category-sidebar">
      <div className="category-sidebar-header">
        <h2>Categories</h2>
        <button 
          className="category-toggle-btn"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "−" : "+"}
        </button>
      </div>

      {expanded && (
        <div className="category-list">
          {categories.length === 0 ? (
            <div className="category-empty">
              <p>No categories yet</p>
              <p className="category-empty-hint">Create one to get started</p>
            </div>
          ) : (
            categories.map((cat) => (
              <div
                key={cat._id}
                className={`category-item ${selectedId === cat._id ? "category-item-active" : ""}`}
              >
                <button
                  onClick={() => handleTaskOpen(cat._id)}
                  className="category-item-btn"
                >
                  <span className="category-icon">{cat.icon || cat.name[0]}</span>
                  <span className="category-name">{cat.name}</span>
                </button>

                <button
                  onClick={() => onDeleteCategory?.(cat._id)}
                  className="category-delete-btn"
                  title="Delete category"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}

          <button onClick={onOpenAdd} className="category-add-btn">
            <Plus size={20} />
            <span>New Category</span>
          </button>
        </div>
      )}
    </div>
  );
}