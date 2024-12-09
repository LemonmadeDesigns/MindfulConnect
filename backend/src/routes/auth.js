// backend/src/routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import auth from "../middleware/auth.js";
import User from "../models/User.js";

import {
  login,
  register,
  getUserProfile,
  logout,
  verifyToken,
} from "../controllers/authController.js";

const router = express.Router();

// Register endpoint
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password, // Will be hashed by the pre-save middleware
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email); // Add this log

    // Validation
    // if (!email || !password) {
    //   return res
    //     .status(400)
    //     .json({ message: "Please provide email and password" });
    // }

    // Find user
    const user = await User.findOne({ email });
    console.log("User found:", user ? "Yes" : "No"); // Add this log

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    console.log("Password valid:", isValidPassword); // Add this log

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // Send response
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify token endpoint
router.get("/verify", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      isValid: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(401).json({ message: "Token verification failed" });
  }
});

// backend/src/routes/auth.js - Add this temporary endpoint
router.post("/setup-test", async (req, res) => {
  try {
    // Check if test user already exists
    const existingUser = await User.findOne({ email: "test@example.com" });
    if (existingUser) {
      return res.json({ message: "Test user already exists" });
    }

    // Create test user
    const user = new User({
      name: "Test User",
      email: "test@example.com",
      password: "password123", // This will be hashed by the pre-save middleware
    });

    await user.save();

    res.status(201).json({
      message: "Test user created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Setup test user error:", error);
    res.status(500).json({ message: "Error creating test user" });
  }
});

// Protected routes
router.get("/profile", auth, getUserProfile);
router.post("/logout", auth, logout);

export default router;
