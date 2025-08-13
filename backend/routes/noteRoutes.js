const express = require("express");
const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes are protected
router.post("/", protect, createNote);
router.get("/", protect, getNotes);
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);

module.exports = router;
