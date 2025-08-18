const Journal = require("../models/Journal");

// Normalize input date to midnight
const normalizeDate = (date) => {
  const d = date ? new Date(date) : new Date();
  return new Date(d.setHours(0, 0, 0, 0));
};

// @desc    Get journal for a specific date (default today)
// @route   GET /api/journals?date=YYYY-MM-DD
// @access  Private
const getJournalByDate = async (req, res) => {
  try {
    const normalizedDate = normalizeDate(req.query.date);

    const journal = await Journal.findOne({
      userId: req.user._id,
      date: normalizedDate,
    });

    if (!journal) {
      return res.status(404).json({ message: "No journal found for this date" });
    }

    res.status(200).json(journal);
  } catch (error) {
    console.error("Get Journal Error:", error);
    res.status(500).json({ message: "Failed to fetch journal" });
  }
};

// @desc    Create journal for a date (only one allowed per day)
// @route   POST /api/journals
// @access  Private
const createOrUpdateJournal = async (req, res) => {
  try {
    const { title, content, pageColor, mood } = req.body;
    // if no date provided, default to today
    const normalizedDate = normalizeDate(req.body.date);

    // Prevent future dates
    const today = normalizeDate();
    if (normalizedDate > today) {
      return res.status(400).json({ message: "Cannot create journal for future dates" });
    }

    // Check if journal already exists for that date
    const existing = await Journal.findOne({
      userId: req.user._id,
      date: normalizedDate,
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "Journal already exists for this day. Please update it instead." });
    }

    const journal = await Journal.create({
      title: title || "",
      content: content || {},
      pageColor: pageColor || "#ffffff",
      mood: mood || "neutral 😐",
      userId: req.user._id,
      date: normalizedDate, // always set
    });

    res.status(201).json(journal);
  } catch (error) {
    console.error("Create Journal Error:", error);
    res.status(500).json({ message: "Failed to create journal" });
  }
};


// @desc    Update journal by ID
// @route   PUT /api/journals/:id
// @access  Private
const updateJournal = async (req, res) => {
  try {
    const journal = await Journal.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    journal.title = req.body.title ?? journal.title;
    journal.content = req.body.content ?? journal.content;
    journal.pageColor = req.body.pageColor ?? journal.pageColor;
    journal.mood = req.body.mood ?? journal.mood;

    await journal.save(); // triggers pre-save hook

    res.status(200).json(journal);
  } catch (error) {
    console.error("Update Journal Error:", error);
    res.status(500).json({ message: "Failed to update journal" });
  }
};

// @desc    Delete journal by ID
// @route   DELETE /api/journals/:id
// @access  Private
const deleteJournal = async (req, res) => {
  try {
    const deleted = await Journal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Journal not found" });
    }

    res.status(200).json({ message: "Journal deleted successfully" });
  } catch (error) {
    console.error("Delete Journal Error:", error);
    res.status(500).json({ message: "Failed to delete journal" });
  }
};

module.exports = {
  getJournalByDate,
  createOrUpdateJournal,
  updateJournal,
  deleteJournal,
};
