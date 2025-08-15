const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const ctrl = require("../controllers/pomodoroController");

// SETTINGS
router.get("/settings", protect, ctrl.getSettings);
router.put("/settings", protect, ctrl.updateSettings);

// SESSIONS
router.post("/session/start", protect, ctrl.startSession);
router.post("/session/complete", protect, ctrl.completeSession);

// STATS
router.get("/stats", protect, ctrl.getStats);

module.exports = router;
