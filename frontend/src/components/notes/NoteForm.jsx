import { useState } from "react";

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
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <input
        type="text"
        placeholder="Note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Note content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={isPinned}
          onChange={(e) => setIsPinned(e.target.checked)}
        />
        Pin
      </label>
      <button type="submit">{initialData ? "Update" : "Add"} Note</button>
      {initialData && <button onClick={onCancel}>Cancel</button>}
    </form>
  );
}
