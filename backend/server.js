// server.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const app = express();

const {
  MONGO_URI,
  PORT = 5000,
  FRONTEND_URL,
  NODE_ENV = "development",
} = process.env;

console.log("NODE_ENV:", NODE_ENV);
console.log("FRONTEND_URL:", FRONTEND_URL);

// Fail fast
if (!MONGO_URI) {
  console.error("FATAL: MONGO_URI is not set");
  process.exit(1);
}

app.set("trust proxy", 1);

// Middlewares
app.use(helmet());
app.use(compression());
app.use(express.json());

// CORS allowlist
const allowlist = [
  FRONTEND_URL,
  "https://clario-frontend-2k1a.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowlist.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Use cors middleware properly (pass the middleware function)
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // <-- CORRECT: pass cors(corsOptions) here

// Logging
if (NODE_ENV !== "production") app.use(morgan("dev"));
else app.use(morgan("combined"));

// Rate limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { message: "Too many requests, slow down!" },
  })
);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok", uptime: process.uptime() }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/notes", require("./routes/noteRoutes"));
app.use("/api/todos", require("./routes/todoRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/pomodoro", require("./routes/PomodoroRoutes"));
app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api/userProgress", require("./routes/userProgressRoutes"));
app.use("/api/summarizer", require("./routes/summarizerRoutes"));
app.use("/api/habits", require("./routes/habitRoutes"));
app.use("/api/journal", require("./routes/journalRoutes"));

// 404
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Error handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err && err.stack ? err.stack : err);
  if (err && err.message && err.message.includes("CORS")) {
    return res.status(403).json({ message: err.message });
  }
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// Connect & Start
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Graceful shutdown
function gracefulShutdown(signal) {
  console.log(`${signal} received — closing MongoDB connection`);
  mongoose.connection.close(false, () => {
    console.log("MongoDB connection closed.");
    process.exit(0);
  });
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
