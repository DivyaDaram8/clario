const express = require("express");
const multer = require("multer");
const { summarizeText, summarizeDocs } = require("../controllers/summarizerController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Text summarization - protected
router.post("/", protect, summarizeText);

// Document summarization - protected
router.post("/docs", protect, upload.single("file"), summarizeDocs);

module.exports = router;