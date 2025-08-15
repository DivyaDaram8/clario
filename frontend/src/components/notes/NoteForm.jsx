import React, { useState } from "react";

export default function NoteForm({ onSubmit, initialData, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [color, setColor] = useState(initialData?.color || "#fcd34d");
  const [isPinned, setIsPinned] = useState(initialData?.isPinned || false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSubmit({ title, content, color, isPinned });
    setTitle("");
    setContent("");
    setColor("#fcd34d");
    setIsPinned(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        padding: "1rem",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        marginTop: "1rem",
        marginBottom: "1rem", // clean margin below the + icon
      }}
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          padding: "0.5rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontWeight: "500",
        }}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        style={{
          padding: "0.5rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
          resize: "none",
        }}
      />
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        style={{ width: "50px", height: "50px", border: "none", padding: 0 }}
      />
      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <input
          type="checkbox"
          checked={isPinned}
          onChange={(e) => setIsPinned(e.target.checked)}
        />
        Pin this note
      </label>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          type="submit"
          style={{
            flex: 1,
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "0.5rem",
            cursor: "pointer",
          }}
        >
          {initialData ? "Update" : "Add"} Note
        </button>
        {initialData && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              background: "#e5e7eb",
              color: "#111",
              border: "none",
              borderRadius: "6px",
              padding: "0.5rem",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
