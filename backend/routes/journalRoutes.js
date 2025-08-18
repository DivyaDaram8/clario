const express = require("express");
const router = express.Router();
const {
  getJournalByDate,
  createOrUpdateJournal,
  updateJournal,
  deleteJournal,
} = require("../controllers/journalController");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

// Get journal for a date
router.get("/", getJournalByDate);

// Create journal for a date
router.post("/", createOrUpdateJournal);

// Update journal
router.put("/:id", updateJournal);

// Delete journal
router.delete("/:id", deleteJournal);

module.exports = router;
