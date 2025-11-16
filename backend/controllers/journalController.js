const { JournalEntry, CustomMoodCategory } = require('../models/journalModel');

// Default mood categories
const defaultMoodCategories = [
 'Happy',
 'Extremely Happy',
 'Normal',
 'Sad',
 'Very Sad',
 'Memorable',
 'Unforgettable'
];

// Create or update journal entry
exports.saveJournalEntry = async (req, res) => {
 try {
   const { date, themeColor, content, moodCategory } = req.body;
   const userId = req.user._id;

   if (!moodCategory) {
     return res.status(400).json({ message: 'Please select a category.' });
   }

   // Parse the date and set to midnight UTC
   const entryDate = new Date(date);
   entryDate.setUTCHours(0, 0, 0, 0);

   const isMemorableDay = moodCategory === 'Memorable' || moodCategory === 'Unforgettable';

   const entry = await JournalEntry.findOneAndUpdate(
     { userId, date: entryDate },
     {
       themeColor: themeColor || '#3B82F6',
       content,
       moodCategory,
       isMemorableDay
     },
     { new: true, upsert: true }
   );

   res.status(200).json({ message: 'Journal entry saved successfully', entry });
 } catch (error) {
   res.status(500).json({ message: 'Error saving journal entry', error: error.message });
 }
};

// Get journal entry by date
exports.getJournalEntry = async (req, res) => {
 try {
   const { date } = req.params;
   const userId = req.user._id;

   // Parse the date string (YYYY-MM-DD format)
   const [year, month, day] = date.split('-').map(Number);
   const entryDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));

   const entry = await JournalEntry.findOne({ userId, date: entryDate });

   if (!entry) {
     return res.status(200).json({ entry: null });
   }

   res.status(200).json({ entry });
 } catch (error) {
   res.status(500).json({ message: 'Error fetching journal entry', error: error.message });
 }
};

// Get streak data (entries for a specific month)
exports.getStreakData = async (req, res) => {
 try {
   const { year, month } = req.params;
   const userId = req.user._id;

   const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
   const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

   const entries = await JournalEntry.find({
     userId,
     date: { $gte: startDate, $lte: endDate }
   }).select('date');

   const streakDates = entries.map(entry => {
     const entryDate = new Date(entry.date);
     return entryDate.getUTCDate();
   });

   res.status(200).json({ streakDates });
 } catch (error) {
   res.status(500).json({ message: 'Error fetching streak data', error: error.message });
 }
};

// Get monthly statistics
exports.getMonthlyStatistics = async (req, res) => {
 try {
   const { year, month } = req.params;
   const userId = req.user._id;

   const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
   const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

   const entries = await JournalEntry.find({
     userId,
     date: { $gte: startDate, $lte: endDate }
   });

   // Count mood categories
   const moodCounts = {};
   let memorableDays = [];

   entries.forEach(entry => {
     moodCounts[entry.moodCategory] = (moodCounts[entry.moodCategory] || 0) + 1;
     if (entry.isMemorableDay) {
       memorableDays.push({
         date: entry.date,
         mood: entry.moodCategory
       });
     }
   });

   res.status(200).json({
     totalEntries: entries.length,
     moodCounts,
     memorableDays
   });
 } catch (error) {
   res.status(500).json({ message: 'Error fetching statistics', error: error.message });
 }
};

// Get all mood categories (default + custom)
exports.getMoodCategories = async (req, res) => {
 try {
   const userId = req.user._id;

   let customCategories = await CustomMoodCategory.findOne({ userId });

   if (!customCategories) {
     customCategories = await CustomMoodCategory.create({
       userId,
       categories: defaultMoodCategories.map(name => ({ name, isDefault: true }))
     });
   }

   res.status(200).json({ categories: customCategories.categories });
 } catch (error) {
   res.status(500).json({ message: 'Error fetching mood categories', error: error.message });
 }
};

// Add custom mood category
exports.addMoodCategory = async (req, res) => {
 try {
   const { name } = req.body;
   const userId = req.user._id;

   if (!name || name.trim() === '') {
     return res.status(400).json({ message: 'Category name is required' });
   }

   let customCategories = await CustomMoodCategory.findOne({ userId });

   if (!customCategories) {
     customCategories = await CustomMoodCategory.create({
       userId,
       categories: defaultMoodCategories.map(n => ({ name: n, isDefault: true }))
     });
   }

   if (customCategories.categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
     return res.status(400).json({ message: 'Category already exists' });
   }

   customCategories.categories.push({ name: name.trim(), isDefault: false });
   await customCategories.save();

   res.status(200).json({ message: 'Category added successfully', categories: customCategories.categories });
 } catch (error) {
   res.status(500).json({ message: 'Error adding category', error: error.message });
 }
};

// Update mood category
exports.updateMoodCategory = async (req, res) => {
 try {
   const { categoryId } = req.params;
   const { name } = req.body;
   const userId = req.user._id;

   if (!name || name.trim() === '') {
     return res.status(400).json({ message: 'Category name is required' });
   }

   const customCategories = await CustomMoodCategory.findOne({ userId });
  
   if (!customCategories) {
     return res.status(404).json({ message: 'Categories not found' });
   }

   const category = customCategories.categories.id(categoryId);

   if (!category) {
     return res.status(404).json({ message: 'Category not found' });
   }

   if (category.isDefault) {
     return res.status(400).json({ message: 'Cannot edit default categories' });
   }

   category.name = name.trim();
   await customCategories.save();

   res.status(200).json({ message: 'Category updated successfully', categories: customCategories.categories });
 } catch (error) {
   res.status(500).json({ message: 'Error updating category', error: error.message });
 }
};

// Delete mood category
exports.deleteMoodCategory = async (req, res) => {
 try {
   const { categoryId } = req.params;
   const userId = req.user._id;

   const customCategories = await CustomMoodCategory.findOne({ userId });
  
   if (!customCategories) {
     return res.status(404).json({ message: 'Categories not found' });
   }

   const category = customCategories.categories.id(categoryId);

   if (!category) {
     return res.status(404).json({ message: 'Category not found' });
   }

   if (category.isDefault) {
     return res.status(400).json({ message: 'Cannot delete default categories' });
   }

   // Use pull method to remove the subdocument
   customCategories.categories.pull(categoryId);
   await customCategories.save();

   res.status(200).json({ message: 'Category deleted successfully', categories: customCategories.categories });
 } catch (error) {
   res.status(500).json({ message: 'Error deleting category', error: error.message });
 }
};