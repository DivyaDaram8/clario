const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  lastReadSection: { type: Number, default: 0 },
  progress: { type: Number, default: 0 }, // calculated automatically
  status: { 
    type: String, 
    enum: ['not_started', 'in_progress', 'completed'], 
    default: 'not_started' 
  },
  bookmarked: { type: Boolean, default: false }
}, { timestamps: true }); // adds createdAt + updatedAt automatically

module.exports = mongoose.model('UserProgress', UserProgressSchema);