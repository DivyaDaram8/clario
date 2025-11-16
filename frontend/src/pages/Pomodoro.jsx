
import React, { useState, useEffect, useRef } from 'react';
import { apiRequest } from '../api';
import '../styles/Pomodoro.css';
import NavbarLeft from "../layout/NavbarLeft";
import NavbarTop from "../layout/NavbarTop";
import { Home, Settings, BarChart3, RotateCcw, Check, X } from 'lucide-react';

const Pomodoro = () => {
 const [pomodoroData, setPomodoroData] = useState(null);
 const [currentTime, setCurrentTime] = useState(0);
 const [isActive, setIsActive] = useState(false);
 const [isPaused, setIsPaused] = useState(false);
 const [currentType, setCurrentType] = useState('pomodoro');
 const [selectedCategory, setSelectedCategory] = useState('General');
 const [sidebarOpen, setSidebarOpen] = useState(false);
 const [activePanel, setActivePanel] = useState('home');
 const [notification, setNotification] = useState('');
 const [newCategoryName, setNewCategoryName] = useState('');
 const [showCategoryModal, setShowCategoryModal] = useState(false);
 const [showSessionTypeModal, setShowSessionTypeModal] = useState(false);
 const [showCategorySelectModal, setShowCategorySelectModal] = useState(false);
 const [tempSettings, setTempSettings] = useState(null);
 const [isPageLoading, setIsPageLoading] = useState(true);
 const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
 const [editingCategory, setEditingCategory] = useState(null);
 const [editCategoryName, setEditCategoryName] = useState('');
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

 const handleTimerClick = () => {
   if (!isActive) {
     startSession();
   } else {
     pauseSession();
   }
 };

 const startSession = async () => {
   setActionLoading(prev => ({ ...prev, start: true }));
   try {
     const timeInSeconds = pomodoroData.settings[getCurrentTimeKey(currentType)] * 60;
    
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
    
     setIsPaused(newPausedState);
     showNotification(newPausedState ? 'Session paused' : 'Session resumed');

     await updateSessionOnServer({ isPaused: newPausedState });
   } catch (error) {
     setIsPaused(!isPaused);
     showNotification('Error updating session: ' + error.message, 'error');
   } finally {
     setActionLoading(prev => ({ ...prev, pause: false }));
   }
 };

 const resetSession = async () => {
   setActionLoading(prev => ({ ...prev, reset: true }));
   try {
     setIsActive(false);
     setIsPaused(false);
     setCurrentTime(tempSettings[getCurrentTimeKey(currentType)] * 60);
     showNotification('Session reset');

     await apiRequest('/pomodoro/session/reset', 'POST');
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
     }, 500);
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

 const handleTypeChange = (newType) => {
   setCurrentType(newType);
   const newTime = pomodoroData.settings[getCurrentTimeKey(newType)] * 60;
   setCurrentTime(newTime);
   setShowSessionTypeModal(false);
 };

 const handleCategoryChange = (categoryName) => {
   setSelectedCategory(categoryName);
   setShowCategorySelectModal(false);
   showNotification(`Category changed to ${categoryName}`);
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
     setShowCategoryModal(false);
     showNotification('Category created successfully!');
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

 const getProgressColor = () => {
   if (currentType === 'pomodoro') return '#3b82f6';
   return '#ffffff';
 };

 const getSessionTypeLabel = () => {
   if (currentType === 'shortBreak') return 'Short Break';
   if (currentType === 'longBreak') return 'Long Break';
   return 'Focus Time';
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

 const todayPomodoros = pomodoroData.stats.todayPomodoros;
 const dailyGoal = pomodoroData.settings.dailyGoal;
 const goalReached = todayPomodoros >= dailyGoal;
 const streakContinuedToday = pomodoroData.stats.streakContinuedToday ?? false;
 const currentStreak = pomodoroData.stats.currentStreak;

 return (
   <div className="pd-pomodoro-container">
     {/* <NavbarLeft />
     <NavbarTop /> */}
    
     <div className="pd-main-content">
       <div className="pd-timer-section">
         <div className="pd-timer-display">
           <div className={`pd-timer-circle${isActive ? ' pd-active' : ''}`}>
             <div className="pd-timer-text">
               <div
                 className="pd-time"
                 onClick={handleTimerClick}
                 title={isActive ? (isPaused ? "Click to resume" : "Click to pause") : "Click to start"}
               >
                 {formatTime(currentTime)}
               </div>
               <div
                 className="pd-session-type"
                 onClick={() => (isPaused || !isActive) && setShowSessionTypeModal(true)}
                 title={(isPaused || !isActive) ? "Click to change session type" : "Cannot change during active session"}
                 style={(isPaused || !isActive) ? {} : { cursor: 'not-allowed', opacity: 0.5 }}
               >
                 {getSessionTypeLabel()}
               </div>
               <div
                 className="pd-category-name"
                 onClick={() => !isActive && setShowCategorySelectModal(true)}
                 title={isActive ? "Cannot change during session" : "Click to change category"}
                 style={isActive ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
               >
                 <span>{selectedCategory}</span>
                 {isPaused && (
                   <RotateCcw
                     size={16}
                     className="pd-reset-icon"
                     onClick={(e) => {
                       e.stopPropagation();
                       resetSession();
                     }}
                     title="Reset timer"
                   />
                 )}
               </div>
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
                 stroke={getProgressColor()}
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
       </div>
     </div>

     <button
       className="pd-sidebar-toggle-fixed"
       onClick={() => setSidebarOpen(!sidebarOpen)}
       style={{
         position: 'fixed',
         top: '50%',
         right: sidebarOpen ? '550px' : '20px',
         zIndex: 1000,
         transform: 'translateY(-50%)',
       }}
       aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
     >
       {sidebarOpen ? '⮞' : '⮜'}
     </button>

     <div className={`pd-sidebar ${sidebarOpen ? 'pd-sidebar-open' : 'pd-sidebar-closed'}`}>
       {sidebarOpen && (
         <div className="pd-sidebar-content">
           <div className="pd-sidebar-icons">
             <button
               className={`pd-icon-btn ${activePanel === 'home' ? 'pd-active' : ''}`}
               onClick={() => setActivePanel('home')}
               title="Dashboard"
             >
               <Home size={20} />
             </button>
             <button
               className={`pd-icon-btn ${activePanel === 'settings' ? 'pd-active' : ''}`}
               onClick={() => setActivePanel('settings')}
               title="Settings"
             >
               <Settings size={20} />
             </button>
             <button
               className={`pd-icon-btn ${activePanel === 'statistics' ? 'pd-active' : ''}`}
               onClick={() => setActivePanel('statistics')}
               title="Analytics"
             >
               <BarChart3 size={20} />
             </button>
           </div>

           <div className="pd-panel-container">
             {activePanel === 'home' && (
               <div className="pd-panel-content">
                 <div className="pd-stats-cards">
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

                   <div className="pd-stat-card pd-compact">
                     <div className="pd-card-header">
                       <span className="pd-card-label">DAILY GOAL</span>
                       {goalReached && (
                         <div className="pd-card-status pd-success">
                           <span>Reached</span>
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

                 <div className="pd-categories-section">
                   <h3>Categories</h3>
                   <div className="pd-categories-container">
                     <div className="pd-categories-list">
                       {pomodoroData.categories.map(category => (
                         editingCategory === category._id ? (
                           <div key={category._id} className="pd-category-item-edit">
                             <input
                               type="text"
                               value={editCategoryName}
                               onChange={(e) => setEditCategoryName(e.target.value)}
                               className="pd-category-edit-input"
                               maxLength="50"
                               onKeyPress={(e) => {
                                 if (e.key === 'Enter') saveEditCategory(category._id);
                                 if (e.key === 'Escape') cancelEditCategory();
                               }}
                               autoFocus
                             />
                             <button
                               className="pd-save-btn"
                               onClick={() => saveEditCategory(category._id)}
                               title="Save"
                             >
                               <Check size={14} />
                             </button>
                             <button
                               className="pd-cancel-btn"
                               onClick={cancelEditCategory}
                               title="Cancel"
                             >
                               <X size={14} />
                             </button>
                           </div>
                         ) : (
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
                                 <>
                                   <button
                                     className="pd-delete-btn"
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       setShowDeleteConfirm(category._id);
                                     }}
                                     disabled={isActive}
                                     title="Delete category"
                                   >
                                     ×
                                   </button>
                                 </>
                               )}
                             </div>
                           </div>
                         )
                       ))}
                     </div>

                     {pomodoroData.categories.length < 25 && (
                       <div className="pd-add-category-fixed">
                         <button
                           className="pd-btn-add-category"
                           onClick={() => setShowCategoryModal(true)}
                         >
                           + Add Category
                         </button>
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

     {/* Session Type Modal */}
     {showSessionTypeModal && (
       <div className="pd-modal-overlay" onClick={() => setShowSessionTypeModal(false)}>
         <div className="pd-modal" onClick={(e) => e.stopPropagation()}>
           <div className="pd-modal-header">
             <h3>Select Session Type</h3>
             <button onClick={() => setShowSessionTypeModal(false)} className="pd-close-btn">✕</button>
           </div>
           <div className="pd-session-options">
             <div
               className={`pd-session-option ${currentType === 'pomodoro' ? 'pd-active' : ''}`}
               onClick={() => handleTypeChange('pomodoro')}
             >
               Focus Session
             </div>
             <div
               className={`pd-session-option ${currentType === 'shortBreak' ? 'pd-active' : ''}`}
               onClick={() => handleTypeChange('shortBreak')}
             >
               Short Break
             </div>
             <div
               className={`pd-session-option ${currentType === 'longBreak' ? 'pd-active' : ''}`}
               onClick={() => handleTypeChange('longBreak')}
             >
               Long Break
             </div>
           </div>
         </div>
       </div>
     )}

     {/* Category Select Modal */}
     {showCategorySelectModal && (
       <div className="pd-modal-overlay" onClick={() => setShowCategorySelectModal(false)}>
         <div className="pd-modal" onClick={(e) => e.stopPropagation()}>
           <div className="pd-modal-header">
             <h3>Select Category</h3>
             <button onClick={() => setShowCategorySelectModal(false)} className="pd-close-btn">✕</button>
           </div>
           <div className="pd-category-options">
             {pomodoroData.categories.map(category => (
               <div
                 key={category._id}
                 className={`pd-category-option ${selectedCategory === category.name ? 'pd-active' : ''}`}
                 onClick={() => handleCategoryChange(category.name)}
               >
                 {category.name}
               </div>
             ))}
           </div>
         </div>
       </div>
     )}

     {/* Add Category Modal */}
     {showCategoryModal && (
       <div className="pd-modal-overlay" onClick={() => setShowCategoryModal(false)}>
         <div className="pd-modal" onClick={(e) => e.stopPropagation()}>
           <div className="pd-modal-header">
             <h3>Add New Category</h3>
             <button onClick={() => setShowCategoryModal(false)} className="pd-close-btn">✕</button>
           </div>

           <div className="pd-category-input">
             <input
               type="text"
               value={newCategoryName}
               onChange={(e) => setNewCategoryName(e.target.value)}
               placeholder="Enter category name..."
               maxLength="50"
               onKeyPress={(e) => e.key === 'Enter' && createCategory()}
               autoFocus
             />
             <div className="pd-input-actions">
               <button
                 className="pd-btn pd-btn-outline"
                 onClick={() => {
                   setShowCategoryModal(false);
                   setNewCategoryName('');
                 }}
               >
                 Cancel
               </button>
               <button
                 className="pd-btn pd-btn-primary"
                 onClick={createCategory}
                 disabled={actionLoading.category}
               >
                 {actionLoading.category ? (
                   <span className="pd-btn-loading">
                     <div className="pd-btn-spinner"></div>
                     Adding...
                   </span>
                 ) : 'Add Category'}
               </button>
             </div>
           </div>
         </div>
       </div>
     )}

     {/* Delete Confirmation Modal */}
     {showDeleteConfirm && (
       <div className="pd-modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
         <div className="pd-modal" onClick={(e) => e.stopPropagation()}>
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