import { useState, useEffect } from 'react';
import { BookOpen, Bookmark, ChevronLeft, ChevronRight, Filter, X, List, Sparkles } from 'lucide-react';
import NavbarLeft from "../layout/NavbarLeft";
import NavbarTop from "../layout/NavbarTop";
import { apiRequest } from "../api";

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

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'text-green-400';
      case 'in_progress': return 'text-blue-400';
      default: return 'text-gray-400';
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
      <div className="flex h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <NavbarLeft />
        <div className="flex-1 flex flex-col">
          <NavbarTop />
          <div className="flex-1 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-blue-500/30 animate-pulse"></div>
              <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl p-12 border border-white/20">
                <Sparkles className="w-16 h-16 text-blue-300 animate-spin mx-auto mb-4" />
                <p className="text-white text-2xl font-semibold">Loading your library...</p>
              </div>
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
      <div className="flex h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
        <NavbarLeft />
        <div className="flex-1 flex flex-col overflow-hidden">
          <NavbarTop />
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-5xl mx-auto">
              {/* Header Card */}
              <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-4 md:p-6 mb-6 border border-white/20 shadow-2xl animate-slide-down">
                <button
                  onClick={closeBook}
                  className="mb-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 text-white flex items-center gap-2 hover:scale-105 hover:shadow-lg"
                >
                  <ChevronLeft size={20} /> Back to Library
                </button>
                
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                      {selectedBook.title}
                    </h1>
                    <p className="text-lg md:text-xl text-blue-200 mb-3">by {selectedBook.author}</p>
                    <span className="inline-block px-4 py-1 bg-purple-500/30 rounded-full text-purple-200 text-sm backdrop-blur-sm border border-purple-300/20">
                      {selectedBook.genre}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => toggleBookmark(selectedBook._id)}
                    disabled={bookmarkLoading === selectedBook._id}
                    className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-110 hover:rotate-12 disabled:opacity-50"
                  >
                    <Bookmark
                      size={24}
                      className={`transition-all ${selectedBook.bookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-white'} ${bookmarkLoading === selectedBook._id ? 'animate-pulse' : ''}`}
                    />
                  </button>
                </div>
              </div>

              {/* Table of Contents OR Current Section */}
              {showTableOfContents ? (
                <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-4 md:p-6 mb-6 border border-white/20 shadow-2xl animate-fade-in-up">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-2">
                    <BookOpen size={28} className="text-blue-300" /> 
                    <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                      Table of Contents
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedBook.summary.map((section, idx) => {
                      const isRead = idx < (selectedBook.lastReadSection || 0);
                      return (
                        <button
                          key={idx}
                          onClick={() => selectSection(idx)}
                          className={`text-left p-4 rounded-xl transition-all duration-300 flex items-center justify-between group relative overflow-hidden ${
                            isRead 
                              ? 'bg-green-500/20 border border-green-400/30' 
                              : 'bg-white/10 border border-white/20'
                          } hover:bg-white/20 hover:scale-[1.02] hover:shadow-lg`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <span className="relative z-10 flex items-center gap-3">
                            <span className={`font-bold text-lg ${isRead ? 'text-green-300' : 'text-blue-300'}`}>
                              {idx + 1}.
                            </span>
                            <span className={`font-medium ${isRead ? 'text-green-100' : 'text-blue-100'}`}>
                              {section.title}
                            </span>
                          </span>
                          <ChevronRight 
                            size={20} 
                            className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 text-blue-300 relative z-10" 
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 md:p-8 mb-6 border border-white/20 shadow-2xl animate-fade-in-up">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                    <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                      {selectedBook.summary[currentSection].title}
                    </h3>
                    <button
                      onClick={backToTableOfContents}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 text-white flex items-center gap-2 text-sm hover:scale-105 whitespace-nowrap"
                    >
                      <List size={18} /> Contents
                    </button>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <div className="text-base md:text-lg text-blue-50 leading-relaxed whitespace-pre-wrap">
                      {selectedBook.summary[currentSection].content}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Bar */}
              <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-4 md:p-6 border border-white/20 shadow-2xl sticky bottom-4 animate-slide-up">
                <div className="flex items-center justify-between mb-4 gap-2">
                  <button
                    onClick={() => navigateSection(-1)}
                    className="px-4 md:px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all duration-300 bg-blue-500/40 text-white hover:bg-blue-500/60 hover:scale-105 hover:shadow-lg text-sm md:text-base"
                  >
                    <ChevronLeft size={20} /> 
                    <span className="hidden sm:inline">{showTableOfContents ? 'Previous' : 'Back'}</span>
                  </button>

                  <div className="text-center flex-1">
                    <p className="text-white font-semibold text-sm md:text-lg">
                      {showTableOfContents 
                        ? 'Table of Contents' 
                        : `Section ${currentSection + 1} of ${totalSections}`
                      }
                    </p>
                    <p className="text-blue-200 text-xs md:text-sm">{completionPercentage}% Complete</p>
                  </div>

                  <button
                    onClick={() => navigateSection(1)}
                    disabled={!showTableOfContents && currentSection === totalSections - 1}
                    className={`px-4 md:px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all duration-300 text-sm md:text-base ${
                      !showTableOfContents && currentSection === totalSections - 1
                        ? 'bg-gray-500/30 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500/40 text-white hover:bg-blue-500/60 hover:scale-105 hover:shadow-lg'
                    }`}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  <div
                    className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 h-full transition-all duration-500 rounded-full relative z-10"
                    style={{ width: `${completionPercentage}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse-slow"></div>
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
    <div className="flex h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      <NavbarLeft />
      <div className="flex-1 flex flex-col overflow-hidden">
        <NavbarTop />
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Your Library
              </h1>
              <p className="text-lg md:text-xl text-blue-200">Read any book in 5-10 minutes ⚡</p>
            </div>

            {/* Filters */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-4 md:p-6 mb-8 border border-white/20 shadow-2xl animate-slide-down">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                  <Filter size={24} className="text-blue-300" /> 
                  <span>Filters</span>
                </h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all hover:scale-110"
                >
                  {showFilters ? <X size={20} className="text-white" /> : <Filter size={20} className="text-white" />}
                </button>
              </div>
              
              <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-300 ${showFilters ? 'block' : 'hidden md:grid'}`}>
                <div>
                  <label className="block text-blue-200 mb-2 font-semibold text-sm">Genre</label>
                  <select
                    value={filters.genre}
                    onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all backdrop-blur-sm"
                  >
                    {uniqueGenres.map(genre => (
                      <option key={genre} value={genre} className="bg-gray-900">
                        {genre === 'all' ? 'All Genres' : genre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-blue-200 mb-2 font-semibold text-sm">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all backdrop-blur-sm"
                  >
                    <option value="all" className="bg-gray-900">All Status</option>
                    <option value="not_started" className="bg-gray-900">Not Started</option>
                    <option value="in_progress" className="bg-gray-900">In Progress</option>
                    <option value="completed" className="bg-gray-900">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-blue-200 mb-2 font-semibold text-sm">Bookmarked</label>
                  <select
                    value={filters.bookmarked}
                    onChange={(e) => setFilters({ ...filters, bookmarked: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all backdrop-blur-sm"
                  >
                    <option value="all" className="bg-gray-900">All Books</option>
                    <option value="true" className="bg-gray-900">Bookmarked Only</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Books Grid */}
            {filteredBooks.length === 0 ? (
              <div className="text-center py-20 animate-fade-in">
                <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-12 border border-white/20 inline-block">
                  <BookOpen className="w-20 h-20 text-blue-300 mx-auto mb-4 opacity-50" />
                  <p className="text-2xl text-white font-semibold">No books found</p>
                  <p className="text-blue-200 mt-2">Try adjusting your filters</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.map((book, idx) => (
                  <div
                    key={book._id}
                    className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 md:p-5 border border-white/20 shadow-2xl hover:scale-105 hover:bg-white/20 transition-all duration-300 cursor-pointer animate-fade-in group relative overflow-hidden"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                    onClick={() => openBook(book._id)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
                    
                    <div className="relative mb-4">
                      <img
                        src={book.coverUrl || 'https://via.placeholder.com/200x300?text=No+Cover'}
                        alt={book.title}
                        className="w-full h-64 object-cover rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300"
                        loading="lazy"
                      />
                      <button
                        onClick={(e) => toggleBookmark(book._id, e)}
                        disabled={bookmarkLoading === book._id}
                        className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all hover:scale-110 hover:rotate-12 disabled:opacity-50"
                      >
                        <Bookmark
                          size={20}
                          className={`transition-all ${book.bookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-white'} ${bookmarkLoading === book._id ? 'animate-pulse' : ''}`}
                        />
                      </button>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold text-white mb-1 line-clamp-2 relative z-10">
                      {book.title}
                    </h3>
                    <p className="text-blue-200 mb-3 text-sm relative z-10">{book.author}</p>
                    
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <span className="px-3 py-1 bg-purple-500/30 rounded-full text-purple-200 text-xs backdrop-blur-sm border border-purple-300/20">
                        {book.genre}
                      </span>
                      <span className={`text-xs md:text-sm font-semibold ${getStatusColor(book.status)}`}>
                        {getStatusText(book.status)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden mb-2 relative z-10">
                      <div
                        className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 h-full transition-all duration-500 rounded-full"
                        style={{ width: `${book.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-right text-blue-200 text-xs md:text-sm relative z-10">
                      {book.progress}% complete
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}