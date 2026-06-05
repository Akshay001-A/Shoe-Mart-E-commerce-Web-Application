/**
 * =================================================================================
 * SHOE MART EXPRESS BACKEND GATEWAY (server.js)
 * =================================================================================
 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// IMPORT ROUTES
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chat", chatRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Shoe Mart API is online and running successfully!");
});

const PORT = process.env.PORT || 5000;

// DATABASE CONNECTION
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🚀 MongoDB Connected successfully!");

    app.listen(PORT, () => {
      console.log(`📡 Backend Server listening on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });