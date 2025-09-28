import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaCalendarAlt, 
  FaBold, 
  FaItalic, 
  FaUnderline, 
  FaStrikethrough, 
  FaListUl, 
  FaFont, 
  FaSearch,
  FaBookmark,
  FaSave,
  FaTrash,
  FaEdit,
  FaMoon,
  FaSun,
  FaChevronLeft,
  FaChevronRight,
  FaTags,
  FaSmile,
  FaImage,
  FaLink,
  FaQuoteLeft,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaPalette,
  FaEllipsisV,
  FaHeart,
  FaStar,
  FaFlag
} from 'react-icons/fa';

// Mock data for demonstration
const mockEntries = [
  {
    id: 1,
    date: new Date(),
    title: "Today's Reflections",
    content: "Had a wonderful day exploring new ideas and concepts. The weather was perfect for a walk in the park.",
    mood: "😊",
    tags: ["personal", "reflections"],
    color: "#FFD93D",
    bookmarked: true
  },
  {
    id: 2,
    date: new Date(Date.now() - 86400000),
    title: "Learning Journey",
    content: "Spent time learning React and exploring new frontend technologies. Making good progress!",
    mood: "🚀",
    tags: ["learning", "tech"],
    color: "#4D96FF",
    bookmarked: false
  }
];

export default function Journal() {
  // State management
  const [entries, setEntries] = useState(mockEntries);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState('😊');
  const [entryTitle, setEntryTitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [entryTags, setEntryTags] = useState([]);
  const [entryColor, setEntryColor] = useState('#FFD93D');
  
  // UI state
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);

  // Constants
  const colors = ["#FFD93D", "#FF6B6B", "#6BCB77", "#4D96FF", "#9D4EDD", "#FF8E72", "#20BF6B", "#FA8231"];
  const moods = ["😊", "😔", "😡", "😴", "🤔", "😍", "😎", "🥳", "😰", "🤗", "🚀", "💪"];
  const fonts = ['Inter', 'Georgia', 'Monaco', 'Playfair Display'];

  // Get today's entry or create new
  useEffect(() => {
    const today = new Date().toDateString();
    const todayEntry = entries.find(entry => entry.date.toDateString() === today);
    
    if (todayEntry) {
      setCurrentEntry(todayEntry);
      setEntryTitle(todayEntry.title);
      setEntryContent(todayEntry.content);
      setEntryTags(todayEntry.tags);
      setEntryColor(todayEntry.color);
      setSelectedMood(todayEntry.mood);
    } else {
      // Create new entry for today
      setCurrentEntry(null);
      setEntryTitle('');
      setEntryContent('');
      setEntryTags([]);
      setEntryColor('#FFD93D');
      setSelectedMood('😊');
    }
  }, [selectedDate]);

  const saveEntry = () => {
    const entryData = {
      id: currentEntry?.id || Date.now(),
      date: selectedDate,
      title: entryTitle || 'Untitled Entry',
      content: entryContent,
      mood: selectedMood,
      tags: entryTags,
      color: entryColor,
      bookmarked: currentEntry?.bookmarked || false
    };

    if (currentEntry) {
      setEntries(prev => prev.map(entry => entry.id === currentEntry.id ? entryData : entry));
    } else {
      setEntries(prev => [...prev, entryData]);
    }
    
    setCurrentEntry(entryData);
  };

  const deleteEntry = () => {
    if (currentEntry) {
      setEntries(prev => prev.filter(entry => entry.id !== currentEntry.id));
      setCurrentEntry(null);
      setEntryTitle('');
      setEntryContent('');
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getEntryForDate = (date) => {
    return entries.find(entry => entry.date.toDateString() === date.toDateString());
  };

  const filteredEntries = entries.filter(entry => 
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} transition-all duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                My Journal
              </h1>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
          </div>
          
          {!sidebarCollapsed && (
            <div className="mt-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setSelectedDate(new Date());
                  setCurrentEntry(null);
                  setEntryTitle('');
                  setEntryContent('');
                }}
                className="flex items-center gap-2 p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <FaPlus size={12} />
                <span className="text-sm">New Entry</span>
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {darkMode ? <FaSun size={12} /> : <FaMoon size={12} />}
                <span className="text-sm">{darkMode ? 'Light' : 'Dark'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Entry List */}
        <div className="flex-1 overflow-y-auto">
          {!sidebarCollapsed && (
            <div className="p-4">
              <h2 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Recent Entries
              </h2>
              <div className="space-y-2">
                {filteredEntries.map(entry => (
                  <div
                    key={entry.id}
                    onClick={() => {
                      setCurrentEntry(entry);
                      setSelectedDate(entry.date);
                      setEntryTitle(entry.title);
                      setEntryContent(entry.content);
                      setEntryTags(entry.tags);
                      setEntryColor(entry.color);
                      setSelectedMood(entry.mood);
                    }}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentEntry?.id === entry.id 
                        ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-300 dark:border-blue-600' 
                        : darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-lg">{entry.mood}</span>
                      {entry.bookmarked && <FaBookmark className="text-yellow-500 text-xs" />}
                    </div>
                    <h3 className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {entry.title}
                    </h3>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {entry.date.toLocaleDateString()}
                    </p>
                    <p className={`text-xs mt-1 line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {entry.content}
                    </p>
                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entry.tags.map(tag => (
                          <span
                            key={tag}
                            className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {formatDate(selectedDate)}
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {currentEntry ? 'Editing entry' : 'Create new entry'}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Calendar */}
              <div className="relative">
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  <FaCalendarAlt />
                </button>
                {showCalendar && (
                  <div className="absolute right-0 top-12 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
                    <input
                      type="date"
                      value={selectedDate.toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(new Date(e.target.value))}
                      className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`}
                    />
                  </div>
                )}
              </div>

              {/* Save */}
              <button
                onClick={saveEntry}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <FaSave size={14} />
                Save
              </button>

              {/* Delete */}
              {currentEntry && (
                <button
                  onClick={deleteEntry}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <FaTrash size={14} />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className={`h-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex`}>
            {/* Writing Area */}
            <div className="flex-1 flex flex-col">
              {/* Entry Header */}
              <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-4 mb-4">
                  {/* Mood Picker */}
                  <div className="relative">
                    <button
                      onClick={() => setShowMoodPicker(!showMoodPicker)}
                      className="text-3xl hover:scale-110 transition-transform"
                    >
                      {selectedMood}
                    </button>
                    {showMoodPicker && (
                      <div className="absolute top-12 left-0 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-4 gap-2">
                          {moods.map(mood => (
                            <button
                              key={mood}
                              onClick={() => {
                                setSelectedMood(mood);
                                setShowMoodPicker(false);
                              }}
                              className="text-2xl hover:scale-110 transition-transform p-1"
                            >
                              {mood}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Color Picker */}
                  <div className="relative">
                    <button
                      onClick={() => setShowColorPalette(!showColorPalette)}
                      className="w-8 h-8 rounded-full border-2 border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: entryColor }}
                    />
                    {showColorPalette && (
                      <div className="absolute top-10 left-0 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-4 gap-2">
                          {colors.map(color => (
                            <button
                              key={color}
                              onClick={() => {
                                setEntryColor(color);
                                setShowColorPalette(false);
                              }}
                              className="w-8 h-8 rounded-full border-2 border-gray-300 hover:scale-110 transition-transform"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title Input */}
                <input
                  type="text"
                  placeholder="Entry title..."
                  value={entryTitle}
                  onChange={(e) => setEntryTitle(e.target.value)}
                  className={`w-full text-2xl font-bold bg-transparent border-none outline-none placeholder-gray-400 ${darkMode ? 'text-white' : 'text-gray-800'}`}
                />

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {entryTags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                    >
                      #{tag}
                      <button
                        onClick={() => setEntryTags(prev => prev.filter((_, i) => i !== index))}
                        className="ml-2 text-red-500 hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Add tag..."
                    className={`px-3 py-1 rounded-full text-sm bg-transparent border border-dashed border-gray-300 outline-none ${darkMode ? 'text-white placeholder-gray-400' : 'text-gray-600'}`}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        setEntryTags(prev => [...prev, e.target.value.trim()]);
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              </div>

              {/* Content Editor */}
              <div className="flex-1 p-6">
                <textarea
                  placeholder="Start writing your thoughts..."
                  value={entryContent}
                  onChange={(e) => setEntryContent(e.target.value)}
                  className={`w-full h-full resize-none border-none outline-none bg-transparent text-lg leading-relaxed ${darkMode ? 'text-gray-200 placeholder-gray-500' : 'text-gray-700 placeholder-gray-400'}`}
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                />
              </div>
            </div>

            {/* Formatting Toolbar */}
            <div className={`w-16 ${darkMode ? 'bg-gray-750 border-gray-700' : 'bg-gray-50 border-gray-200'} border-l flex flex-col items-center py-4 gap-3`}>
              <button className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <FaBold />
              </button>
              <button className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <FaItalic />
              </button>
              <button className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <FaUnderline />
              </button>
              <button className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <FaListUl />
              </button>
              <button className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <FaQuoteLeft />
              </button>
              <button className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <FaAlignLeft />
              </button>
              <div className="border-t border-gray-300 dark:border-gray-600 w-8 my-2" />
              <button className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <FaImage />
              </button>
              <button className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <FaLink />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-500'} border-t px-6 py-3`}>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span>{entryContent.length} characters</span>
              <span>{entryContent.split(' ').filter(word => word.length > 0).length} words</span>
            </div>
            <div className="flex items-center gap-4">
              <span>{entries.length} total entries</span>
              <span>Last saved: {currentEntry ? 'Now' : 'Never'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}