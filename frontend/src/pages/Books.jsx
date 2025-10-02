import React, { useState } from 'react';
import NavbarLeft from '../layout/NavbarLeft';
import NavbarTop from '../layout/NavbarTop';

function Books() {
  const [view, setView] = useState('library'); // 'library' or 'reading'
  const [selectedBook, setSelectedBook] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentSection, setCurrentSection] = useState(0);

  // Dummy data with new format
  const books = [
    {
      id: 1,
      title: 'Atomic Habits',
      author: 'James Clear',
      genre: 'Self-help',
      coverUrl:
        'https://images-na.ssl-images-amazon.com/images/I/51-nXsSRfZL._SX329_BO1,204,203,200_.jpg',
      progress: 40,
      status: 'In Progress',
      bookmarked: true,
      summary: [
        { sectionIndex: 1, title: 'Introduction', content: 'Atomic habits focuses on the power of tiny changes...' },
        { sectionIndex: 2, title: 'Why Small Habits Matter', content: 'Habits compound over time and shape identity...' },
        { sectionIndex: 3, title: 'Four Laws of Behavior Change', content: 'Make it obvious, attractive, easy, and satisfying...' },
        { sectionIndex: 4, title: 'Identity-Based Habits', content: 'Shift focus from outcomes to identity...' },
        { sectionIndex: 5, title: 'Environment & Systems', content: 'Environment cues can make or break habits...' },
        { sectionIndex: 6, title: 'Applications & Real Life Stories', content: 'Examples of habits improving performance...' },
        { sectionIndex: 7, title: 'Conclusion', content: 'Small consistent changes lead to remarkable results...' }
      ]
    },
    {
      id: 2,
      title: 'Ikigai',
      author: 'Héctor García & Francesc Miralles',
      genre: 'Self-help',
      coverUrl:
        'https://images-na.ssl-images-amazon.com/images/I/41H+uNENtXL._SX331_BO1,204,203,200_.jpg',
      progress: 0,
      status: 'Not Started',
      bookmarked: false,
      summary: [
        { sectionIndex: 1, title: 'Introduction', content: 'Ikigai is a Japanese concept meaning reason for being...' },
        { sectionIndex: 2, title: 'The Art of Staying Young', content: 'Lifestyle habits for longevity...' },
        { sectionIndex: 3, title: 'Finding Your Ikigai', content: 'Intersecting passion, vocation, mission, profession...' }
      ]
    }
  ];

  const filters = ['All', 'Self-help', 'Completed', 'In Progress', 'Bookmarked'];

  // Filtered books
  const filteredBooks = books.filter((book) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Bookmarked') return book.bookmarked;
    if (activeFilter === 'Completed') return book.status === 'Completed';
    if (activeFilter === 'In Progress') return book.status === 'In Progress';
    return book.genre === activeFilter;
  });

  // Section navigation
  const goToPreviousSection = () => {
    if (currentSection > 0) setCurrentSection(currentSection - 1);
  };

  const goToNextSection = () => {
    if (selectedBook && currentSection < selectedBook.summary.length - 1)
      setCurrentSection(currentSection + 1);
  };

  return (
    <div className="flex">
      <NavbarLeft />
      <div className="flex-1">
        <NavbarTop />
        <div className="ml-64 mt-16 p-6">
          {view === 'library' && (
            <>
              <h1 className="text-3xl font-bold mb-6">Library</h1>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-6">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    className={`px-4 py-2 rounded-lg transition ${
                      activeFilter === filter
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Book Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden"
                    onClick={() => {
                      setSelectedBook(book);
                      setCurrentSection(0);
                      setView('reading');
                    }}
                  >
                    <div className="h-64 overflow-hidden">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover transform hover:scale-105 transition duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h2 className="text-xl font-semibold mb-1">{book.title}</h2>
                      <p className="text-gray-600 mb-2">{book.author}</p>
                      <p className="text-sm text-gray-500 mb-3">{book.genre}</p>

                      {/* Progress Bar */}
                      <div className="mb-2">
                        <div className="w-full bg-gray-200 h-2 rounded-full">
                          <div
                            className={`h-2 rounded-full ${
                              book.status === 'Completed'
                                ? 'bg-green-500'
                                : book.status === 'In Progress'
                                ? 'bg-blue-500'
                                : 'bg-gray-400'
                            }`}
                            style={{ width: `${book.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{book.status}</p>
                      </div>

                      {/* Bookmark */}
                      <div>
                        {book.bookmarked ? (
                          <span className="text-yellow-500 font-medium">★ Bookmarked</span>
                        ) : (
                          <span className="text-gray-400 font-medium">☆ Bookmark</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {view === 'reading' && selectedBook && (
            <div className="max-w-4xl mx-auto">
              {/* Back Button */}
              <button
                className="mb-6 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                onClick={() => setView('library')}
              >
                ← Back to Library
              </button>

              {/* Header */}
              <div className="sticky top-16 bg-white z-10 py-4 mb-6 border-b flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">{selectedBook.title}</h2>
                  <p className="text-gray-600">{selectedBook.author}</p>
                </div>
                <button className="px-3 py-1 bg-yellow-400 rounded-lg hover:bg-yellow-500 transition">
                  ★ Bookmark
                </button>
              </div>

              {/* Progress */}
              <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${
                      ((currentSection + 1) / selectedBook.summary.length) * 100
                    }%`
                  }}
                ></div>
              </div>

              {/* Current Section */}
              <div className="p-6 border rounded-lg shadow-sm bg-gray-50 mb-12">
                <h3 className="text-xl font-semibold mb-2">
                  {selectedBook.summary[currentSection].title}
                </h3>
                <p className="text-gray-800 text-lg">{selectedBook.summary[currentSection].content}</p>
              </div>

              {/* Footer Navigation */}
              <div className="sticky bottom-0 bg-white py-4 border-t flex justify-between items-center">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                  onClick={goToPreviousSection}
                  disabled={currentSection === 0}
                >
                  ← Previous Section
                </button>
                <p>
                  Section {currentSection + 1} of {selectedBook.summary.length} (
                  {Math.round(((currentSection + 1) / selectedBook.summary.length) * 100)}%)
                </p>
                <button
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                  onClick={goToNextSection}
                  disabled={currentSection === selectedBook.summary.length - 1}
                >
                  Next Section →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Books;
