import { useEffect, useState } from "react";
import { apiRequest } from "../api";
import NoteForm from "../components/notes/NoteForm";
import NoteCard from "../components/notes/NoteCard";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/notes", "GET");
      setNotes(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (noteData) => {
    await apiRequest("/notes", "POST", noteData);
    fetchNotes();
  };

  const updateNote = async (noteData) => {
    await apiRequest(`/notes/${editingNote._id}`, "PUT", noteData);
    setEditingNote(null);
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await apiRequest(`/notes/${id}`, "DELETE");
    fetchNotes();
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h1>Your Notes</h1>

      <NoteForm
        onSubmit={editingNote ? updateNote : addNote}
        initialData={editingNote}
        onCancel={() => setEditingNote(null)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : notes.length === 0 ? (
        <p>No notes yet</p>
      ) : (
        notes
          .sort((a, b) => b.isPinned - a.isPinned) // pinned notes first
          .map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={(n) => setEditingNote(n)}
              onDelete={deleteNote}
            />
          ))
      )}
    </div>
  );
}
