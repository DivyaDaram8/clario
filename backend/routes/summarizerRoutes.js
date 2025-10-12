const express = require("express");
const multer = require("multer");
const { summarizeText, summarizeDocs } = require("../controllers/summarizerController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Text summarization
router.post("/", summarizeText);

// Document summarization
router.post("/docs", upload.single("file"), summarizeDocs);

module.exports = router;
