const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
  sectionIndex: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true }
});

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  coverUrl: { type: String },
  summary: { type: [SectionSchema], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);
