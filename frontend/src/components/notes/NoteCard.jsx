import React, { useEffect, useRef, useState } from "react";
import { Star, Trash2 } from "lucide-react";
import "../../styles/Note.css";

export default function NoteCard({ note, onUpdate, onDelete, onToggleFav }) {
  const [title, setTitle] = useState(note.title || "");
  const [content, setContent] = useState(note.content || "");
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    setTitle(note.title || "");
    setContent(note.content || "");
  }, [note._id, note.title, note.content]);

  const saveTitle = () => {
    if (title !== note.title) {
      onUpdate({ title });
    }
  };

  const saveContent = () => {
    if (content !== note.content) {
      onUpdate({ content });
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveTitle();
      contentRef.current?.focus();
    }
    if (e.key === "Escape") {
      setTitle(note.title || "");
      e.currentTarget.blur();
    }
  };

  const handleContentKeyDown = (e) => {
    if (e.key === "Escape") {
      setContent(note.content || "");
      e.currentTarget.blur();
    }
  };

  return (
    <div className="note-card">
      <div className="note-card-content">
        <input
          ref={titleRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={saveTitle}
          onKeyDown={handleTitleKeyDown}
          placeholder="Title"
          className="note-title-input"
        />

        <textarea
          ref={contentRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={saveContent}
          onKeyDown={handleContentKeyDown}
          placeholder="Take a note..."
          className="note-content-input"
          rows={4}
        />
      </div>

      <div className="note-card-footer">
        <span className="note-timestamp">
          {new Date(note.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>

        <div className="note-card-actions-bottom">
          <button
            onClick={onToggleFav}
            className={`note-action-btn bottom ${note.isPinned ? "pinned" : ""}`}
            title={note.isPinned ? "Unpin note" : "Pin note"}
            aria-pressed={note.isPinned}
          >
            <Star size={16} fill={note.isPinned ? "currentColor" : "none"} />
          </button>

          <button onClick={onDelete} className="note-action-btn note-delete-btn bottom" title="Delete note">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
