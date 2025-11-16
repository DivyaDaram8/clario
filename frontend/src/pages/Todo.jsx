
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Trash2, Plus, Edit, ChevronLeft, ChevronRight, Calendar, BarChart3 } from "lucide-react";
import NavbarLeft from "../layout/NavbarLeft";
import NavbarTop from "../layout/NavbarTop";
import { apiRequest } from "../api";
import { PRIORITY_ORDER } from "../utils/priority";
import "../styles/todo.css";

/* -----------------------
  UTILITY: Sort Tasks
  ----------------------- */
function sortTasks(tasks = []) {
 return [...tasks].sort((a, b) => {
   if (a.completed !== b.completed) return a.completed ? 1 : -1;
   if (PRIORITY_ORDER[a.priority] !== PRIORITY_ORDER[b.priority]) {
     return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
   }
   return (a.orderIndex || 0) - (b.orderIndex || 0);
 });
}

/* -----------------------
  useTodos Hook
  ----------------------- */
function useTodos() {
 const [categories, setCategories] = useState([]);
 const [tasksByCategory, setTasksByCategory] = useState({});
 const [selectedDate, setSelectedDate] = useState(
   new Date().toISOString().slice(0, 10)
 );
 const [loading, setLoading] = useState(false);

 const loadTasksForDate = useCallback(
   async (date = selectedDate) => {
     setLoading(true);
     try {
       const cats = await apiRequest("/todos/categories");
       setCategories(cats || []);

       const promises = (cats || []).map((c) =>
         apiRequest(`/todos/categories/${c._id}/tasks?date=${date}`)
           .then((tasks) => ({ catId: c._id, tasks }))
           .catch(() => ({ catId: c._id, tasks: [] }))
       );

       const results = await Promise.all(promises);
       const map = {};
       results.forEach((r) => {
         map[r.catId] = sortTasks(r.tasks || []);
       });
       setTasksByCategory(map);
     } catch (err) {
       console.error("Failed to load todos:", err);
     } finally {
       setLoading(false);
     }
   },
   [selectedDate]
 );

 useEffect(() => {
   loadTasksForDate(selectedDate);
 }, [loadTasksForDate, selectedDate]);

 async function createTask(categoryId, payload) {
   const task = await apiRequest(
     `/todos/categories/${categoryId}/tasks`,
     "POST",
     { ...payload, taskDate: new Date(selectedDate) }
   );

   setTasksByCategory((prev) => {
     const arr = prev[categoryId] ? [...prev[categoryId], task] : [task];
     return { ...prev, [categoryId]: sortTasks(arr) };
   });
   return task;
 }

 async function updateTask(taskId, payload) {
   const updated = await apiRequest(`/todos/tasks/${taskId}`, "PUT", payload);
   setTasksByCategory((prev) => {
     const newMap = {};
     for (const k in prev) {
       newMap[k] = sortTasks(
         prev[k].map((t) => (t._id === taskId ? updated : t))
       );
     }
     return newMap;
   });
   return updated;
 }

 async function deleteTask(taskId, categoryId) {
   await apiRequest(`/todos/tasks/${taskId}`, "DELETE");
   setTasksByCategory((prev) => {
     const arr = prev[categoryId]?.filter((t) => t._id !== taskId) || [];
     const updatedArr = arr.map((t, i) => ({ ...t, orderIndex: i }));
     return { ...prev, [categoryId]: sortTasks(updatedArr) };
   });
 }

 const reorder = async (categoryId, newArr) => {
   setTasksByCategory((prev) => ({
     ...prev,
     [categoryId]: sortTasks(newArr),
   }));

   const ops = newArr
     .filter((t) => t.priority)
     .map((t) => ({
       id: t._id,
       orderIndex: t.orderIndex,
       priority: t.priority,
     }));

   await apiRequest(
     `/todos/categories/${categoryId}/tasks/reorder`,
     "PUT",
     { tasks: ops, date: selectedDate }
   );
 };

 return {
   categories,
   tasksByCategory,
   selectedDate,
   setSelectedDate,
   loading,
   createTask,
   updateTask,
   deleteTask,
   reorder,
 };
}

/* -----------------------
  MonthlyStatsModal
  ----------------------- */
function MonthlyStatsModal({ open, onClose, selectedDate }) {
 const [monthlyStats, setMonthlyStats] = useState(null);
 const [loading, setLoading] = useState(false);

 useEffect(() => {
   if (!open) return;

   const fetchMonthlyStats = async () => {
     setLoading(true);
     try {
       const date = new Date(selectedDate);
       const year = date.getFullYear();
       const month = String(date.getMonth() + 1).padStart(2, '0');
      
       const stats = await apiRequest(
         `/todos/stats/monthly?year=${year}&month=${month}`
       );
       setMonthlyStats(stats);
     } catch (err) {
       console.error("Failed to load monthly stats:", err);
       setMonthlyStats(null);
     } finally {
       setLoading(false);
     }
   };

   fetchMonthlyStats();
 }, [open, selectedDate]);

 if (!open) return null;

 const date = new Date(selectedDate);
 const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

 const totalCompleted = monthlyStats?.totalCompleted || 0;
 const totalTasks = monthlyStats?.totalTasks || 0;
 const categoryStats = monthlyStats?.byCategory || [];

 return (
   <div className="todo-modal-overlay" onClick={onClose}>
     <div className="todo-modal-container todo-glass-modal" onClick={(e) => e.stopPropagation()}>
       <div className="todo-modal-header">
         <h2 className="todo-modal-title">📊 {monthName}</h2>
         <button className="todo-modal-close-btn" onClick={onClose}>×</button>
       </div>

       <div className="todo-modal-body">
         {loading ? (
           <div className="todo-loading-state">Loading statistics...</div>
         ) : (
           <>
             <div className="todo-stats-summary">
               <div className="todo-stats-card">
                 <span className="todo-stats-label">Total Completed</span>
                 <span className="todo-stats-value">{totalCompleted}</span>
                 <span className="todo-stats-sublabel">of {totalTasks} tasks</span>
               </div>
             </div>

             <div className="todo-stats-by-category">
               <h3>By Category</h3>
               {categoryStats.length > 0 ? (
                 categoryStats.map((stat, idx) => (
                   <div key={idx} className="todo-stat-row">
                     <span className="todo-stat-icon">{stat.icon || stat.name[0]}</span>
                     <span className="todo-stat-name">{stat.name}</span>
                     <span className="todo-stat-count">{stat.completed} / {stat.total}</span>
                   </div>
                 ))
               ) : (
                 <div className="todo-no-data">No data for this month</div>
               )}
             </div>
           </>
         )}
       </div>
     </div>
   </div>
 );
}

/* -----------------------
  DateBar (Journal Style)
  ----------------------- */
function DateBar({ selectedDate, onSelect, completedCount, onOpenStats, onOpenCalendar }) {
 const getDateString = (offset = 0) => {
   const d = new Date(selectedDate);
   d.setDate(d.getDate() + offset);
   return d.toISOString().slice(0, 10);
 };

 const formatDate = (dateStr) => {
   const d = new Date(dateStr);
   return {
     day: d.getDate(),
     month: d.toLocaleDateString('en-US', { month: 'short' }),
     year: d.getFullYear(),
     weekday: d.toLocaleDateString('en-US', { weekday: 'short' })
   };
 };

 const isToday = (dateStr) => {
   const today = new Date().toISOString().slice(0, 10);
   return dateStr === today;
 };

 const navigateDate = (offset) => {
   const d = new Date(selectedDate);
   d.setDate(d.getDate() + offset);
   onSelect(d.toISOString().slice(0, 10));
 };

 const leftDate = getDateString(-1);
 const centerDate = getDateString(0);
 const rightDate = getDateString(1);

 return (
   <div className="todo-date-bar-container">
     {/* Left Section - Stats */}
     <div className="todo-date-bar-left">
       <div className="todo-completed-count">
         <span className="todo-count-number">{completedCount}</span>
         <span className="todo-count-label">Done</span>
       </div>
       <button
         className="todo-stats-btn"
         onClick={onOpenStats}
         title="Monthly Statistics"
       >
         <BarChart3 size={18} />
       </button>
     </div>

     {/* Center Section - Date Navigation (3 dates visible) */}
     <div className="todo-date-bar-center">
       <button
         className="todo-nav-arrow-btn"
         onClick={() => navigateDate(-1)}
         title="Previous day"
       >
         <ChevronLeft size={18} />
       </button>

       {/* Left Date */}
       <button
         className="todo-date-pill"
         onClick={() => onSelect(leftDate)}
       >
         <div className="todo-date-main">
           <span className="todo-date-weekday">{formatDate(leftDate).weekday}</span>
           <span className="todo-date-day">{formatDate(leftDate).day}</span>
           <span className="todo-date-month">{formatDate(leftDate).month}</span>
         </div>
         <span className="todo-date-year">{formatDate(leftDate).year}</span>
       </button>

       {/* Center Date (Current) */}
       <button
         className={`todo-date-pill todo-date-pill-active ${isToday(centerDate) ? 'today-highlight' : ''}`}
         onClick={() => onSelect(centerDate)}
       >
         <div className="todo-date-main">
           <span className="todo-date-weekday">{formatDate(centerDate).weekday}</span>
           <span className="todo-date-day">{formatDate(centerDate).day}</span>
           <span className="todo-date-month">{formatDate(centerDate).month}</span>
         </div>
         <span className="todo-date-year">{formatDate(centerDate).year}</span>
         {isToday(centerDate) && <span className="todo-today-badge">Today</span>}
       </button>

       {/* Right Date */}
       <button
         className="todo-date-pill"
         onClick={() => onSelect(rightDate)}
       >
         <div className="todo-date-main">
           <span className="todo-date-weekday">{formatDate(rightDate).weekday}</span>
           <span className="todo-date-day">{formatDate(rightDate).day}</span>
           <span className="todo-date-month">{formatDate(rightDate).month}</span>
         </div>
         <span className="todo-date-year">{formatDate(rightDate).year}</span>
       </button>

       <button
         className="todo-nav-arrow-btn"
         onClick={() => navigateDate(1)}
         title="Next day"
       >
         <ChevronRight size={18} />
       </button>
     </div>

     {/* Right Section - Date Picker */}
     <div className="todo-date-bar-right">
       <button
         className="todo-calendar-btn"
         onClick={onOpenCalendar}
         title="Open calendar"
       >
         <Calendar size={18} />
       </button>
     </div>
   </div>
 );
}

/* -----------------------
  CalendarPickerModal (Separate Component)
  ----------------------- */
function CalendarPickerModal({ open, onClose, selectedDate, onSelectDate }) {
 const [pickerMonth, setPickerMonth] = useState(new Date(selectedDate));

 useEffect(() => {
   if (open) {
     setPickerMonth(new Date(selectedDate));
   }
 }, [open, selectedDate]);

 if (!open) return null;

 const navigatePickerMonth = (direction) => {
   const newMonth = new Date(pickerMonth);
   newMonth.setMonth(newMonth.getMonth() + direction);
   setPickerMonth(newMonth);
 };

 const handleDateSelect = (year, month, day) => {
   const newDate = new Date(year, month, day);
   onSelectDate(newDate.toISOString().slice(0, 10));
 };

 const isToday = (dateStr) => {
   const today = new Date().toISOString().slice(0, 10);
   return dateStr === today;
 };

 const year = pickerMonth.getFullYear();
 const month = pickerMonth.getMonth();
 const firstDay = new Date(year, month, 1).getDay();
 const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
 const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

 return (
   <div className="todo-modal-overlay" onClick={onClose}>
     <div className="todo-modal-container todo-glass-modal todo-calendar-modal" onClick={(e) => e.stopPropagation()}>
       <div className="todo-modal-header">
         <h2 className="todo-modal-title">Select Date</h2>
         <button className="todo-modal-close-btn" onClick={onClose}>×</button>
       </div>

       <div className="todo-modal-body">
         <div className="todo-month-navigation">
           <button className="todo-month-nav-btn" onClick={() => navigatePickerMonth(-1)}>
             <ChevronLeft size={20} />
           </button>
           <span className="todo-month-display">{monthNames[month]} {year}</span>
           <button className="todo-month-nav-btn" onClick={() => navigatePickerMonth(1)}>
             <ChevronRight size={20} />
           </button>
         </div>

         <div className="todo-calendar">
           {dayNames.map(day => (
             <div key={day} className="todo-calendar-header">{day}</div>
           ))}
           {Array.from({ length: firstDay }).map((_, i) => (
             <div key={`empty-${i}`}></div>
           ))}
           {Array.from({ length: daysInMonth }).map((_, i) => {
             const day = i + 1;
             const dayDate = new Date(year, month, day);
             const isTodayDate = isToday(dayDate.toISOString().slice(0, 10));
             return (
               <div
                 key={day}
                 className={`todo-calendar-day ${isTodayDate ? 'is-today' : ''}`}
                 onClick={() => handleDateSelect(year, month, day)}
               >
                 {day}
               </div>
             );
           })}
         </div>
       </div>
     </div>
   </div>
 );
}

/* -----------------------
  AddTaskModal
  ----------------------- */
function AddTaskModal({
 open,
 onClose,
 onCreate,
 onUpdate,
 categoryId,
 categories = [],
 task,
}) {
 const [title, setTitle] = useState("");
 const [priority, setPriority] = useState("Medium");

 useEffect(() => {
   if (open) {
     if (task) {
       setTitle(task.name);
       setPriority(task.priority || "Medium");
     } else {
       setTitle("");
       setPriority("Medium");
     }
   }
 }, [open, task]);

 if (!open) return null;

 const categoryName = categoryId
   ? categories.find((c) => c._id === categoryId)?.name || "Unknown"
   : "Choose on save";

 function handleSubmit() {
   if (!title.trim()) return alert("Task needs a title!");

   const payload = {
     name: title,
     priority,
     date: new Date().toISOString().slice(0, 10),
   };

   if (task) {
     onUpdate(task._id, payload);
   } else {
     onCreate(payload);
   }
   onClose();
 }

 function handleKeyDown(e) {
   if (e.key === "Enter") handleSubmit();
 }

 return (
   <div className="todo-modal-overlay" onClick={onClose}>
     <div className="todo-modal-container todo-glass-modal todo-task-modal" onClick={(e) => e.stopPropagation()}>
       <div className="todo-modal-header">
         <h2 className="todo-modal-title">{task ? "✏️ Edit Task" : "✨ New Task"}</h2>
         <button className="todo-modal-close-btn" onClick={onClose}>×</button>
       </div>

       <div className="todo-modal-body">
         <div className="todo-form-group">
           <label>Task Title</label>
           <input
             value={title}
             onChange={(e) => setTitle(e.target.value)}
             onKeyDown={handleKeyDown}
             placeholder="What needs to be done?"
             className="todo-modal-input"
             autoFocus
           />
         </div>

         <div className="todo-form-row">
           <div className="todo-form-group">
             <label>Priority</label>
             <select
               value={priority}
               onChange={(e) => setPriority(e.target.value)}
               className="todo-modal-select"
             >
               <option value="High">🔴 High</option>
               <option value="Medium">🟡 Medium</option>
               <option value="Low">🟢 Low</option>
             </select>
           </div>

           <div className="todo-form-group">
             <label>Category</label>
             <div className="todo-category-display">{categoryName}</div>
           </div>
         </div>
       </div>

       <div className="todo-modal-footer">
         <button className="todo-btn-secondary" onClick={onClose}>
           Cancel
         </button>
         <button className="todo-btn-primary" onClick={handleSubmit}>
           {task ? "Update" : "Create"}
         </button>
       </div>
     </div>
   </div>
 );
}

/* -----------------------
  TaskCard
  ----------------------- */
function TaskCard({ task, onToggleDone, onEdit, onDelete }) {
 const priorityColors = {
   High: "#ef4444",
   Medium: "#f59e0b",
   Low: "#10b981",
 };

 return (
   <div className="todo-task-card" style={{ borderLeftColor: priorityColors[task.priority] }}>
     <div className="todo-task-card-content">
       <div className="todo-task-main">
         <button
           onClick={() => onToggleDone(task)}
           className={`todo-task-checkbox ${task.completed ? "todo-task-checkbox-checked" : ""}`}
           type="button"
         >
           {task.completed && <span className="todo-checkmark">✓</span>}
         </button>

         <div className="todo-task-info">
           <span className={`todo-task-title ${task.completed ? "todo-task-title-completed" : ""}`}>
             {task.name || "Untitled Task"}
           </span>
         </div>
       </div>

       <div className="todo-task-actions">
         <button onClick={() => onEdit(task)} className="todo-task-action-btn" type="button">
           <Edit size={14} />
         </button>
         <button onClick={() => onDelete(task)} className="todo-task-action-btn todo-task-delete" type="button">
           <Trash2 size={14} />
         </button>
       </div>
     </div>
   </div>
 );
}

/* -----------------------
  KanbanBoard (4 Default Cards)
  ----------------------- */
function KanbanBoard({
 categories,
 tasksByCategory,
 onToggleDone,
 onEdit,
 onDelete,
 onReorder,
 onAddTask,
}) {
 function handleDragStart(e, catId, idx) {
   e.dataTransfer.setData("text/plain", JSON.stringify({ catId, idx }));
 }

 function handleDrop(e, catId, destIdx) {
   e.preventDefault();
   try {
     const { catId: srcCatId, idx: srcIdx } = JSON.parse(e.dataTransfer.getData("text/plain"));

     if (srcCatId !== catId) return;
     if (srcIdx === destIdx) return;

     const list = [...(tasksByCategory[catId] || [])];
     const moved = list[srcIdx];
     const destTask = list[destIdx];

     if (destTask && destTask.priority !== moved.priority) {
       alert("You can only reorder tasks within the same priority group!");
       return;
     }

     list.splice(srcIdx, 1);
     list.splice(destIdx, 0, moved);

     const updatedList = list.map((t, i) => {
       if (!t.priority) return t;
       const samePriorityTasks = list.filter(x => x.priority === t.priority);
       return { ...t, orderIndex: samePriorityTasks.indexOf(t) };
     });

     onReorder(catId, updatedList);
   } catch (err) {
     console.error("drag drop parse error", err);
   }
 }

 return (
   <div className="todo-kanban-container">
     {categories.slice(0, 4).map((cat) => (
       <div key={cat._id} className="todo-kanban-column">
         <div className="todo-kanban-column-header">
           <div className="todo-column-title-group">
             <span className="todo-column-icon">{cat.icon || cat.name[0]}</span>
             <h3 className="todo-column-title">{cat.name}</h3>
           </div>
           <button
             className="todo-add-task-btn"
             onClick={() => onAddTask(cat._id)}
             title="Add Task"
           >
             <Plus size={16} />
           </button>
         </div>

         <div className="todo-kanban-tasks">
           {tasksByCategory[cat._id]?.map((t, idx) => (
             <div
               key={t._id}
               draggable
               onDragStart={(e) => handleDragStart(e, cat._id, idx)}
               onDrop={(e) => handleDrop(e, cat._id, idx)}
               onDragOver={(e) => e.preventDefault()}
             >
               <TaskCard
                 task={t}
                 onToggleDone={onToggleDone}
                 onEdit={onEdit}
                 onDelete={(task) => onDelete(task, cat._id)}
               />
             </div>
           ))}

           {(!tasksByCategory[cat._id] || tasksByCategory[cat._id].length === 0) && (
             <div className="todo-empty-state">
               <p>No tasks yet</p>
             </div>
           )}
         </div>
       </div>
     ))}
   </div>
 );
}

/* -----------------------
  MAIN Todo Page
  ----------------------- */
export default function Todo() {
 const todos = useTodos();
 const [selectedCategory, setSelectedCategory] = useState(null);
 const [taskModalOpen, setTaskModalOpen] = useState(false);
 const [editingTask, setEditingTask] = useState(null);
 const [statsModalOpen, setStatsModalOpen] = useState(false);
 const [calendarModalOpen, setCalendarModalOpen] = useState(false);

 const completedCount = Object.values(todos.tasksByCategory)
   .flat()
   .filter(t => t.completed).length;

 return (
   <div className="todo-page-wrapper">
     {/* <NavbarLeft />
     <NavbarTop /> */}

     <div className="todo-main-container">
       {/* Date Bar Card */}
       <div className="todo-card todo-date-card">
         <DateBar
           selectedDate={todos.selectedDate}
           onSelect={(d) => todos.setSelectedDate(d)}
           completedCount={completedCount}
           onOpenStats={() => setStatsModalOpen(true)}
           onOpenCalendar={() => setCalendarModalOpen(true)}
         />
       </div>

       {/* Todo Container Card */}
       <div className="todo-card todo-tasks-card">
         <KanbanBoard
           categories={todos.categories}
           tasksByCategory={todos.tasksByCategory}
           onToggleDone={async (task) => {
             await todos.updateTask(task._id, { completed: !task.completed });
           }}
           onEdit={(task) => {
             const categoryId = todos.categories.find((cat) =>
               (todos.tasksByCategory[cat._id] || []).some((t) => t._id === task._id)
             )?._id;
             setSelectedCategory(categoryId);
             setEditingTask(task);
             setTaskModalOpen(true);
           }}
           onReorder={(catId, newArr) => todos.reorder(catId, newArr)}
           onDelete={(task, categoryId) => todos.deleteTask(task._id, categoryId)}
           onAddTask={(categoryId) => {
             setSelectedCategory(categoryId);

             const todayStr = new Date().toISOString().slice(0, 10);
             if (todos.selectedDate < todayStr) {
               alert("You cannot add tasks to past dates 🚫");
               return;
             }

             setEditingTask(null);
             setTaskModalOpen(true);
           }}
         />
       </div>
     </div>

     {/* Add/Edit Task Modal */}
     <AddTaskModal
       open={taskModalOpen}
       task={editingTask}
       categoryId={selectedCategory}
       categories={todos.categories}
       onClose={() => {
         setTaskModalOpen(false);
         setEditingTask(null);
         setSelectedCategory(null);
       }}
       onCreate={async (payload) => {
         const targetCat = selectedCategory || todos.categories[0]?._id;
         if (!targetCat) return alert("Create a category first");

         const todayStr = new Date().toISOString().slice(0, 10);
         if (todos.selectedDate < todayStr) {
           alert("You cannot create tasks for past dates 🚫");
           return;
         }

         await todos.createTask(targetCat, {
           ...payload,
           taskDate: new Date(todos.selectedDate),
         });

         setTaskModalOpen(false);
         setEditingTask(null);
         setSelectedCategory(null);
       }}
       onUpdate={async (taskId, payload) => {
         await todos.updateTask(taskId, payload);
         setTaskModalOpen(false);
         setEditingTask(null);
         setSelectedCategory(null);
       }}
     />

     {/* Monthly Stats Modal */}
     <MonthlyStatsModal
       open={statsModalOpen}
       onClose={() => setStatsModalOpen(false)}
       selectedDate={todos.selectedDate}
     />

     {/* Calendar Picker Modal */}
     <CalendarPickerModal
       open={calendarModalOpen}
       onClose={() => setCalendarModalOpen(false)}
       selectedDate={todos.selectedDate}
       onSelectDate={(dateStr) => {
         todos.setSelectedDate(dateStr);
         setCalendarModalOpen(false);
       }}
     />
   </div>
 );
}
