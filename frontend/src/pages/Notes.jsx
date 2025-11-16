import React, { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api";
import NavbarLeft from "../layout/NavbarLeft";
import NavbarTop from "../layout/NavbarTop";
import NoteCard from "../components/notes/NoteCard";
import { Plus } from "lucide-react";
import "../styles/Note.css";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: "", type: "", show: false });

  const showNotification = (message, type = "success") => {
    setNotification({ message, type, show: true });
    setTimeout(() => {
      setNotification({ message: "", type: "", show: false });
    }, 3000);
  };

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/notes", "GET");
      setNotes(data || []);
    } catch (err) {
      showNotification("Failed to fetch notes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Create empty note immediately when Add is clicked
  const createEmptyNote = async () => {
    try {
      // optimistic UI: add a temporary local note right away
      const tempId = `temp-${Date.now()}`;
      const tempNote = {
        _id: tempId,
        title: "",
        content: "",
        isPinned: false,
        createdAt: new Date().toISOString(),
        // any other fields your UI expects
      };
      setNotes((prev) => [tempNote, ...prev]);

      const created = await apiRequest("/notes", "POST", {
        title: "",
        content: "",
        isPinned: false,
      });

      // replace temp note with server note (or refresh if something odd)
      if (created && created._id) {
        setNotes((prev) => {
          return prev.map((n) => (n._id === tempId ? created : n));
        });
        showNotification("Note created successfully!");
      } else {
        // server didn't return expected item — refetch to sync
        fetchNotes();
      }
    } catch (e) {
      showNotification("Failed to create note", "error");
      fetchNotes(); // sync back to server state
    }
  };

  const updateNote = async (id, patch) => {
    try {
      setNotes((prev) => prev.map((n) => (n._id === id ? { ...n, ...patch } : n)));
      await apiRequest(`/notes/${id}`, "PUT", patch);
    } catch (e) {
      showNotification("Failed to update note", "error");
    }
  };

  const deleteNote = async (id) => {
    try {
      setNotes((prev) => prev.filter((n) => n._id !== id));
      await apiRequest(`/notes/${id}`, "DELETE");
      showNotification("Note deleted successfully!");
    } catch (e) {
      showNotification("Failed to delete note", "error");
      fetchNotes();
    }
  };

  const sortedNotes = useMemo(
    () => [...notes].sort((a, b) => Number(b.isPinned) - Number(a.isPinned)),
    [notes]
  );

  if (loading) {
    return <div className="notes-loading">Loading notes...</div>;
  }

  return (
    <div className="notes-container">
      {/* <NavbarLeft />
      <NavbarTop /> */}

      <div className="notes-header">
        <h1 className="notes-title">Notes</h1>
        <div className="notes-header-controls">
          {/* Direct create on click */}
          <button className="notes-add-btn" onClick={createEmptyNote}>
            <Plus size={20} />
            Add Note
          </button>
        </div>
      </div>

      <div className="notes-grid">
        {sortedNotes.map((note) => (
          <NoteCard
            key={note._id}
            note={note}
            onUpdate={(patch) => updateNote(note._id, patch)}
            onDelete={() => deleteNote(note._id)}
            onToggleFav={() => updateNote(note._id, { isPinned: !note.isPinned })}
          />
        ))}
      </div>

      {notes.length === 0 && (
        <div className="notes-empty-state">
          <h2>No notes yet</h2>
          <p>Create your first note to get started!</p>
        </div>
      )}

      {notification.show && <div className={`notes-notification ${notification.type}`}>{notification.message}</div>}
    </div>
  );
}
