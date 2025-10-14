const mongoose = require("mongoose");

const habitLogSchema = new mongoose.Schema({
 date: {
   type: Date,
   required: true,
 },
 completed: {
   type: Boolean,
   default: false,
 },
}, { _id: false });

const habitSchema = new mongoose.Schema({
 name: {
   type: String,
   required: true,
   trim: true,
 },
 user: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "User",
   required: true,
 },
 logs: [habitLogSchema],
 currentStreak: {
   type: Number,
   default: 0,
 },
 longestStreak: {
   type: Number,
   default: 0,
 },
 createdAt: {
   type: Date,
   default: Date.now,
 },
});

// Method to calculate streaks
habitSchema.methods.calculateStreaks = function() {
 if (this.logs.length === 0) {
   this.currentStreak = 0;
   this.longestStreak = 0;
   return;
 }

 // Sort logs by date (newest first)
 const sortedLogs = this.logs
   .filter(log => log.completed)
   .sort((a, b) => new Date(b.date) - new Date(a.date));

 let currentStreak = 0;
 let longestStreak = 0;
 let tempStreak = 0;

 const today = new Date();
 today.setHours(0, 0, 0, 0);

 // Calculate current streak
 for (let i = 0; i < sortedLogs.length; i++) {
   const logDate = new Date(sortedLogs[i].date);
   logDate.setHours(0, 0, 0, 0);
  
   const expectedDate = new Date(today);
   expectedDate.setDate(today.getDate() - i);

   if (logDate.getTime() === expectedDate.getTime()) {
     currentStreak++;
   } else {
     break;
   }
 }

 // Calculate longest streak
 const allLogs = this.logs
   .sort((a, b) => new Date(a.date) - new Date(b.date));

 for (let log of allLogs) {
   if (log.completed) {
     tempStreak++;
     longestStreak = Math.max(longestStreak, tempStreak);
   } else {
     tempStreak = 0;
   }
 }

 this.currentStreak = currentStreak;
 this.longestStreak = longestStreak;
};

module.exports = mongoose.model("Habit", habitSchema);
