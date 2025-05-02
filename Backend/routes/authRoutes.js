const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Server } = require("socket.io");
const User = require("../models/userModel");
const { protect } = require("../middleware/authMiddleware");

const emitStatsUpdate = async () => {
  const totalStudents = await User.countDocuments();
  const totalCourses = await Course.countDocuments();
  io.emit("statsUpdate", { totalStudents, totalCourses });
};

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      role: "user", // Force role to be 'user' only
    });

    await newUser.save();
    await emitStatsUpdate();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt with email:", req.body);

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const user = await User.findOne({ email });
    console.log("User found:", user);

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "7d" }
    );

    console.log("Generated token payload:", { id: user._id, email: user.email, role: user.role });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get current user
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }
});

// Verify Admin Status
router.get("/verify-admin", protect, async (req, res) => {
  try {
    console.log("Verifying admin status for user:", req.user);
    console.log("User role:", req.user?.role);
    
    if (!req.user) {
      console.log("No user found in request");
      return res.status(401).json({
        isAdmin: false,
        message: "User not authenticated"
      });
    }

    if (req.user.role !== "admin") {
      console.log("Access denied - User role is:", req.user.role);
      return res.status(403).json({
        isAdmin: false,
        message: "Access denied. Admin only."
      });
    }

    console.log("Admin access granted for user:", req.user.email);
    res.json({
      isAdmin: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        username: req.user.username,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error("Error verifying admin status:", error);
    res.status(500).json({ error: "Error verifying admin status" });
  }
});

module.exports = router;
