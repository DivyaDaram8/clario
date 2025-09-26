// server.js (Updated)
// const noteRoutes = require("./routes/noteRoutes");
// const pomodoroRoutes = require("./routes/PomodoroRoutes");

// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/notes", require("./routes/noteRoutes"));
app.use("/api/todos", require("./routes/todoRoutes"));
app.use("/api/journal", require("./routes/journalRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/pomodoro", require("./routes/PomodoroRoutes"));



const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
