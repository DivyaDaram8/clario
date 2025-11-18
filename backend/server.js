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

// Basic env validation
const { MONGO_URI, PORT = 5000, FRONTEND_URL, NODE_ENV } = process.env;
if (!MONGO_URI) {
  console.error("FATAL: MONGO_URI is not set in environment");
  process.exit(1);
}

// Trust proxy if behind Render/Vercel/Heroku
app.set("trust proxy", 1);

// Middlewares
app.use(helmet());
app.use(compression());
app.use(express.json());

// Configure CORS: allow specific origin in production
const corsOptions = NODE_ENV === "production"
  ? { origin: FRONTEND_URL || "https://your-frontend-domain.com", optionsSuccessStatus: 200 }
  : { origin: true }; // allow all in dev (change if you want)
app.use(cors(corsOptions));

if (NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Basic rate limiter — tune for your app
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200, // limit each IP to 200 requests per windowMs
  message: { message: "Too many requests, please try again later." },
});
app.use(limiter);

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

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler (must be last middleware)
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI, {
    // mongoose v6+ doesn't require options, but leaving these is harmless
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGINT", () => {
  console.info("SIGINT received — closing MongoDB connection");
  mongoose.connection.close(false, () => {
    console.log("MongoDB connection closed.");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.info("SIGTERM received — closing MongoDB connection");
  mongoose.connection.close(false, () => {
    console.log("MongoDB connection closed.");
    process.exit(0);
  });
});
