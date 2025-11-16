const Habit = require("../models/Habit");

// Get all habits for a user
const getHabits = async (req, res) => {
 try {
   const habits = await Habit.find({ user: req.user.id }).sort({ createdAt: -1 });
   res.json(habits);
 } catch (error) {
   console.error(error);
   res.status(500).json({ message: "Server error" });
 }
};

// Create a new habit
const createHabit = async (req, res) => {
 try {
   const { name } = req.body;

   if (!name || !name.trim()) {
     return res.status(400).json({ message: "Habit name is required" });
   }

   const habit = new Habit({
     name: name.trim(),
     user: req.user.id,
   });

   await habit.save();
   res.status(201).json(habit);
 } catch (error) {
   console.error(error);
   res.status(500).json({ message: "Server error" });
 }
};

// Update habit name
const updateHabit = async (req, res) => {
 try {
   const { name } = req.body;
   const habitId = req.params.id;

   if (!name || !name.trim()) {
     return res.status(400).json({ message: "Habit name is required" });
   }

   const habit = await Habit.findOne({ _id: habitId, user: req.user.id });

   if (!habit) {
     return res.status(404).json({ message: "Habit not found" });
   }

   habit.name = name.trim();
   await habit.save();

   res.json(habit);
 } catch (error) {
   console.error(error);
   res.status(500).json({ message: "Server error" });
 }
};

// Delete a habit
const deleteHabit = async (req, res) => {
 try {
   const habitId = req.params.id;

   const habit = await Habit.findOneAndDelete({ _id: habitId, user: req.user.id });

   if (!habit) {
     return res.status(404).json({ message: "Habit not found" });
   }

   res.json({ message: "Habit deleted successfully" });
 } catch (error) {
   console.error(error);
   res.status(500).json({ message: "Server error" });
 }
};

// Toggle habit completion for a specific date
const toggleHabitLog = async (req, res) => {
 try {
   const { date } = req.body;
   const habitId = req.params.id;

   if (!date) {
     return res.status(400).json({ message: "Date is required" });
   }

   const logDate = new Date(date);
   logDate.setHours(0, 0, 0, 0);

   // Don't allow future dates
   const today = new Date();
   today.setHours(0, 0, 0, 0);
  
   if (logDate > today) {
     return res.status(400).json({ message: "Cannot log future dates" });
   }

   const habit = await Habit.findOne({ _id: habitId, user: req.user.id });

   if (!habit) {
     return res.status(404).json({ message: "Habit not found" });
   }

   // Check if log already exists for this date
   const existingLogIndex = habit.logs.findIndex(log => {
     const existingDate = new Date(log.date);
     existingDate.setHours(0, 0, 0, 0);
     return existingDate.getTime() === logDate.getTime();
   });

   if (existingLogIndex !== -1) {
     // Toggle existing log
     habit.logs[existingLogIndex].completed = !habit.logs[existingLogIndex].completed;
   } else {
     // Create new log
     habit.logs.push({
       date: logDate,
       completed: true,
     });
   }

   // Recalculate streaks
   habit.calculateStreaks();
   await habit.save();

   res.json(habit);
 } catch (error) {
   console.error(error);
   res.status(500).json({ message: "Server error" });
 }
};

// Get monthly stats for a habit
const getMonthlyStats = async (req, res) => {
 try {
   const habitId = req.params.id;
   const { year, month } = req.query;

   const habit = await Habit.findOne({ _id: habitId, user: req.user.id });

   if (!habit) {
     return res.status(404).json({ message: "Habit not found" });
   }

   // Get logs for the specified month
   const startDate = new Date(year, month - 1, 1);
   const endDate = new Date(year, month, 0);

   const monthlyLogs = habit.logs.filter(log => {
     const logDate = new Date(log.date);
     return logDate >= startDate && logDate <= endDate;
   });

   const daysInMonth = endDate.getDate();
   const completedDays = monthlyLogs.filter(log => log.completed).length;
   const completionRate = daysInMonth > 0 ? (completedDays / daysInMonth) * 100 : 0;

   const stats = {
     habitName: habit.name,
     year: parseInt(year),
     month: parseInt(month),
     daysInMonth,
     completedDays,
     completionRate: Math.round(completionRate),
     currentStreak: habit.currentStreak,
     longestStreak: habit.longestStreak,
     logs: monthlyLogs.map(log => ({
       date: log.date,
       completed: log.completed,
     })),
   };

   res.json(stats);
 } catch (error) {
   console.error(error);
   res.status(500).json({ message: "Server error" });
 }
};

// Get global stats for all habits
const getGlobalStats = async (req, res) => {
 try {
   const habits = await Habit.find({ user: req.user.id });

   const totalHabits = habits.length;
   let totalCurrentStreak = 0;
   let totalLongestStreak = 0;
   let totalCompletionRate = 0;

   const today = new Date();
   const thisMonth = today.getMonth();
   const thisYear = today.getFullYear();

   habits.forEach(habit => {
     habit.calculateStreaks();
     totalCurrentStreak += habit.currentStreak;
     totalLongestStreak = Math.max(totalLongestStreak, habit.longestStreak);

     // Calculate this month's completion rate
     const startOfMonth = new Date(thisYear, thisMonth, 1);
     const endOfMonth = new Date(thisYear, thisMonth + 1, 0);
     const daysInMonth = endOfMonth.getDate();

     const monthlyLogs = habit.logs.filter(log => {
       const logDate = new Date(log.date);
       return logDate >= startOfMonth && logDate <= endOfMonth;
     });

     const completedDays = monthlyLogs.filter(log => log.completed).length;
     totalCompletionRate += (completedDays / daysInMonth) * 100;
   });

   const averageCompletionRate = totalHabits > 0 ? totalCompletionRate / totalHabits : 0;

   // Generate motivational message
   let motivationalMessage = "Keep going! Every small step counts.";
   if (averageCompletionRate >= 80) {
     motivationalMessage = "🔥 Outstanding! You're crushing your habits!";
   } else if (averageCompletionRate >= 60) {
     motivationalMessage = "💪 Great progress! You're building strong habits!";
   } else if (averageCompletionRate >= 40) {
     motivationalMessage = "📈 Good effort! Consistency is key!";
   } else if (averageCompletionRate >= 20) {
     motivationalMessage = "🌱 Every day is a new opportunity to grow!";
   }

   const globalStats = {
     totalHabits,
     totalCurrentStreak,
     longestStreakEver: totalLongestStreak,
     averageCompletionRate: Math.round(averageCompletionRate),
     motivationalMessage,
     habitDetails: habits.map(habit => ({
       id: habit._id,
       name: habit.name,
       currentStreak: habit.currentStreak,
       longestStreak: habit.longestStreak,
     })),
   };

   res.json(globalStats);
 } catch (error) {
   console.error(error);
   res.status(500).json({ message: "Server error" });
 }
};

module.exports = {
 getHabits,
 createHabit,
 updateHabit,
 deleteHabit,
 toggleHabitLog,
 getMonthlyStats,
 getGlobalStats,
};