/**
 * =================================================================================
 * SHOE MART EXPRESS BACKEND GATEWAY (server.js)
 * =================================================================================
 * 
 * WHAT IT DOES:
 * This is the central entry point for the Node.js/Express.js backend. It:
 * 1. Loads secret credentials from the local `.env` environment.
 * 2. Establishes the database pipeline to Atlas MongoDB.
 * 3. Registers global CORS options to permit direct client connections.
 * 4. Mounts modular routes under `/api/*` namespaces.
 * 
 * WHY WE USE IT:
 * Standardizes API design. It binds all controllers, routers, and database links 
 * into a single unified listener port.
 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Load local environment files into process.env
require("dotenv").config();

// IMPORTING MODULAR ROUTERS
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

// MIDDLEWARE PIPELINE
app.use(cors()); // Enables Cross-Origin requests from the React frontend on Port 3000
app.use(express.json()); // Automatically parses incoming JSON payload request bodies

// MOUNTING SEGREGATED API ROUTE MIDDLEWARES
app.use("/api/auth", authRoutes);       // Handles registration, logins, and profiles
app.use("/api/products", productRoutes);   // Handles inventory views and modifications
app.use("/api/orders", orderRoutes);       // Handles orders, shipping addresses, and status checks
app.use("/api/chat", chatRoutes);         // Handles Gemini AI chatbot styling prompts

// Default testing endpoint to verify server activity
app.get("/", (req, res) => {
  res.send("Shoe Mart API is online and running successfully!");
});

const PORT = process.env.PORT || 5000;

// MONGOOSE CONNECTION LOOP
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🚀 MongoDB Connected successfully!");
    
    // Start active HTTP listener only after database link succeeds
    app.listen(PORT, () => {
      console.log(`📡 Backend Server listening on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });