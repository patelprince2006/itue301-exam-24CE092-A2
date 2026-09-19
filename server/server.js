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

const Restaurant = require("./models/Restaurant");
const Customer = require("./models/Customer");
const Order = require("./models/Order");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/quickbite";

// Utility to mask MongoDB URI credentials for safe logging
const maskMongoUri = (uri) => {
  return uri.replace(/\/\/(.*):(.*)@/, "//***:***@");
};

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
  const mongoStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.status(200).json({
    message: "QuickBite Online Food Ordering API is running",
    version: "v1",
    status: "healthy",
    mongodb: mongoStatus
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
      mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
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

// Helper function to auto-seed initial data if DB is empty
const autoSeedIfEmpty = async () => {
  try {
    const count = await Restaurant.countDocuments();
    if (count === 0) {
      console.log("[MongoDB Auto-Seed] Database is empty. Seeding initial data...");
      const sampleRestaurants = [
        { name: "Pizza Palace", cuisine: "Italian", rating: 4.5, isOpen: true },
        { name: "Burger Hub", cuisine: "American Fast Food", rating: 4.2, isOpen: true },
        { name: "Spice Garden", cuisine: "North Indian", rating: 4.8, isOpen: false },
        { name: "Food Corner", cuisine: "Chinese & Asian", rating: 3.9, isOpen: true },
        { name: "South Indian Express", cuisine: "South Indian", rating: 4.6, isOpen: true },
        { name: "Taco Fiesta", cuisine: "Mexican", rating: 4.4, isOpen: false },
      ];
      const inserted = await Restaurant.insertMany(sampleRestaurants);

      const customer = await Customer.create({
        name: "John Doe",
        email: "customer@example.com",
        phone: "9876543210",
        address: "123 Food Street, Navrangpura, Ahmedabad",
      });

      await Order.create({
        customerId: customer._id,
        restaurantId: inserted[0]._id,
        items: [
          { name: "Margherita Pizza", quantity: 2, price: 299 },
          { name: "Garlic Bread", quantity: 1, price: 149 },
        ],
        totalAmount: 747,
        deliveryAddress: customer.address,
        status: "pending",
      });

      console.log(`[MongoDB Auto-Seed] Successfully seeded ${inserted.length} restaurants and default customer!`);
    }
  } catch (err) {
    console.error("[MongoDB Auto-Seed Error]:", err.message);
  }
};

// 8. Connect to MongoDB and Start Server
console.log(`[MongoDB Attempt] Connecting to: ${maskMongoUri(MONGO_URI)}`);

mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(async () => {
    console.log(`[MongoDB] Connected successfully to: ${maskMongoUri(MONGO_URI)}`);
    await autoSeedIfEmpty();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[QuickBite Server] Server listening on port ${PORT}`);
      console.log(`[API Base] http://localhost:${PORT}/api/v1/`);
    });
  })
  .catch((err) => {
    console.error(`[MongoDB] Connection error:`, err.message);
    console.error(`[MongoDB Tip] Ensure MONGO_URI is set in Render Environment Variables and MongoDB Atlas IP Whitelist includes 0.0.0.0/0.`);
    // Still start server to allow static frontend / diagnostic responses on Render
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[QuickBite Server] Running without active MongoDB connection on port ${PORT}`);
    });
  });
