const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getAllBooks,
  getBookById,
  getBooksWithUserProgress
} = require('../controllers/bookController');

// Public
router.get('/', getAllBooks); // All books
router.get('/:id', getBookById); // One book

// Protected
router.get('/user/progress/all', protect, getBooksWithUserProgress); // All books + user's progress

module.exports = router;