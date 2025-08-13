const Note = require("../models/Note");

// Create a note (userId from req.user)
const createNote = async (req, res) => {
  try {
    const { title, content, color, isPinned } = req.body;
    const note = new Note({
      title,
      content,
      userId: req.user._id, // ✅ pulled from JWT
      color,
      isPinned,
    });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (err) {
    console.error("Create Note Error:", err);
    res.status(500).json({ error: "Failed to create note" });
  }
};

// Get all notes for the logged-in user
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id }).sort([
      ["isPinned", -1],
      ["updatedAt", -1],
    ]);
    res.json(notes);
  } catch (err) {
    console.error("Get Notes Error:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

// Update a note
const updateNote = async (req, res) => {
  try {
    // Ensure the note belongs to the logged-in user
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!note) return res.status(404).json({ error: "Note not found" });

    res.json(note);
  } catch (err) {
    console.error("Update Note Error:", err);
    res.status(500).json({ error: "Failed to update note" });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    const deleted = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deleted) return res.status(404).json({ error: "Note not found" });

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("Delete Note Error:", err);
    res.status(500).json({ error: "Failed to delete note" });
  }
};

module.exports = {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
};
