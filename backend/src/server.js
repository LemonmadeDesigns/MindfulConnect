// backend/src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fetch from 'node-fetch'; 

import connectDB from './config/db.js';
import User from "./models/User.js"; 

// IMPORTED ROUTES
import authRoutes from "./routes/auth.js";
import moodRouter from "./routes/mood.js";
import supportGroupRouter from "./routes/supportGroups.js"; 

// Load env vars
dotenv.config();

// Initialize express
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/mood", moodRouter);
app.use("/api/support-groups", supportGroupRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: err.message,
  });
});

// For testing purposes
const testAPI = async () => {
  try {
    const response = await fetch("http://localhost:5001/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
    });
    const data = await response.json();
    console.log("Test API response:", data);
  } catch (error) {
    console.error("Test API error:", error);
  }
};

// Call it to test
// testAPI();

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    testAPI();  
});

export default app;