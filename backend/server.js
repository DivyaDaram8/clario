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

// ----- Read env vars -----
const {
  MONGO_URI,
  PORT = 5000,
  FRONTEND_URL,
  NODE_ENV = "development",
} = process.env;

console.log("NODE_ENV:", NODE_ENV);
console.log("FRONTEND_URL:", FRONTEND_URL);

// fail fast if needed
if (!MONGO_URI) {
  console.error("FATAL: MONGO_URI is not set");
  process.exit(1);
}

// trust proxy for Render
app.set("trust proxy", 1);

// ----- Middlewares -----
app.use(helmet());
app.use(compression());
app.use(express.json());

// ----- CORS Allowlist -----
const allowlist = [
  FRONTEND_URL,                                // Render frontend
  "https://clario-frontend-2k1a.onrender.com", // fallback
  "http://localhost:5173",                     // local dev
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

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // preflight

// ----- Logging -----
if (NODE_ENV !== "production") app.use(morgan("dev"));
else app.use(morgan("combined"));

// ----- Rate limiter -----
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { message: "Too many requests, slow down!" },
  })
);

// ----- Health Check -----
app.get("/health", (req, res) =>
  res.json({ status: "ok", uptime: process.uptime() })
);

// ----- Your Routes -----
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

// ----- 404 Handler -----
app.use((req, res) =>
  res.status(404).json({ message: "Route not found" })
);

// ----- Error Handler (no express-async-errors) -----
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message || err);
  if (err.message && err.message.includes("CORS")) {
    return res.status(403).json({ message: err.message });
  }
  res.status(500).json({ message: "Internal Server Error" });
});

// ----- Connect & Start -----
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB error:", err);
    process.exit(1);
  });

// ----- Graceful Shutdown -----
process.on("SIGINT", () => {
  console.log("SIGINT: closing DB...");
  mongoose.connection.close(false, () => process.exit(0));
});

process.on("SIGTERM", () => {
  console.log("SIGTERM: closing DB...");
  mongoose.connection.close(false, () => process.exit(0));
});
