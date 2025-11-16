import { useState, useEffect } from 'react';
import { BookOpen, Bookmark, ChevronLeft, ChevronRight, Filter, X, List, Sparkles } from 'lucide-react';
import NavbarLeft from "../layout/NavbarLeft";
import NavbarTop from "../layout/NavbarTop";
import { apiRequest } from "../api";
import '../styles/Books.css';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  const [showTableOfContents, setShowTableOfContents] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(null);
  
  const [filters, setFilters] = useState({
    genre: 'all',
    status: 'all',
    bookmarked: 'all'
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, books]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/books/user/progress/all');
      setBooks(data);
      setFilteredBooks(data);
    } catch (err) {
      console.error('Error fetching books:', err);
      alert('Failed to load books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...books];
    
    if (filters.genre !== 'all') {
      filtered = filtered.filter(book => book.genre.toLowerCase() === filters.genre.toLowerCase());
    }
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(book => book.status === filters.status);
    }
    
    if (filters.bookmarked === 'true') {
      filtered = filtered.filter(book => book.bookmarked === true);
    }
    
    setFilteredBooks(filtered);
  };

  const toggleBookmark = async (bookId, e) => {
    if (e) e.stopPropagation();
    
    try {
      setBookmarkLoading(bookId);
      const response = await apiRequest(`/userProgress/${bookId}/bookmark`, 'PATCH');
      
      setBooks(prevBooks => prevBooks.map(book => 
        book._id === bookId ? { ...book, bookmarked: response.bookmarked } : book
      ));

      if (selectedBook && selectedBook._id === bookId) {
        setSelectedBook(prev => ({ ...prev, bookmarked: response.bookmarked }));
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      alert('Failed to update bookmark. Please try again.');
    } finally {
      setBookmarkLoading(null);
    }
  };

  const openBook = async (bookId) => {
    try {
      const bookData = await apiRequest(`/books/${bookId}`);
      const userProgress = books.find(b => b._id === bookId);
      
      setSelectedBook({
        ...bookData,
        progress: userProgress?.progress || 0,
        status: userProgress?.status || 'not_started',
        bookmarked: userProgress?.bookmarked || false,
        lastReadSection: userProgress?.lastReadSection || 0
      });
      
      const lastSection = userProgress?.lastReadSection || 0;
      if (lastSection > 0 && lastSection < bookData.summary.length) {
        setCurrentSection(lastSection);
        setShowTableOfContents(false);
      } else {
        setCurrentSection(null);
        setShowTableOfContents(true);
      }
    } catch (err) {
      console.error('Error opening book:', err);
      alert('Failed to open book. Please try again.');
    }
  };

  const updateProgress = async (sectionIndex) => {
    if (!selectedBook) return;
    
    try {
      const response = await apiRequest(
        `/userProgress/${selectedBook._id}`, 
        'PUT', 
        { lastReadSection: sectionIndex }
      );
      
      setBooks(prevBooks => prevBooks.map(book => 
        book._id === selectedBook._id 
          ? { 
              ...book, 
              progress: response.progress, 
              status: response.status, 
              lastReadSection: response.lastReadSection 
            }
          : book
      ));
      
      setSelectedBook(prev => ({
        ...prev,
        progress: response.progress,
        status: response.status,
        lastReadSection: response.lastReadSection
      }));

      return response;
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  const selectSection = async (sectionIndex) => {
    setCurrentSection(sectionIndex);
    setShowTableOfContents(false);
    await updateProgress(sectionIndex + 1);
  };

  const navigateSection = async (direction) => {
    if (currentSection === null) {
      if (direction === 1 && selectedBook.summary.length > 0) {
        await selectSection(0);
      }
      return;
    }

    const newSection = currentSection + direction;
    
    if (newSection < 0) {
      setShowTableOfContents(true);
      setCurrentSection(null);
    } else if (newSection >= selectedBook.summary.length) {
      return;
    } else {
      await selectSection(newSection);
    }
  };

  const backToTableOfContents = () => {
    setShowTableOfContents(true);
    setCurrentSection(null);
  };

  const closeBook = () => {
    setSelectedBook(null);
    setCurrentSection(null);
    setShowTableOfContents(true);
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'completed': return 'completed';
      case 'in_progress': return 'in-progress';
      default: return 'not-started';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      default: return 'Not Started';
    }
  };

  const uniqueGenres = ['all', ...new Set(books.map(b => b.genre))];

  if (loading) {
    return (
      <div className="books-loading">
        {/* <NavbarLeft /> */}
        <div className="books-main">
          {/* <NavbarTop /> */}
          <div className="books-loading-content">
            <div className="books-loading-blur"></div>
            <div className="books-loading-card">
              <Sparkles className="books-loading-icon" />
              <p className="books-loading-text">Loading your library...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedBook) {
    const totalSections = selectedBook.summary.length;
    const completionPercentage = currentSection !== null 
      ? Math.round(((currentSection + 1) / totalSections) * 100)
      : selectedBook.progress;

    return (
      <div className="books-reader">
        <NavbarLeft />
        <div className="books-main">
          <NavbarTop />
          <div className="books-reader-content">
            <div className="books-reader-inner">
              {/* Header Card */}
              <div className="books-reader-header-card">
                <button onClick={closeBook} className="books-back-btn">
                  <ChevronLeft size={20} /> Back to Library
                </button>
                
                <div className="books-reader-header">
                  <div className="books-reader-info">
                    <h1 className="books-reader-title">{selectedBook.title}</h1>
                    <p className="books-reader-author">by {selectedBook.author}</p>
                    <span className="books-reader-genre">{selectedBook.genre}</span>
                  </div>
                  
                  <button
                    onClick={() => toggleBookmark(selectedBook._id)}
                    disabled={bookmarkLoading === selectedBook._id}
                    className="books-reader-bookmark"
                  >
                    <Bookmark
                      size={24}
                      className={`books-bookmark-icon ${selectedBook.bookmarked ? 'bookmarked' : ''} ${bookmarkLoading === selectedBook._id ? 'loading' : ''}`}
                    />
                  </button>
                </div>
              </div>

              {/* Table of Contents OR Current Section */}
              {showTableOfContents ? (
                <div className="books-toc-card">
                  <h2 className="books-toc-title">
                    <BookOpen size={28} className="books-toc-icon" /> 
                    <span className="books-toc-gradient-text">Table of Contents</span>
                  </h2>
                  <div className="books-toc-list">
                    {selectedBook.summary.map((section, idx) => {
                      const isRead = idx < (selectedBook.lastReadSection || 0);
                      return (
                        <button
                          key={idx}
                          onClick={() => selectSection(idx)}
                          className={`books-toc-item ${isRead ? 'read' : ''}`}
                        >
                          <span className="books-toc-item-content">
                            <span className="books-toc-item-number">{idx + 1}.</span>
                            <span className="books-toc-item-title">{section.title}</span>
                          </span>
                          <ChevronRight size={20} className="books-toc-item-arrow" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="books-section-card">
                  <div className="books-section-header">
                    <h3 className="books-section-title">
                      {selectedBook.summary[currentSection].title}
                    </h3>
                    <button onClick={backToTableOfContents} className="books-toc-btn">
                      <List size={18} /> Contents
                    </button>
                  </div>
                  <div className="books-section-content">
                    {selectedBook.summary[currentSection].content}
                  </div>
                </div>
              )}

              {/* Navigation Bar */}
              <div className="books-nav-card">
                <div className="books-nav-controls">
                  <button onClick={() => navigateSection(-1)} className="books-nav-btn">
                    <ChevronLeft size={20} /> 
                    <span className="desktop-only">{showTableOfContents ? 'Previous' : 'Back'}</span>
                  </button>

                  <div className="books-nav-info">
                    <p className="books-nav-position">
                      {showTableOfContents 
                        ? 'Table of Contents' 
                        : `Section ${currentSection + 1} of ${totalSections}`
                      }
                    </p>
                    <p className="books-nav-progress-text">{completionPercentage}% Complete</p>
                  </div>

                  <button
                    onClick={() => navigateSection(1)}
                    disabled={!showTableOfContents && currentSection === totalSections - 1}
                    className="books-nav-btn"
                  >
                    <span className="desktop-only">Next</span>
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="books-nav-progress-bar-container">
                  <div className="books-nav-progress-shimmer"></div>
                  <div
                    className="books-nav-progress-bar-fill"
                    style={{ width: `${completionPercentage}%` }}
                  >
                    <div className="books-nav-progress-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="books-container">
      <NavbarLeft />
      <div className="books-main">
        <NavbarTop />
        <div className="books-content">
          <div className="books-content-inner">
            {/* Header */}
            <div className="books-library-header">
              <h1 className="books-library-title">Your Library</h1>
              <p className="books-library-subtitle">Read any book in 5-10 minutes ⚡</p>
            </div>

            {/* Filters */}
            <div className="books-filters-card">
              <div className="books-filters-header">
                <h2 className="books-filters-title">
                  <Filter size={24} className="books-filters-icon" /> 
                  <span>Filters</span>
                </h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="books-filters-toggle"
                >
                  {showFilters ? <X size={20} /> : <Filter size={20} />}
                </button>
              </div>
              
              <div className={`books-filters-grid ${showFilters ? '' : 'mobile-hidden'}`}>
                <div className="books-filter-group">
                  <label>Genre</label>
                  <select
                    value={filters.genre}
                    onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
                    className="books-filter-select"
                  >
                    {uniqueGenres.map(genre => (
                      <option key={genre} value={genre}>
                        {genre === 'all' ? 'All Genres' : genre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="books-filter-group">
                  <label>Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="books-filter-select"
                  >
                    <option value="all">All Status</option>
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="books-filter-group">
                  <label>Bookmarked</label>
                  <select
                    value={filters.bookmarked}
                    onChange={(e) => setFilters({ ...filters, bookmarked: e.target.value })}
                    className="books-filter-select"
                  >
                    <option value="all">All Books</option>
                    <option value="true">Bookmarked Only</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Books Grid */}
            {filteredBooks.length === 0 ? (
              <div className="books-empty-state">
                <div className="books-empty-card">
                  <BookOpen className="books-empty-icon" />
                  <p className="books-empty-title">No books found</p>
                  <p className="books-empty-subtitle">Try adjusting your filters</p>
                </div>
              </div>
            ) : (
              <div className="books-grid">
                {filteredBooks.map((book, idx) => (
                  <div
                    key={book._id}
                    className="books-card"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                    onClick={() => openBook(book._id)}
                  >
                    <div className="books-cover-container">
                      <img
                        src={book.coverUrl || 'https://via.placeholder.com/200x300?text=No+Cover'}
                        alt={book.title}
                        className="books-cover"
                        loading="lazy"
                      />
                      <button
                        onClick={(e) => toggleBookmark(book._id, e)}
                        disabled={bookmarkLoading === book._id}
                        className="books-bookmark-btn"
                      >
                        <Bookmark
                          size={20}
                          className={`books-bookmark-icon ${book.bookmarked ? 'bookmarked' : ''} ${bookmarkLoading === book._id ? 'loading' : ''}`}
                        />
                      </button>
                    </div>

                    <div className="books-card-content">
                      <h3 className="books-title">{book.title}</h3>
                      <p className="books-author">{book.author}</p>
                      
                      <div className="books-meta">
                        <span className="books-genre-badge">{book.genre}</span>
                        <span className={`books-status ${getStatusClass(book.status)}`}>
                          {getStatusText(book.status)}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="books-progress-container">
                        <div
                          className="books-progress-bar"
                          style={{ width: `${book.progress}%` }}
                        ></div>
                      </div>
                      <p className="books-progress-text">{book.progress}% complete</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}