import React, { useState, useEffect, useRef } from 'react';
import {
  Palette,
  Calendar,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Flame,
  Bold,
  Italic,
  List,
  ListOrdered,
  X,
  Smile,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { apiRequest } from '../api';
import '../styles/Journal.css';
import NavbarLeft from "../layout/NavbarLeft";
import NavbarTop from "../layout/NavbarTop";

const Journal = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [journalContent, setJournalContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [themeColor, setThemeColor] = useState('#3B82F6');
  const [tempThemeColor, setTempThemeColor] = useState('#3B82F6');
  const [moodCategories, setMoodCategories] = useState([]);
  const [showMoodDropdown, setShowMoodDropdown] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [streakMonth, setStreakMonth] = useState(new Date());
  const [statsMonth, setStatsMonth] = useState(new Date());
  const [notification, setNotification] = useState(null);
  const [streakCount, setStreakCount] = useState(0);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [formatStates, setFormatStates] = useState({
    bold: false,
    italic: false,
    underline: false,
    insertUnorderedList: false,
    insertOrderedList: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false
  });

  const editorRef = useRef(null);

  const themeColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

  const colorOptions = [
    '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF',
    '#980000', '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#4A86E8', '#0000FF', '#9900FF', '#FF00FF'
  ];

  const emojis = ['😊', '😂', '🥰', '😍', '🤔', '😎', '🥳', '😴', '😢', '😭', '😡', '🤗', '🙌', '👏', '💪', '🎉', '❤', '💔', '⭐', '✨', '🔥', '💯', '🌈', '☀', '🌙', '⚡'];

  useEffect(() => {
    fetchMoodCategories();
    calculateStreak();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadJournalEntry(currentDate);
  }, [currentDate]);

  const fetchMoodCategories = async () => {
    try {
      const response = await apiRequest('/journal/categories');
      setMoodCategories(response.categories || []);
    } catch (error) {
      showNotification('Error loading categories', 'error');
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const formatDate = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const formatShortDate = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const getDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const loadJournalEntry = async (date) => {
    try {
      const dateKey = getDateKey(date);
      const response = await apiRequest(`/journal/entry/${dateKey}`);

      if (response && response.entry) {
        setJournalContent(response.entry.content || '');
        setSelectedMood(response.entry.moodCategory || '');
        setThemeColor(response.entry.themeColor || '#3B82F6');
        setTempThemeColor(response.entry.themeColor || '#3B82F6');
        if (editorRef.current) {
          editorRef.current.innerHTML = response.entry.content || '';
        }
      } else {
        setJournalContent('');
        setSelectedMood('');
        setThemeColor('#3B82F6');
        setTempThemeColor('#3B82F6');
        if (editorRef.current) {
          editorRef.current.innerHTML = '';
        }
      }
    } catch (error) {
      showNotification('Error loading entry', 'error');
    }
  };

  const saveJournalEntry = async () => {
    if (!selectedMood) {
      showNotification('Please select a category', 'error');
      return;
    }

    const content = editorRef.current ? editorRef.current.innerHTML : journalContent;

    try {
      const dateToSave = new Date(currentDate);
      dateToSave.setHours(12, 0, 0, 0);

      await apiRequest('/journal/entry', 'POST', {
        date: dateToSave.toISOString(),
        themeColor,
        content,
        moodCategory: selectedMood
      });

      showNotification('Journal entry saved successfully!', 'success');
      calculateStreak();
    } catch (error) {
      showNotification('Error saving entry', 'error');
    }
  };

  const saveTheme = async () => {
    try {
      const dateKey = getDateKey(currentDate);
      const response = await apiRequest(`/journal/entry/${dateKey}`);

      if (response && response.entry) {
        await apiRequest('/journal/entry', 'POST', {
          date: response.entry.date,
          themeColor: tempThemeColor,
          content: response.entry.content,
          moodCategory: response.entry.moodCategory,
        });
      }

      setThemeColor(tempThemeColor);
      setShowThemeModal(false);
      showNotification('Theme color updated!', 'success');
    } catch (error) {
      // Even if API fails, apply locally so UI reflects choice
      setThemeColor(tempThemeColor);
      setShowThemeModal(false);
      showNotification('Theme color updated!', 'success');
    }
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  const goToDate = (date) => {
    setCurrentDate(date);
  };

  const handleDateSelect = (year, month, day) => {
    const newDate = new Date(year, month, day);
    setCurrentDate(newDate);
    setShowDatePicker(false);
  };

  const addCustomCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const response = await apiRequest('/journal/categories', 'POST', {
        name: newCategoryName.trim()
      });
      setMoodCategories(response.categories || []);
      setNewCategoryName('');
      setShowAddCategory(false);
      showNotification('Category added successfully', 'success');
    } catch (error) {
      showNotification(error.message || 'Error adding category', 'error');
    }
  };

  const updateMoodCategory = async (categoryId) => {
    if (!editCategoryName.trim()) return;

    try {
      const response = await apiRequest(`/journal/categories/${categoryId}`, 'PUT', {
        name: editCategoryName.trim()
      });
      setMoodCategories(response.categories || []);
      setEditingCategory(null);
      setEditCategoryName('');
      showNotification('Category updated successfully', 'success');
    } catch (error) {
      showNotification(error.message || 'Error updating category', 'error');
    }
  };

  const deleteCustomCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await apiRequest(`/journal/categories/${categoryId}`, 'DELETE');
      setMoodCategories(response.categories || []);
      showNotification('Category deleted successfully', 'success');
    } catch (error) {
      showNotification(error.message || 'Error deleting category', 'error');
    }
  };

  const applyFormat = (command, value = null) => {
    // Note: document.execCommand is deprecated but still works in many browsers.
    document.execCommand(command, false, value);
    if (editorRef.current) editorRef.current.focus();
    setTimeout(updateFormatStates, 10);
  };

  const applyTextColor = (color) => {
    applyFormat('foreColor', color);
    setShowTextColorPicker(false);
  };

  const applyHighlight = (color) => {
    applyFormat('hiliteColor', color);
    setShowHighlightPicker(false);
  };

  const removeTextColor = () => {
    // removeFormat is not standardized; fallback to selecting node and clearing styles could be used.
    applyFormat('removeFormat');
    setShowTextColorPicker(false);
  };

  const removeHighlight = () => {
    applyFormat('hiliteColor', 'transparent');
    setShowHighlightPicker(false);
  };

  const updateFormatStates = () => {
    setFormatStates({
      bold: document.queryCommandState && document.queryCommandState('bold'),
      italic: document.queryCommandState && document.queryCommandState('italic'),
      underline: document.queryCommandState && document.queryCommandState('underline'),
      insertUnorderedList: document.queryCommandState && document.queryCommandState('insertUnorderedList'),
      insertOrderedList: document.queryCommandState && document.queryCommandState('insertOrderedList'),
      justifyLeft: document.queryCommandState && document.queryCommandState('justifyLeft'),
      justifyCenter: document.queryCommandState && document.queryCommandState('justifyCenter'),
      justifyRight: document.queryCommandState && document.queryCommandState('justifyRight')
    });
  };

  const insertEmoji = (emoji) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(emoji));
      range.collapse(false);
    } else if (editorRef.current) {
      editorRef.current.appendChild(document.createTextNode(emoji));
    }
    if (editorRef.current) editorRef.current.focus();
    setShowEmojiPicker(false);
  };

  const calculateStreak = async () => {
    try {
      const now = new Date();
      let streak = 0;

      for (let i = 0; i <= 365; i++) {
        const checkDate = new Date(now);
        checkDate.setDate(checkDate.getDate() - i);

        const dateKey = getDateKey(checkDate);
        const response = await apiRequest(`/journal/entry/${dateKey}`);

        if (response && response.entry) {
          streak++;
        } else {
          break;
        }
      }

      setStreakCount(streak);
    } catch (error) {
      console.error('Error calculating streak:', error);
    }
  };

  const generateStreakData = async (month) => {
    try {
      const year = month.getFullYear();
      const monthIdx = month.getMonth();
      const response = await apiRequest(`/journal/streak/${year}/${monthIdx + 1}`);
      return response.streakDates || [];
    } catch (error) {
      showNotification('Error loading streak data', 'error');
      return [];
    }
  };

  const generateMonthlyStats = async (month) => {
    try {
      const year = month.getFullYear();
      const monthIdx = month.getMonth();
      const response = await apiRequest(`/journal/statistics/${year}/${monthIdx + 1}`);

      const chartData = Object.entries(response.moodCounts || {}).map(([mood, count]) => ({
        name: mood,
        value: count
      }));

      return {
        chartData,
        memorableDays: response.memorableDays || [],
        totalEntries: response.totalEntries || 0
      };
    } catch (error) {
      showNotification('Error loading statistics', 'error');
      return { chartData: [], memorableDays: [], totalEntries: 0 };
    }
  };

  const navigateStreakMonth = (direction) => {
    const newMonth = new Date(streakMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setStreakMonth(newMonth);
  };

  const navigateStatsMonth = (direction) => {
    const newMonth = new Date(statsMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setStatsMonth(newMonth);
  };

  const navigatePickerMonth = (direction, pickerMonth, setPickerMonth) => {
    const newMonth = new Date(pickerMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setPickerMonth(newMonth);
  };

  const StreakModal = () => {
    const [streakDays, setStreakDays] = useState([]);
    const [loading, setLoading] = useState(false);
    const year = streakMonth.getFullYear();
    const month = streakMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    useEffect(() => {
      let mounted = true;
      setLoading(true);
      generateStreakData(streakMonth).then(data => {
        if (mounted) {
          setStreakDays(data);
          setLoading(false);
        }
      });
      return () => { mounted = false; };
    }, [streakMonth]);

    return (
      <div className="jo-modal-overlay" onClick={() => setShowStreakModal(false)}>
        <div className="jo-modal jo-glass-modal jo-streak-modal" onClick={(e) => e.stopPropagation()}>
          <div className="jo-modal-header">
            <div>
              <h2 className="jo-modal-title">Streak Calendar</h2>
              <div className="jo-streak-count">Current Streak: {streakCount} days</div>
            </div>
            <button className="jo-close-btn" onClick={() => setShowStreakModal(false)}>×</button>
          </div>

          <div className="jo-month-navigation">
            <button className="jo-month-nav-btn" onClick={() => navigateStreakMonth(-1)}>
              <ChevronLeft size={20} />
            </button>
            <span className="jo-month-display">{monthNames[month]} {year}</span>
            <button className="jo-month-nav-btn" onClick={() => navigateStreakMonth(1)}>
              <ChevronRight size={20} />
            </button>
          </div>

          <div className={`jo-calendar ${loading ? 'jo-loading' : ''}`}>
            {dayNames.map(day => (
              <div key={day} className="jo-calendar-header">{day}</div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const hasEntry = streakDays.includes(day);
              const dayDate = new Date(year, month, day);
              const isTodayDate = isToday(dayDate);
              return (
                <div
                  key={`day-${day}`}
                  className={`jo-calendar-day ${hasEntry ? 'has-entry' : ''} ${isTodayDate ? 'is-today' : ''}`}
                  onClick={() => {
                    handleDateSelect(year, month, day);
                    setShowStreakModal(false);
                  }}
                >
                  {day}
                  {hasEntry && <span className="jo-fire-emoji">🔥</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const StatsModal = () => {
    const [stats, setStats] = useState({ chartData: [], memorableDays: [], totalEntries: 0 });
    const [loading, setLoading] = useState(false);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    useEffect(() => {
      let mounted = true;
      setLoading(true);
      generateMonthlyStats(statsMonth).then(data => {
        if (mounted) {
          setStats(data);
          setLoading(false);
        }
      });
      return () => { mounted = false; };
    }, [statsMonth]);

    return (
      <div className="jo-modal-overlay" onClick={() => setShowStatsModal(false)}>
        <div className="jo-modal jo-glass-modal jo-stats-modal" onClick={(e) => e.stopPropagation()}>
          <div className="jo-modal-header">
            <h2 className="jo-modal-title">Monthly Statistics</h2>
            <button className="jo-close-btn" onClick={() => setShowStatsModal(false)}>×</button>
          </div>

          <div className="jo-month-navigation">
            <button className="jo-month-nav-btn" onClick={() => navigateStatsMonth(-1)}>
              <ChevronLeft size={20} />
            </button>
            <span className="jo-month-display">{monthNames[statsMonth.getMonth()]} {statsMonth.getFullYear()}</span>
            <button className="jo-month-nav-btn" onClick={() => navigateStatsMonth(1)}>
              <ChevronRight size={20} />
            </button>
          </div>

          <div className={`jo-stats-container ${loading ? 'jo-loading' : ''}`}>
            <div className="jo-stats-section">
              <div className="jo-total-entries">Total Entries: {stats.totalEntries}</div>
            </div>

            {stats.chartData.length > 0 ? (
              <div className="jo-stats-section">
                <h3 className="jo-stats-title">Mood Distribution</h3>
                <div className="jo-chart-container">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={stats.chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {stats.chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="jo-no-data">No entries for this month</div>
            )}

            {stats.memorableDays.length > 0 && (
              <div className="jo-stats-section">
                <h3 className="jo-stats-title">Memorable Days</h3>
                <ul className="jo-memorable-list">
                  {stats.memorableDays.map((day, index) => (
                    <li key={index} className="jo-memorable-item">
                      <span>{formatDate(new Date(day.date))}</span>
                      <span className="jo-memorable-badge">{day.mood}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const DatePickerModal = () => {
    const [pickerMonth, setPickerMonth] = useState(new Date(currentDate));
    const year = pickerMonth.getFullYear();
    const month = pickerMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="jo-modal-overlay" onClick={() => setShowDatePicker(false)}>
        <div className="jo-modal jo-glass-modal jo-date-modal" onClick={(e) => e.stopPropagation()}>
          <div className="jo-modal-header">
            <h2 className="jo-modal-title">Select Date</h2>
            <button className="jo-close-btn" onClick={() => setShowDatePicker(false)}>×</button>
          </div>

          <div className="jo-month-navigation">
            <button className="jo-month-nav-btn" onClick={() => navigatePickerMonth(-1, pickerMonth, setPickerMonth)}>
              <ChevronLeft size={20} />
            </button>
            <span className="jo-month-display">{monthNames[month]} {year}</span>
            <button className="jo-month-nav-btn" onClick={() => navigatePickerMonth(1, pickerMonth, setPickerMonth)}>
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="jo-calendar">
            {dayNames.map(day => (
              <div key={day} className="jo-calendar-header">{day}</div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayDate = new Date(year, month, day);
              const isTodayDate = isToday(dayDate);
              return (
                <div
                  key={`daypicker-${day}`}
                  className={`jo-calendar-day ${isTodayDate ? 'is-today' : ''}`}
                  onClick={() => handleDateSelect(year, month, day)}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const ThemeModal = () => (
    <div className="jo-modal-overlay" onClick={() => setShowThemeModal(false)}>
      <div className="jo-modal jo-glass-modal jo-theme-modal" onClick={(e) => e.stopPropagation()}>
        <div className="jo-modal-header">
          <h2 className="jo-modal-title">Choose Theme Color</h2>
          <button className="jo-close-btn" onClick={() => setShowThemeModal(false)}>×</button>
        </div>
        <div className="jo-theme-colors">
          {themeColors.map(color => (
            <div
              key={color}
              className={`jo-theme-color ${tempThemeColor === color ? 'selected' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => setTempThemeColor(color)}
            />
          ))}
        </div>
        <button className="jo-theme-save-btn" onClick={saveTheme}>
          Save Theme
        </button>
      </div>
    </div>
  );

  const ColorPickerDropdown = ({ colors, onSelect, onRemove, show, title }) => (
    show ? (
      <div className="jo-color-picker-dropdown jo-glass">
        <div className="jo-color-picker-header">{title}</div>
        <div className="jo-color-grid">
          {colors.map((color, index) => (
            <div
              key={index}
              className="jo-color-option"
              style={{ backgroundColor: color }}
              onClick={() => onSelect(color)}
              title={color}
            />
          ))}
        </div>
        <button className="jo-remove-format-btn" onClick={onRemove}>
          Remove {title}
        </button>
      </div>
    ) : null
  );

  const EmojiPicker = () => (
    <div className="jo-emoji-picker jo-glass">
      <div className="jo-emoji-grid">
        {emojis.map((emoji, index) => (
          <button
            key={index}
            className="jo-emoji-btn"
            onClick={() => insertEmoji(emoji)}
            type="button"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );

  const getVisibleDates = () => {
    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);

    const tomorrow = new Date(currentDate);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return [yesterday, currentDate, tomorrow];
  };

  return (
    <div className="jo-container">
      {notification && (
        <div className={`jo-notification jo-glass jo-notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="jo-main-wrapper">
        <div className="jo-navbar jo-glass">
          <div className="jo-navbar-section">
            <button className="jo-icon-btn jo-streak-btn" onClick={() => { setShowStreakModal(true); setStreakMonth(new Date()); }} title="Streak" type="button">
              <Flame size={20} />
              <span className="jo-streak-number">{streakCount}</span>
            </button>
          </div>

          <div className="jo-navbar-section jo-navigation">
            <button className="jo-arrow-btn" onClick={() => navigateDate(-1)} type="button">
              <ChevronLeft size={20} />
            </button>
            {getVisibleDates().map((date, idx) => {
              const isCurrent = idx === 1;
              const isTodayDate = isToday(date);
              return (
                <button
                  key={`nav-${idx}`}
                  className={`jo-nav-btn ${isCurrent ? 'active' : ''}`}
                  onClick={() => goToDate(date)}
                  type="button"
                >
                  <div className="jo-nav-date">{formatShortDate(date)}</div>
                  {isTodayDate && <div className="jo-today-label">Today</div>}
                </button>
              );
            })}
            <button className="jo-arrow-btn" onClick={() => navigateDate(1)} type="button">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="jo-navbar-section">
            <button className="jo-icon-btn" onClick={() => { setShowStatsModal(true); setStatsMonth(new Date()); }} title="Statistics" type="button">
              <BarChart3 size={20} />
            </button>
            <button className="jo-icon-btn" onClick={() => setShowDatePicker(true)} title="Date Picker" type="button">
              <Calendar size={20} />
            </button>
          </div>
        </div>

        <div className="jo-content-wrapper jo-glass">
          <div className="jo-journal-header">
            <div className="jo-date-display">{formatDate(currentDate)}</div>
            <div className="jo-mood-dropdown">
              <button
                className="jo-dropdown-btn jo-glass"
                onClick={() => setShowMoodDropdown(!showMoodDropdown)}
                type="button"
              >
                <span>{selectedMood || 'How was your day?'}</span>
                <span>▼</span>
              </button>

              {showMoodDropdown && (
                <div className="jo-dropdown-menu jo-glass">
                  {moodCategories.map((category) => (
                    <div
                      key={category._id || category.name}
                      className="jo-dropdown-item"
                    >
                      {editingCategory === category._id ? (
                        <div className="jo-edit-category">
                          <input
                            type="text"
                            className="jo-category-input"
                            value={editCategoryName}
                            onChange={(e) => setEditCategoryName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && updateMoodCategory(category._id)}
                            autoFocus
                          />
                          <button className="jo-save-cat-btn" onClick={() => updateMoodCategory(category._id)} type="button">✓</button>
                          <button className="jo-cancel-cat-btn" onClick={() => setEditingCategory(null)} type="button">×</button>
                        </div>
                      ) : (
                        <>
                          <span
                            className="jo-category-name"
                            onClick={() => {
                              setSelectedMood(category.name);
                              setShowMoodDropdown(false);
                            }}
                          >
                            {category.name}
                          </span>
                          {!category.isDefault && (
                            <div className="jo-category-actions">
                              <button
                                className="jo-edit-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingCategory(category._id);
                                  setEditCategoryName(category.name);
                                }}
                                title="Edit"
                                type="button"
                              >
                                ✎
                              </button>
                              <button
                                className="jo-delete-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteCustomCategory(category._id);
                                }}
                                type="button"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}

                  <div className="jo-dropdown-divider" />

                  {!showAddCategory ? (
                    <div
                      className="jo-dropdown-item jo-add-category-btn"
                      onClick={() => setShowAddCategory(true)}
                      role="button"
                      tabIndex={0}
                    >
                      + Add Custom Category
                    </div>
                  ) : (
                    <div className="jo-add-category">
                      <input
                        type="text"
                        className="jo-category-input"
                        placeholder="New category..."
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addCustomCategory()}
                        autoFocus
                      />
                      <button className="jo-add-btn" onClick={addCustomCategory} type="button">Add</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="jo-editor-container">
            <div
              ref={editorRef}
              className="jo-editor"
              contentEditable
              data-placeholder="Start writing your journal entry..."
              onInput={(e) => setJournalContent(e.currentTarget.innerHTML)}
              onMouseUp={updateFormatStates}
              onKeyUp={updateFormatStates}
            />
          </div>

          <div className="jo-toolbar">
            <button
              className={`jo-tool-btn ${formatStates.bold ? 'active' : ''}`}
              onClick={() => applyFormat('bold')}
              title="Bold"
              type="button"
            >
              <Bold size={16} />
            </button>
            <button
              className={`jo-tool-btn ${formatStates.italic ? 'active' : ''}`}
              onClick={() => applyFormat('italic')}
              title="Italic"
              type="button"
            >
              <Italic size={16} />
            </button>
            <button
              className={`jo-tool-btn ${formatStates.underline ? 'active' : ''}`}
              onClick={() => applyFormat('underline')}
              title="Underline"
              type="button"
            >
              <Underline size={16} />
            </button>
            <button
              className={`jo-tool-btn ${formatStates.insertUnorderedList ? 'active' : ''}`}
              onClick={() => applyFormat('insertUnorderedList')}
              title="Bullet List"
              type="button"
            >
              <List size={16} />
            </button>
            <button
              className={`jo-tool-btn ${formatStates.insertOrderedList ? 'active' : ''}`}
              onClick={() => applyFormat('insertOrderedList')}
              title="Numbered List"
              type="button"
            >
              <ListOrdered size={16} />
            </button>
            <button
              className={`jo-tool-btn ${formatStates.justifyLeft ? 'active' : ''}`}
              onClick={() => applyFormat('justifyLeft')}
              title="Align Left"
              type="button"
            >
              <AlignLeft size={16} />
            </button>
            <button
              className={`jo-tool-btn ${formatStates.justifyCenter ? 'active' : ''}`}
              onClick={() => applyFormat('justifyCenter')}
              title="Align Center"
              type="button"
            >
              <AlignCenter size={16} />
            </button>
            <button
              className={`jo-tool-btn ${formatStates.justifyRight ? 'active' : ''}`}
              onClick={() => applyFormat('justifyRight')}
              title="Align Right"
              type="button"
            >
              <AlignRight size={16} />
            </button>

            <select className="jo-tool-select jo-glass-select" onChange={(e) => applyFormat('fontSize', e.target.value)} defaultValue="3">
              <option value="1">Small</option>
              <option value="3">Normal</option>
              <option value="5">Large</option>
              <option value="7">Huge</option>
            </select>

            <select className="jo-tool-select jo-glass-select" onChange={(e) => applyFormat('fontName', e.target.value)}>
              <option value="Arial">Arial</option>
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times</option>
              <option value="Courier New">Courier</option>
              <option value="Verdana">Verdana</option>
            </select>

            <div style={{ position: 'relative' }}>
              <button
                className="jo-tool-btn"
                onClick={() => {
                  setShowEmojiPicker(!showEmojiPicker);
                  setShowTextColorPicker(false);
                  setShowHighlightPicker(false);
                }}
                title="Emoji"
                type="button"
              >
                <Smile size={16} />
              </button>
              {showEmojiPicker && <EmojiPicker />}
            </div>

            <button className="jo-save-btn" onClick={saveJournalEntry} type="button">
              Save Entry
            </button>
          </div>
        </div>

        {/* <NavbarLeft />
        <NavbarTop /> */}
      </div>

      {showThemeModal && <ThemeModal />}
      {showStreakModal && <StreakModal />}
      {showStatsModal && <StatsModal />}
      {showDatePicker && <DatePickerModal />}
    </div>
  );
};

export default Journal;
