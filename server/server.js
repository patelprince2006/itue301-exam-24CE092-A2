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

// 1. CORS Middleware
app.use(cors());

// 2. Body Parser Middleware
app.use(express.json());

// 3. Global Request Logger Middleware
app.use(requestLogger);

// 4. Base / Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "QuickBite Online Food Ordering API is running",
    version: "v1",
  });
});

// 5. API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/restaurants", restaurantRoutes);
app.use("/api/v1/orders", orderRoutes);

// 6. 404 Route Handler
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
    app.listen(PORT, () => {
      console.log(`[QuickBite Server] Server listening on port ${PORT}`);
      console.log(`[API Base] http://localhost:${PORT}/api/v1/`);
    });
  })
  .catch((err) => {
    console.error(`[MongoDB] Connection error:`, err.message);
    // Still start server to facilitate testing or debugging
    app.listen(PORT, () => {
      console.log(`[QuickBite Server] Running without active MongoDB connection on port ${PORT}`);
    });
  });
