const Book = require('../models/Book');
const UserProgress = require('../models/UserProgress');

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Get single book
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Get all books merged with user progress
exports.getBooksWithUserProgress = async (req, res) => {
  try {
    const userId = req.user._id;

    // Exclude summary here
    const books = await Book.find({}).select("title author genre coverUrl");
    const progressList = await UserProgress.find({ userId });

    const progressMap = {};
    progressList.forEach(p => {
      progressMap[p.bookId.toString()] = p;
    });

    const result = books.map(book => {
      const progress = progressMap[book._id.toString()] || {};
      return {
        _id: book._id,
        title: book.title,
        author: book.author,
        genre: book.genre,
        coverUrl: book.coverUrl,
        progress: progress.progress || 0,
        status: progress.status || 'not_started',
        bookmarked: progress.bookmarked || false,
        lastReadSection: progress.lastReadSection || 0
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};
