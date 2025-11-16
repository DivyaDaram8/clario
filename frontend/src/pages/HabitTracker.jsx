import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api';
import '../styles/habitTracker.css';
import NavbarLeft from "../layout/NavbarLeft";
import NavbarTop from "../layout/NavbarTop";
import { Edit2, Trash2 } from 'lucide-react';


const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [editingHabit, setEditingHabit] = useState(null);
  const [editName, setEditName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [globalStats, setGlobalStats] = useState(null);
  const [showGlobalStats, setShowGlobalStats] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '', show: false });
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({ show: false, habitId: null, habitName: '' });


  useEffect(() => {
    fetchHabits();
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setCurrentDate(d);
  }, []);


  const toLocalDateString = (d) => {
    const dt = new Date(d);
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };


  const toLocalMidnight = (d) => {
    const dt = new Date(d);
    dt.setHours(0, 0, 0, 0);
    return dt;
  };


  // show notification and auto-hide after 3s
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, show: true });
    setTimeout(() => {
      setNotification({ message: '', type: '', show: false });
    }, 3000);
  };


  const fetchHabits = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/habits');
      setHabits(data);
    } catch (error) {
      showNotification('Failed to fetch habits', 'error');
    } finally {
      setLoading(false);
    }
  };


  const createHabit = async () => {
    if (!newHabitName.trim()) return;


    try {
      const newHabit = await apiRequest('/habits', 'POST', { name: newHabitName.trim() });
      setHabits([newHabit, ...habits]);
      setNewHabitName('');
      setShowAddModal(false);
      showNotification('Habit created successfully!');
    } catch (error) {
      showNotification('Failed to create habit', 'error');
    }
  };


  const updateHabit = async (id, name) => {
    try {
      const updatedHabit = await apiRequest(`/habits/${id}`, 'PUT', { name });
      setHabits(habits.map(h => h._id === id ? updatedHabit : h));
      setEditingHabit(null);
      showNotification('Habit updated successfully!');
    } catch (error) {
      showNotification('Failed to update habit', 'error');
    }
  };


  const confirmDelete = (id, name) => {
    setConfirmDialog({ show: true, habitId: id, habitName: name });
  };


  const deleteHabit = async () => {
    const { habitId } = confirmDialog;
    try {
      await apiRequest(`/habits/${habitId}`, 'DELETE');
      setHabits(habits.filter(h => h._id !== habitId));
      setConfirmDialog({ show: false, habitId: null, habitName: '' });
      showNotification('Habit deleted successfully!');
    } catch (error) {
      showNotification('Failed to delete habit', 'error');
    }
  };


  const toggleHabitLog = async (habitId, date) => {
    try {
      const dateStr = toLocalDateString(date);
      const updatedHabit = await apiRequest(`/habits/${habitId}/toggle`, 'POST', { date: dateStr });
      setHabits(habits.map(h => h._id === habitId ? updatedHabit : h));


      if (selectedHabit && selectedHabit._id === habitId && monthlyStats) {
        await fetchMonthlyStats(habitId, monthlyStats.year, monthlyStats.month);
      }


      showNotification('Habit updated!');
    } catch (error) {
      const msg = error?.message || 'Failed to update habit';
      showNotification(msg, 'error');
    }
  };


  const fetchMonthlyStats = async (habitId, year, month) => {
    try {
      const stats = await apiRequest(`/habits/${habitId}/stats?year=${year}&month=${month}`);
      setMonthlyStats(stats);
    } catch (error) {
      showNotification('Failed to fetch monthly stats', 'error');
    }
  };


  const fetchGlobalStats = async () => {
    try {
      const stats = await apiRequest('/habits/global/stats');
      setGlobalStats(stats);
      setShowGlobalStats(true);
    } catch (error) {
      showNotification('Failed to fetch global stats', 'error');
    }
  };


  const openModal = async (habit) => {
    setSelectedHabit(habit);
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setCurrentDate(d);
    setShowModal(true);
    await fetchMonthlyStats(habit._id, d.getFullYear(), d.getMonth() + 1);
  };


  const navigateMonth = async (direction) => {
    if (!selectedHabit) return;


    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    newDate.setHours(0, 0, 0, 0);
    setCurrentDate(newDate);
    await fetchMonthlyStats(selectedHabit._id, newDate.getFullYear(), newDate.getMonth() + 1);
  };


  const getWeekDays = (reference = new Date()) => {
    const today = new Date(reference);
    today.setHours(0, 0, 0, 0);


    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);


    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      d.setHours(0, 0, 0, 0);
      days.push(d);
    }
    return days;
  };


  const weekDays = getWeekDays();


  const isHabitCompleted = (habit, date) => {
    if (!habit.logs || habit.logs.length === 0) return false;
    const target = toLocalDateString(date);
    const log = habit.logs.find(l => toLocalDateString(l.date) === target);
    return !!(log && log.completed);
  };


  const canCheckDate = (date) => {
    const d = toLocalMidnight(date);
    const today = toLocalMidnight(new Date());
    return d.getTime() <= today.getTime();
  };


  const isToday = (date) => {
    const d = toLocalMidnight(date);
    const today = toLocalMidnight(new Date());
    return d.getTime() === today.getTime();
  };


  const formatDateDisplay = (date) => {
    return date.getDate();
  };


  const getDaysInMonth = (year, month) => {
    // month should be 1-12
    return new Date(year, month, 0).getDate();
  };


  const getMonthCalendar = () => {
    if (!monthlyStats) return [];


    const year = monthlyStats.year;
    const month = monthlyStats.month;
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = new Date(year, month - 1, 1).getDay();


    const calendar = [];


    for (let i = 0; i < firstDay; i++) {
      calendar.push(null);
    }


    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      date.setHours(0, 0, 0, 0);
      const dateStr = toLocalDateString(date);
      const log = monthlyStats.logs.find(l => toLocalDateString(l.date) === dateStr);


      calendar.push({
        day,
        date,
        completed: !!(log && log.completed),
        canCheck: canCheckDate(date),
      });
    }


    return calendar;
  };


  if (loading) {
    return <div className="ht-loading">Loading habits...</div>;
  }


  return (
    <div className="ht-container">
      {/* <NavbarLeft />
      <NavbarTop />
       */}
      <div className="ht-header">
        <h1 className="ht-title">Habit Tracker</h1>
        <div className="ht-header-controls">
          <button className="ht-stats-btn" onClick={fetchGlobalStats}>
            Global Statistics
          </button>
          <button className="ht-add-habit-btn" onClick={() => setShowAddModal(true)}>
            Add Habit
          </button>
        </div>
      </div>


      <div className="ht-habits-grid">
        {habits.map((habit) => (
          <div key={habit._id} className="ht-habit-card">
            <div className="ht-habit-header">
              {editingHabit === habit._id ? (
                <div className="ht-edit-form">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="ht-input"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') updateHabit(habit._id, editName);
                      if (e.key === 'Escape') setEditingHabit(null);
                    }}
                    autoFocus
                  />
                  <button onClick={() => updateHabit(habit._id, editName)} className="ht-save-btn">
                    ✓
                  </button>
                  <button onClick={() => setEditingHabit(null)} className="ht-cancel-btn">
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="ht-habit-name">{habit.name}</h3>
                  <div className="ht-habit-actions">
                    <button
                      onClick={() => {
                        setEditingHabit(habit._id);
                        setEditName(habit.name);
                      }}
                      className="ht-action-btn"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => confirmDelete(habit._id, habit.name)}
                      className="ht-action-btn ht-delete-btn"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>


            <div className="ht-week-container">
              <div className="ht-week-labels">
                {weekDays.map((date, index) => (
                  <div key={index} className="ht-day-column">
                    <span className="ht-day-label">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                    </span>
                    <span className={`ht-date-number ${isToday(date) ? 'ht-today' : ''}`}>
                      {formatDateDisplay(date)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="ht-week-checkboxes">
                {weekDays.map((date, index) => (
                  <label key={index} className="ht-checkbox-container">
                    <input
                      type="checkbox"
                      checked={isHabitCompleted(habit, date)}
                      onChange={() => toggleHabitLog(habit._id, date)}
                      disabled={!canCheckDate(date)}
                      className="ht-checkbox"
                    />
                    <span className={`ht-checkmark ${!canCheckDate(date) ? 'ht-future' : ''}`}></span>
                  </label>
                ))}
              </div>
            </div>


            <div className="ht-habit-stats">
              <div className="ht-streak">
                <span className="ht-streak-icon">🔥</span>
               
                <span className="ht-streak-number">{habit.currentStreak} days</span>
              </div>
              <button onClick={() => openModal(habit)} className="ht-view-more-btn">
                View More
              </button>
            </div>
          </div>
        ))}
      </div>


      {habits.length === 0 && (
        <div className="ht-empty-state">
          <h2>No habits yet</h2>
          <p>Create your first habit to get started!</p>
        </div>
      )}


      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="ht-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="ht-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="ht-modal-header">
              <h2>Add New Habit</h2>
              <button onClick={() => setShowAddModal(false)} className="ht-close-btn">✕</button>
            </div>


            <div className="ht-add-habit-form">
              <input
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="Enter habit name..."
                className="ht-input"
                onKeyDown={(e) => e.key === 'Enter' && createHabit()}
                autoFocus
              />
              <div className="ht-form-buttons">
                <button onClick={() => setShowAddModal(false)} className="ht-form-cancel-btn">
                  Cancel
                </button>
                <button onClick={createHabit} className="ht-add-btn">
                  Add Habit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Delete Confirmation Dialog */}
      {confirmDialog.show && (
        <div className="ht-modal-overlay" onClick={() => setConfirmDialog({ show: false, habitId: null, habitName: '' })}>
          <div className="ht-confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ht-confirm-content">
              <h3 className="ht-confirm-title">Delete Habit</h3>
              <p className="ht-confirm-message">
                Are you sure you want to delete "<strong>{confirmDialog.habitName}</strong>"? This action cannot be undone.
              </p>
              <div className="ht-confirm-buttons">
                <button
                  onClick={() => setConfirmDialog({ show: false, habitId: null, habitName: '' })}
                  className="ht-confirm-btn ht-confirm-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteHabit}
                  className="ht-confirm-btn ht-confirm-btn-primary"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Monthly View Modal */}
      {showModal && selectedHabit && (
        <div className="ht-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="ht-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ht-modal-header">
              <h2>{selectedHabit.name}</h2>
              <button onClick={() => setShowModal(false)} className="ht-close-btn">✕</button>
            </div>


            <div className="ht-month-navigation">
              <button onClick={() => navigateMonth(-1)} className="ht-nav-btn">‹</button>
              <h3>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
              <button onClick={() => navigateMonth(1)} className="ht-nav-btn">›</button>
            </div>


            {monthlyStats && (
              <>
                <div className="ht-monthly-stats">
                  <div className="ht-stat-item">
                    <span>Completion Rate</span>
                    <span>{monthlyStats.completionRate}%</span>
                  </div>
                  <div className="ht-stat-item">
                    <span>Completed Days</span>
                    <span>{monthlyStats.completedDays}/{monthlyStats.daysInMonth}</span>
                  </div>
                  <div className="ht-stat-item">
                    <span>Current Streak</span>
                    <span>{monthlyStats.currentStreak} days</span>
                  </div>
                  <div className="ht-stat-item">
                    <span>Longest Streak</span>
                    <span>{monthlyStats.longestStreak} days</span>
                  </div>
                </div>


                <div className="ht-calendar">
                  <div className="ht-calendar-header">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="ht-calendar-day-header">{day}</div>
                    ))}
                  </div>
                  <div className="ht-calendar-body">
                    {getMonthCalendar().map((dayData, index) => (
                      <div
                        key={index}
                        className={`ht-calendar-day ${
                          dayData ? (dayData.completed ? 'completed' : dayData.canCheck ? 'available' : 'future') : 'empty'
                        }`}
                        onClick={async () => {
                          if (dayData && dayData.canCheck) {
                            await toggleHabitLog(selectedHabit._id, dayData.date);
                            await fetchMonthlyStats(selectedHabit._id, monthlyStats.year, monthlyStats.month);
                          }
                        }}
                      >
                        {dayData?.day}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}


      {/* Global Stats Modal */}
      {showGlobalStats && globalStats && (
        <div className="ht-modal-overlay" onClick={() => setShowGlobalStats(false)}>
          <div className="ht-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ht-modal-header">
              <h2>Global Statistics</h2>
              <button onClick={() => setShowGlobalStats(false)} className="ht-close-btn">✕</button>
            </div>


            <div className="ht-global-stats">
              <div className="ht-motivational-message">
                {globalStats.motivationalMessage}
              </div>


              <div className="ht-global-overview">
                <div className="ht-stat-card">
                  <h4>Total Habits</h4>
                  <span className="ht-stat-value">{globalStats.totalHabits}</span>
                </div>
                <div className="ht-stat-card">
                  <h4>Combined Streak</h4>
                  <span className="ht-stat-value">{globalStats.totalCurrentStreak} days</span>
                </div>
                <div className="ht-stat-card">
                  <h4>Best Streak Ever</h4>
                  <span className="ht-stat-value">{globalStats.longestStreakEver} days</span>
                </div>
                <div className="ht-stat-card">
                  <h4>Average Completion</h4>
                  <span className="ht-stat-value">{globalStats.averageCompletionRate}%</span>
                </div>
              </div>


              <div className="ht-habit-breakdown">
                <h3>Habit Breakdown</h3>
                {globalStats.habitDetails.map((habit) => (
                  <div key={habit.id} className="ht-habit-summary">
                    <span className="ht-habit-summary-name">{habit.name}</span>
                    <div className="ht-habit-summary-stats">
                      <span>Current: {habit.currentStreak}d</span>
                      <span>Best: {habit.longestStreak}d</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Notification */}
      {notification.show && (
        <div className={`ht-notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};


export default HabitTracker;





