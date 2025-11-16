const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getUserProgress,
  updateProgress,
  toggleBookmark
} = require('../controllers/userProgressController');

// Protected
router.get('/', protect, getUserProgress); // Get all progress for logged in user
router.put('/:bookId', protect, updateProgress); // Update progress for a book
router.patch('/:bookId/bookmark', protect, toggleBookmark); // Toggle bookmark

module.exports = router;