
const mongoose = require('mongoose');

const moodCategorySchema = new mongoose.Schema({
 name: {
   type: String,
   required: true
 },
 isDefault: {
   type: Boolean,
   default: false
 }
});

const journalEntrySchema = new mongoose.Schema({
 userId: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'User',
   required: true
 },
 date: {
   type: Date,
   required: true
 },
 themeColor: {
   type: String,
   default: '#3B82F6' // Blue
 },
 content: {
   type: String,
   default: ''
 },
 moodCategory: {
   type: String,
   required: true
 },
 isMemorableDay: {
   type: Boolean,
   default: false
 }
}, {
 timestamps: true
});

// Compound index for unique date per user
journalEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

const customMoodCategorySchema = new mongoose.Schema({
 userId: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'User',
   required: true,
   unique: true
 },
 categories: [moodCategorySchema]
}, {
 timestamps: true
});

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);
const CustomMoodCategory = mongoose.model('CustomMoodCategory', customMoodCategorySchema);

module.exports = {
 JournalEntry,
 CustomMoodCategory
};
