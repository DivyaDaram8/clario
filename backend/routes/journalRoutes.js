const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const { protect } = require('../middleware/authMiddleware'); // Assuming auth middleware exists

// Journal entry routes
router.post('/entry', protect, journalController.saveJournalEntry);
router.get('/entry/:date', protect, journalController.getJournalEntry);

// Streak routes
router.get('/streak/:year/:month', protect, journalController.getStreakData);

// Statistics routes
router.get('/statistics/:year/:month', protect, journalController.getMonthlyStatistics);

// Mood category routes
router.get('/categories', protect, journalController.getMoodCategories);
router.post('/categories', protect, journalController.addMoodCategory);
router.put('/categories/:categoryId', protect, journalController.updateMoodCategory);
router.delete('/categories/:categoryId', protect, journalController.deleteMoodCategory);

module.exports = router;
