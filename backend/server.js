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

// ----- ENV -----
const {
  MONGO_URI,
  PORT = 5000,
  FRONTEND_URL,
  NODE_ENV = "development",
} = process.env;

console.log("Starting server…");
console.log("NODE_ENV:", NODE_ENV);
console.log("FRONTEND_URL:", FRONTEND_URL);

// Fail fast if no DB
if (!MONGO_URI) {
  console.error("FATAL: MONGO_URI missing");
  process.exit(1);
}

// Trust Render proxy
app.set("trust proxy", 1);

// ----- Middlewares -----
app.use(helmet());
app.use(compression());
app.use(express.json());

// ----- CORS ALLOWLIST -----
const allowlist = [
  FRONTEND_URL,                                  // deployed frontend
  "https://clario-frontend-2k1a.onrender.com",   // explicit fallback
  "http://localhost:5173",                       // local dev (Vite)
  "http://localhost:3000",                       // optional
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no Origin (curl/postman)
    if (!origin) return callback(null, true);

    if (allowlist.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(
        new Error(`CORS blocked: origin ${origin} not allowed`)
      );
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight

// ----- Logging -----
if (NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ----- Rate limiter -----
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { message: "Too many requests, try again later." },
  })
);

// ----- Health check -----
app.get("/health", (req, res) =>
  res.json({ status: "ok", uptime: process.uptime() })
);

// ----- ROUTES -----
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

// ----- 404 -----
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ----- ERROR HANDLER -----
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message || err);

  if (err.message && err.message.startsWith("CORS blocked")) {
    return res.status(403).json({ message: err.message });
  }

  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

// ----- DB + START -----
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// ----- Graceful shutdown -----
function shutdown(signal) {
  console.info(`${signal} received. Closing DB...`);
  mongoose.connection.close(false, () => {
    console.log("MongoDB closed. Exiting.");
    process.exit(0);
  });
}
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SI
