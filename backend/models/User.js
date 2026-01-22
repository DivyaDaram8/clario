// models/User.js (Updated with Pomodoro fields)
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Removed required: true
  googleId: { type: String, unique: true, sparse: true } // Added this
}, { timestamps: true });

// Your existing pre-save middleware (keeping exactly as you had it)
userSchema.pre("save", async function(next) {
  // Only hash if password exists and is modified
  if (!this.password || !this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Your existing method (keeping exactly as you had it)
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);