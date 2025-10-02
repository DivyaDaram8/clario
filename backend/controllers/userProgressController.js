const UserProgress = require('../models/UserProgress');
const Book = require('../models/Book');

// Get all progress for logged in user
exports.getUserProgress = async (req, res) => {
  try {
    const progress = await UserProgress.find({ userId: req.user._id })
      .populate('bookId', 'title author genre coverUrl');
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Update progress for a book
exports.updateProgress = async (req, res) => {
  try {
    const { lastReadSection } = req.body;
    const { bookId } = req.params;
    const userId = req.user._id;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    const totalSections = book.summary.length;
    const progress = Math.floor((lastReadSection / totalSections) * 100);

    let status = 'in_progress';
    if (lastReadSection === 0) status = 'not_started';
    if (lastReadSection >= totalSections) status = 'completed';

    const updated = await UserProgress.findOneAndUpdate(
      { userId, bookId },
      { lastReadSection, progress, status },
      { upsert: true, new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Toggle bookmark for a book
exports.toggleBookmark = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user._id;

    let progress = await UserProgress.findOne({ userId, bookId });

    if (!progress) {
      progress = await UserProgress.create({
        userId,
        bookId,
        bookmarked: true
      });
      return res.json(progress);
    }

    progress.bookmarked = !progress.bookmarked;
    await progress.save();
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};
