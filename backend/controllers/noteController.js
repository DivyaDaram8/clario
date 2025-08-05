const Note = require("../models/Note");

const createNote = async (req, res) => {
  try {
    const { title, content, userId, color, isPinned } = req.body;
    const note = new Note({ title, content, userId, color, isPinned });
    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (err) {
    console.error("Create Note Error:", err);
    res.status(500).json({ error: "Failed to create note" });
  }
};

const getNotes = async (req, res) => {
  try {
    const { userId } = req.params;
    const notes = await Note.find({ userId }).sort([
      ["isPinned", -1],
      ["updatedAt", -1],
    ]);
    res.json(notes);
  } catch (err) {
    console.error("Get Notes Error:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

const updateNote = async (req, res) => {
  try {
    const updated = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    console.error("Update Note Error:", err);
    res.status(500).json({ error: "Failed to update note" });
  }
};

const deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
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
