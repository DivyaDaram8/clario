import React, { useState, useEffect, useRef } from 'react';
import { apiRequest } from '../api';
import '../styles/Pomodoro.css';
import NavbarLeft from "../layout/NavbarLeft";
import NavbarTop from "../layout/NavbarTop";

const Pomodoro = () => {
  const [pomodoroData, setPomodoroData] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentType, setCurrentType] = useState('pomodoro');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePanel, setActivePanel] = useState('home');
  const [notification, setNotification] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [tempSettings, setTempSettings] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState({
    start: false,
    pause: false,
    reset: false,
    skip: false,
    settings: false,
    category: false
  });

  const intervalRef = useRef(null);
  const notificationTimeoutRef = useRef(null);

  useEffect(() => {
    loadPomodoroData();
  }, []);

  const loadPomodoroData = async () => {
    setIsPageLoading(true);
    try {
      const data = await apiRequest('/pomodoro');
      setPomodoroData(data);
      setTempSettings(data.settings);
      if (data.currentSession.isActive) {
        setCurrentTime(data.currentSession.timeRemaining);
        setCurrentType(data.currentSession.sessionType);
        setSelectedCategory(data.currentSession.selectedCategory);
        setIsActive(true);
        setIsPaused(data.currentSession.isPaused);
      } else {
        const defaultTime = data.settings[getCurrentTimeKey(data.currentSession.sessionType)] * 60;
        setCurrentTime(defaultTime);
        setCurrentType(data.currentSession.sessionType);
      }
    } catch (error) {
      showNotification('Error loading data: ' + error.message, 'error');
    } finally {
      setIsPageLoading(false);
    }
  };

  const getCurrentTimeKey = (type) => {
    switch (type) {
      case 'shortBreak': return 'shortBreakTime';
      case 'longBreak': return 'longBreakTime';
      default: return 'pomodoroTime';
    }
  };

  useEffect(() => {
    if (isActive && !isPaused && currentTime > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev - 1;
          if (newTime % 10 === 0) {
            updateSessionOnServer({ timeRemaining: newTime });
          }
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, isPaused, currentTime]);

  useEffect(() => {
    if (isActive && currentTime === 0) {
      completeSession();
    }
  }, [currentTime, isActive]);

  const updateSessionOnServer = async (updates) => {
    if (!isActive) return;
    try {
      await apiRequest('/pomodoro/session/update', 'PUT', updates);
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const startSession = async () => {
    setActionLoading(prev => ({ ...prev, start: true }));
    try {
      const timeInSeconds = pomodoroData.settings[getCurrentTimeKey(currentType)] * 60;
      
      // Optimistic update
      setCurrentTime(timeInSeconds);
      setIsActive(true);
      setIsPaused(false);
      showNotification(`${currentType.charAt(0).toUpperCase() + currentType.slice(1)} started!`);

      await apiRequest('/pomodoro/session/start', 'POST', {
        sessionType: currentType,
        categoryName: selectedCategory,
        timeRemaining: timeInSeconds
      });
    } catch (error) {
      // Revert on error
      setIsActive(false);
      setIsPaused(false);
      showNotification('Error starting session: ' + error.message, 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, start: false }));
    }
  };

  const pauseSession = async () => {
    setActionLoading(prev => ({ ...prev, pause: true }));
    try {
      const newPausedState = !isPaused;
      
      // Optimistic update
      setIsPaused(newPausedState);
      showNotification(newPausedState ? 'Session paused' : 'Session resumed');

      await updateSessionOnServer({ isPaused: newPausedState });
    } catch (error) {
      // Revert on error
      setIsPaused(!isPaused);
      showNotification('Error updating session: ' + error.message, 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, pause: false }));
    }
  };

  const resetSession = async () => {
    setActionLoading(prev => ({ ...prev, reset: true }));
    try {
      // Optimistic update
      setIsActive(false);
      setIsPaused(false);
      setCurrentTime(tempSettings[getCurrentTimeKey(currentType)] * 60); // <-- Fix here
      showNotification('Session reset');

      await apiRequest('/pomodoro/session/reset', 'POST');
      // No loadPomodoroData(); just update local state
    } catch (error) {
      showNotification('Error resetting session: ' + error.message, 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, reset: false }));
    }
  };

  const completeSession = async () => {
    try {
      const actualDuration = Math.floor((tempSettings[getCurrentTimeKey(currentType)] * 60 - currentTime) / 60);
      const response = await apiRequest('/pomodoro/session/complete', 'POST', {
        actualDuration,
        isCompleted: true
      });

      setIsActive(false);
      setIsPaused(false);

      // Update stats and session info locally
      setPomodoroData(prev => ({
        ...prev,
        stats: response.stats ? response.stats : prev.stats,
        currentSession: response.currentSession ? response.currentSession : prev.currentSession,
      }));

      if (currentType === 'pomodoro') {
        showNotification('Pomodoro completed! Great work!', 'success');
      } else {
        showNotification('Break completed!');
      }
      setTimeout(() => {
        setCurrentType(response.nextSessionType);
        setCurrentTime(tempSettings[getCurrentTimeKey(response.nextSessionType)] * 60);
        if (response.nextSessionType !== 'pomodoro') {
          startNextSession(response.nextSessionType);
        }
      }, 2000);
    } catch (error) {
      showNotification('Error completing session: ' + error.message, 'error');
    }
  };

  const startNextSession = async (sessionType) => {
    try {
      const timeInSeconds = pomodoroData.settings[getCurrentTimeKey(sessionType)] * 60;
      await apiRequest('/pomodoro/session/start', 'POST', {
        sessionType,
        categoryName: selectedCategory,
        timeRemaining: timeInSeconds
      });
      setCurrentTime(timeInSeconds);
      setIsActive(true);
      setIsPaused(false);
      showNotification(`${sessionType.charAt(0).toUpperCase() + sessionType.slice(1)} started automatically!`);
    } catch (error) {
      showNotification('Error starting next session: ' + error.message, 'error');
    }
  };

  const skipBreak = async () => {
    if (currentType === 'pomodoro') return;
    setActionLoading(prev => ({ ...prev, skip: true }));
    try {
      setIsActive(false);
      setIsPaused(false);
      setCurrentType('pomodoro');
      setCurrentTime(pomodoroData.settings.pomodoroTime * 60);
      showNotification('Break skipped!');

      const response = await apiRequest('/pomodoro/session/skip-break', 'POST');
      // Update stats if returned
      if (response.stats) {
        setPomodoroData(prev => ({
          ...prev,
          stats: response.stats
        }));
      }
    } catch (error) {
      showNotification('Error skipping break: ' + error.message, 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, skip: false }));
    }
  };

  const handleTypeChange = (newType) => {
    setCurrentType(newType);
    const newTime = pomodoroData.settings[getCurrentTimeKey(newType)] * 60;
    setCurrentTime(newTime);
  };

  const createCategory = async () => {
    if (!newCategoryName.trim()) return;
    setActionLoading(prev => ({ ...prev, category: true }));
    try {
      const newCategory = await apiRequest('/pomodoro/categories', 'POST', { name: newCategoryName.trim() });
      setPomodoroData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory]
      }));
      setNewCategoryName('');
      setShowCategoryInput(false);
      showNotification('Category created successfully!');
      // No loadPomodoroData();
    } catch (error) {
      showNotification('Error creating category: ' + error.message, 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, category: false }));
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      await apiRequest(`/pomodoro/categories/${categoryId}`, 'DELETE');
      showNotification('Category deleted successfully!');
      setShowDeleteConfirm(null);
      setPomodoroData(prev => ({
        ...prev,
        categories: prev.categories.filter(cat => cat._id !== categoryId)
      }));
      // No loadPomodoroData();
    } catch (error) {
      showNotification('Error deleting category: ' + error.message, 'error');
    }
  };

  const saveSettings = async () => {
    setActionLoading(prev => ({ ...prev, settings: true }));
    try {
      await apiRequest('/pomodoro/settings', 'PUT', tempSettings);
      setPomodoroData(prev => ({
        ...prev,
        settings: tempSettings
      }));
      // Update timer if session type changed
      setCurrentTime(tempSettings[getCurrentTimeKey(currentType)] * 60);
      showNotification('Settings saved successfully!');
    } catch (error) {
      showNotification('Error saving settings: ' + error.message, 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, settings: false }));
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    clearTimeout(notificationTimeoutRef.current);
    notificationTimeoutRef.current = setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (isPageLoading) {
    return (
      <div className="pd-loading-screen">
        <div className="pd-loading-spinner"></div>
        <div>Loading...</div>
      </div>
    );
  }

  if (!pomodoroData) {
    return (
      <div className="pd-loading-screen">
        <div className="pd-loading-spinner"></div>
        <div>Loading...</div>
      </div>
    );
  }

  // For daily goal card
  const todayPomodoros = pomodoroData.stats.todayPomodoros;
  const dailyGoal = pomodoroData.settings.dailyGoal;
  const goalReached = todayPomodoros >= dailyGoal;
  const streakContinuedToday = pomodoroData.stats.streakContinuedToday ?? false;
  const currentStreak = pomodoroData.stats.currentStreak;

  return (
    
    <div className="pd-pomodoro-container">
      <NavbarLeft />
      <NavbarTop />
      {/* Main Timer Area */}
      
      <div className="pd-main-content">
        <div className="pd-timer-section">
          <div className="pd-timer-display">
            <div className={`pd-timer-circle${isActive ? ' pd-active' : ''}`}>
              <div className="pd-timer-text">
                <div className="pd-time">{formatTime(currentTime)}</div>
                <div className="pd-session-type">
                  {currentType === 'shortBreak' ? 'Short Break' : 
                   currentType === 'longBreak' ? 'Long Break' : 'Focus Time'}
                </div>
                <div className="pd-category-name">{selectedCategory}</div>
              </div>
              <svg className="pd-progress-ring" width="320" height="320">
                <circle
                  className="pd-progress-ring-background"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="transparent"
                  r="150"
                  cx="160"
                  cy="160"
                />
                <circle
                  className="pd-progress-ring-progress"
                  stroke={currentType === 'pomodoro' ? '#ff6b6b' : '#4ecdc4'}
                  strokeWidth="8"
                  fill="transparent"
                  r="150"
                  cx="160"
                  cy="160"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 150}`,
                    strokeDashoffset: `${2 * Math.PI * 150 * (1 - (pomodoroData.settings[getCurrentTimeKey(currentType)] * 60 - currentTime) / (pomodoroData.settings[getCurrentTimeKey(currentType)] * 60))}`,
                    transition: 'stroke-dashoffset 1s ease-in-out'
                  }}
                />
              </svg>
            </div>
          </div>

          <div className="pd-timer-controls" style={{ marginBottom: '12px' }}>
            {!isActive ? (
              <button className="pd-btn pd-btn-primary pd-btn-large" onClick={startSession} disabled={actionLoading.start}>
                {actionLoading.start ? (
                  <span className="pd-btn-loading">
                    <div className="pd-btn-spinner"></div>
                    Starting...
                  </span>
                ) : 'Start'}
              </button>
            ) : (
              <button className="pd-btn pd-btn-secondary pd-btn-large" onClick={pauseSession} disabled={actionLoading.pause}>
                {actionLoading.pause ? (
                  <span className="pd-btn-loading">
                    <div className="pd-btn-spinner"></div>
                    {isPaused ? 'Resuming...' : 'Pausing...'}
                  </span>
                ) : (isPaused ? 'Resume' : 'Pause')}
              </button>
            )}
            <button className="pd-btn pd-btn-outline" onClick={resetSession} disabled={actionLoading.reset}>
              {actionLoading.reset ? (
                <span className="pd-btn-loading">
                  <div className="pd-btn-spinner"></div>
                  Resetting...
                </span>
              ) : 'Reset'}
            </button>
            {(isActive && (currentType === 'shortBreak' || currentType === 'longBreak')) && (
              <button className="pd-btn pd-btn-accent" onClick={skipBreak} disabled={actionLoading.skip}>
                {actionLoading.skip ? (
                  <span className="pd-btn-loading">
                    <div className="pd-btn-spinner"></div>
                    Skipping...
                  </span>
                ) : 'Skip Break'}
              </button>
            )}
          </div>

          <div className="pd-session-selector" style={{ marginTop: '0px' }}>
            <select 
              value={currentType} 
              onChange={(e) => handleTypeChange(e.target.value)}
              className="pd-session-dropdown"
            >
              <option value="pomodoro">Focus Session</option>
              <option value="shortBreak">Short Break</option>
              <option value="longBreak">Long Break</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sidebar Toggle Button */}
      <button
        className="pd-sidebar-toggle-fixed"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'fixed',
          top: '50%',
          right: sidebarOpen ? '380px' : '20px',
          zIndex: 1000,
          transform: 'translateY(-50%)',
        }}
        aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
      >
        {sidebarOpen ? '⮞' : '⮜'}
      </button>

      {/* Sidebar */}
      <div className={`pd-sidebar ${sidebarOpen ? 'pd-sidebar-open' : 'pd-sidebar-closed'}`}>
        {sidebarOpen && (
          <div className="pd-sidebar-content">
            {/* Top Icons */}
            <div className="pd-sidebar-icons">
              <button 
                className={`pd-icon-btn ${activePanel === 'home' ? 'pd-active' : ''}`}
                onClick={() => setActivePanel('home')}
                title="Dashboard"
              >
                🏡
              </button>
              <button 
                className={`pd-icon-btn ${activePanel === 'settings' ? 'pd-active' : ''}`}
                onClick={() => setActivePanel('settings')}
                title="Settings"
              >
                ⚙
              </button>
              <button 
                className={`pd-icon-btn ${activePanel === 'statistics' ? 'pd-active' : ''}`}
                onClick={() => setActivePanel('statistics')}
                title="Analytics"
              >
                📈
              </button>
            </div>

            {/* Panel Content */}
            <div className="pd-panel-container">
              {activePanel === 'home' && (
                <div className="pd-panel-content">
                  {/* Streak & Daily Goal Cards */}
                  <div className="pd-stats-cards">
                    {/* Streak Card */}
                    <div className="pd-stat-card pd-compact">
                      <div className="pd-card-header">
                        <span className="pd-card-label">STREAK</span>
                        {streakContinuedToday && currentStreak > 0 && (
                          <div className="pd-card-status pd-success">
                            <span>Today ✅</span>
                          </div>
                        )}
                      </div>
                      <div className="pd-card-center">
                        <div className="pd-stat-main">
                          <span className="pd-emoji">🔥</span>
                          <span className="pd-card-number">{currentStreak}</span>
                        </div>
                        <div className="pd-card-bottom-text">Highest: {pomodoroData.stats.highestStreak}</div>
                      </div>
                    </div>

                    {/* Daily Goal Card */}
                    <div className="pd-stat-card pd-compact">
                      <div className="pd-card-header">
                        <span className="pd-card-label">DAILY GOAL</span>
                        {goalReached && (
                          <div className="pd-card-status pd-success">
                            <span>Today ✅</span>
                          </div>
                        )}
                      </div>
                      <div className="pd-card-center">
                        <div className="pd-stat-main">
                          <span className="pd-emoji">🎯</span>
                          <span className="pd-card-number">{todayPomodoros} / {dailyGoal}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="pd-categories-section">
                    <h3>Categories</h3>
                    <div className="pd-categories-container">
                      <div className="pd-categories-list">
                        {pomodoroData.categories.map(category => (
                          <div 
                            key={category._id}
                            className={`pd-category-item ${selectedCategory === category.name ? 'pd-active' : ''} ${isActive ? 'pd-disabled' : ''}`}
                            onClick={() => {
                              if (!isActive) setSelectedCategory(category.name);
                            }}
                            style={isActive ? { pointerEvents: 'none', opacity: 0.6 } : {}}
                          >
                            <span className="pd-category-name">{category.name}</span>
                            <div className="pd-category-actions">
                              {category.name !== 'General' && (
                                <button 
                                  className="pd-delete-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDeleteConfirm(category._id);
                                  }}
                                  disabled={isActive}
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Category - Fixed at bottom */}
                      {pomodoroData.categories.length < 25 && (
                        <div className="pd-add-category-fixed">
                          {!showCategoryInput ? (
                            <button 
                              className="pd-btn-add-category"
                              onClick={() => setShowCategoryInput(true)}
                            >
                              + Add Category
                            </button>
                          ) : (
                            <div className="pd-category-input">
                              <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Category name"
                                maxLength="50"
                                onKeyPress={(e) => e.key === 'Enter' && createCategory()}
                              />
                              <div className="pd-input-actions">
                                <button className="pd-btn pd-btn-primary pd-btn-small" onClick={createCategory} disabled={actionLoading.category}>
                                  {actionLoading.category ? (
                                    <span className="pd-btn-loading">
                                      <div className="pd-btn-spinner"></div>
                                      Adding...
                                    </span>
                                  ) : 'Add'}
                                </button>
                                <button 
                                  className="pd-btn pd-btn-outline pd-btn-small" 
                                  onClick={() => {
                                    setShowCategoryInput(false);
                                    setNewCategoryName('');
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activePanel === 'settings' && (
                <div className="pd-panel-content pd-settings-panel">
                  <h3>Settings</h3>
                  <div className="pd-settings-form">
                    <div className="pd-settings-grid">
                      <div className="pd-form-group">
                        <label>Focus Time</label>
                        <div className="pd-input-with-unit">
                          <button
                            className="pd-input-step-btn"
                            onClick={() =>
                              setTempSettings(s => ({
                                ...s,
                                pomodoroTime: Math.max(1, s.pomodoroTime - 1)
                              }))
                            }
                            disabled={actionLoading.settings}
                            type="button"
                          >-</button>
                          <span className="pd-input-value">{tempSettings?.pomodoroTime || 25}</span>
                          <button
                            className="pd-input-step-btn"
                            onClick={() =>
                              setTempSettings(s => ({
                                ...s,
                                pomodoroTime: Math.min(60, s.pomodoroTime + 1)
                              }))
                            }
                            disabled={actionLoading.settings}
                            type="button"
                          >+</button>
                          <span className="pd-unit">min</span>
                        </div>
                      </div>
                      
                      <div className="pd-form-group">
                        <label>Short Break</label>
                        <div className="pd-input-with-unit">
                          <button
                            className="pd-input-step-btn"
                            onClick={() =>
                              setTempSettings(s => ({
                                ...s,
                                shortBreakTime: Math.max(1, s.shortBreakTime - 1)
                              }))
                            }
                            disabled={actionLoading.settings}
                            type="button"
                          >-</button>
                          <span className="pd-input-value">{tempSettings?.shortBreakTime || 5}</span>
                          <button
                            className="pd-input-step-btn"
                            onClick={() =>
                              setTempSettings(s => ({
                                ...s,
                                shortBreakTime: Math.min(30, s.shortBreakTime + 1)
                              }))
                            }
                            disabled={actionLoading.settings}
                            type="button"
                          >+</button>
                          <span className="pd-unit">min</span>
                        </div>
                      </div>

                      <div className="pd-form-group">
                        <label>Long Break</label>
                        <div className="pd-input-with-unit">
                          <button
                            className="pd-input-step-btn"
                            onClick={() =>
                              setTempSettings(s => ({
                                ...s,
                                longBreakTime: Math.max(1, s.longBreakTime - 1)
                              }))
                            }
                            disabled={actionLoading.settings}
                            type="button"
                          >-</button>
                          <span className="pd-input-value">{tempSettings?.longBreakTime || 15}</span>
                          <button
                            className="pd-input-step-btn"
                            onClick={() =>
                              setTempSettings(s => ({
                                ...s,
                                longBreakTime: Math.min(60, s.longBreakTime + 1)
                              }))
                            }
                            disabled={actionLoading.settings}
                            type="button"
                          >+</button>
                          <span className="pd-unit">min</span>
                        </div>
                      </div>

                      <div className="pd-form-group">
                        <label>Daily Goal</label>
                        <div className="pd-input-with-unit">
                          <button
                            className="pd-input-step-btn"
                            onClick={() =>
                              setTempSettings(s => ({
                                ...s,
                                dailyGoal: Math.max(1, s.dailyGoal - 1)
                              }))
                            }
                            disabled={actionLoading.settings}
                            type="button"
                          >-</button>
                          <span className="pd-input-value">{tempSettings?.dailyGoal || 8}</span>
                          <button
                            className="pd-input-step-btn"
                            onClick={() =>
                              setTempSettings(s => ({
                                ...s,
                                dailyGoal: Math.min(20, s.dailyGoal + 1)
                              }))
                            }
                            disabled={actionLoading.settings}
                            type="button"
                          >+</button>
                          <span className="pd-unit">sessions</span>
                        </div>
                      </div>

                      <div className="pd-form-group">
                        <label>Long Break After</label>
                        <div className="pd-input-with-unit">
                          <button
                            className="pd-input-step-btn"
                            onClick={() =>
                              setTempSettings(s => ({
                                ...s,
                                longBreakAfter: Math.max(2, s.longBreakAfter - 1)
                              }))
                            }
                            disabled={actionLoading.settings}
                            type="button"
                          >-</button>
                          <span className="pd-input-value">{tempSettings?.longBreakAfter || 4}</span>
                          <button
                            className="pd-input-step-btn"
                            onClick={() =>
                              setTempSettings(s => ({
                                ...s,
                                longBreakAfter: Math.min(8, s.longBreakAfter + 1)
                              }))
                            }
                            disabled={actionLoading.settings}
                            type="button"
                          >+</button>
                          <span className="pd-unit">sessions</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      className="pd-btn pd-btn-primary pd-save-settings-btn" 
                      onClick={saveSettings}
                      disabled={actionLoading.settings}
                    >
                      {actionLoading.settings ? (
                        <span className="pd-btn-loading">
                          <div className="pd-btn-spinner"></div>
                          Saving...
                        </span>
                      ) : 'Save Settings'}
                    </button>
                  </div>
                </div>
              )}

              {activePanel === 'statistics' && (
                <div className="pd-panel-content">
                  <h3>Analytics</h3>
                  <div className="pd-statistics-cards">
                    {/* Overall Stats */}
                    <div className="pd-stats-overview">
                      <div className="pd-overview-card">
                        <span className="pd-overview-number">{pomodoroData.stats.totalPomodoros}</span>
                        <span className="pd-overview-label">Total Sessions</span>
                      </div>
                      <div className="pd-overview-card">
                        <span className="pd-overview-number">{formatDuration(pomodoroData.stats.totalFocusTime)}</span>
                        <span className="pd-overview-label">Total Focus Time</span>
                      </div>
                    </div>

                    {/* Category Stats */}
                    <div className="pd-category-stats">
                      <h4>By Category</h4>
                      <div className="pd-category-stats-list">
                        {pomodoroData.categories
                          .filter(cat => cat.totalPomodoros > 0)
                          .sort((a, b) => b.totalPomodoros - a.totalPomodoros)
                          .map(category => (
                          <div key={category._id} className="pd-category-stat-card">
                            <div className="pd-category-stat-header">
                              <span className="pd-category-stat-name">{category.name}</span>
                              <span className="pd-category-stat-badge">{category.totalPomodoros}</span>
                            </div>
                            <div className="pd-category-stat-details">
                              <span className="pd-focus-time">{formatDuration(category.totalFocusTime)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="pd-modal-overlay">
          <div className="pd-modal">
            <h3>Delete Category</h3>
            <p>Are you sure you want to delete this category? This action cannot be undone.</p>
            <div className="pd-modal-actions">
              <button 
                className="pd-btn pd-btn-outline" 
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button 
                className="pd-btn pd-btn-danger" 
                onClick={() => deleteCategory(showDeleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`pd-notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default Pomodoro;