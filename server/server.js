const path = require("path");
const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const requestLogger = require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/quickbite";

// 1. CORS Middleware (Supports production CORS_ORIGIN env var for Render)
const corsOrigin = process.env.CORS_ORIGIN || "*";
const corsOptions = corsOrigin === "*" ? {} : { origin: corsOrigin.split(",").map(o => o.trim()), credentials: true };
app.use(cors(corsOptions));

// 2. Body Parser Middleware
app.use(express.json());

// 3. Global Request Logger Middleware
app.use(requestLogger);

// 4. API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/restaurants", restaurantRoutes);
app.use("/api/v1/orders", orderRoutes);

// Health check API endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "QuickBite Online Food Ordering API is running",
    version: "v1",
    status: "healthy"
  });
});

// 5. Serve Frontend Static Assets (if client/dist exists)
const clientDistPath = path.join(__dirname, "../client/dist");
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.status(200).json({
      message: "QuickBite Online Food Ordering API is running",
      version: "v1",
    });
  });
}

// 6. 404 Route Handler for unhandled API endpoints
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// 7. Global Error Handler Middleware (MUST be the final middleware)
app.use(errorHandler);

// 8. Connect to MongoDB and Start Server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`[MongoDB] Connected successfully to: ${MONGO_URI}`);
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[QuickBite Server] Server listening on port ${PORT}`);
      console.log(`[API Base] http://localhost:${PORT}/api/v1/`);
    });
  })
  .catch((err) => {
    console.error(`[MongoDB] Connection error:`, err.message);
    // Still start server to facilitate testing or debugging on Render
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[QuickBite Server] Running without active MongoDB connection on port ${PORT}`);
    });
  });
