const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: corsOptions
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use("/uploads", express.static("uploads")); // Serve uploaded images

const PORT = process.env.PORT || 5000;

const SECRET_KEY = process.env.SECRET_KEY || "mysecretkey";

// Connect to MongoDB
const dbURL = process.env.MONGO_URI;
main()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbURL);
}

// User Schema (Admin and Regular Users)
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
});
const User = mongoose.model("User", UserSchema);

// Course Schema
const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  duration: String,
  price: Number,
  category: String,
  image: String,
});
const Course = mongoose.model("Course", CourseSchema);

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid Token" });
    req.user = decoded;
    next();
  });
};

// Admin Middleware to check if user is admin
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }
  next();
};

// Verify Admin Status Route
app.get("/api/auth/verify-admin", authMiddleware, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        isAdmin: false, 
        message: "Access denied. Admin only." 
      });
    }
    res.json({ 
      isAdmin: true, 
      user: {
        username: req.user.username,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error("Error verifying admin status:", error);
    res.status(500).json({ error: "Error verifying admin status" });
  }
});

// Image Upload Config (Multer)
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Socket.io Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return next(new Error("Invalid token"));
    socket.user = decoded;
    next();
  });
});

// Socket.io Connection Handler
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Function to emit stats update
const emitStatsUpdate = async () => {
  const totalStudents = await User.countDocuments();
  const totalCourses = await Course.countDocuments();
  io.emit("statsUpdate", { totalStudents, totalCourses });
};

// **ADMIN ROUTES**

// User Registration
app.post("/api/auth/register", async (req, res) => {
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
      role: 'user' // Force role to be 'user' only
    });

    await newUser.save();
    await emitStatsUpdate();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Admin Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ 
      username: user.username,
      role: user.role,
      userId: user._id 
    }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ token, user: { 
      username: user.username,
      email: user.email,
      role: user.role
    }});
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// **COURSE ROUTES**

// Add Course (Admin only)
app.post(
  "/courses",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  async (req, res) => {
    const { title, description, duration, price, category } = req.body;
    const image = req.file ? req.file.filename : "";

    const newCourse = new Course({
      title,
      description,
      duration,
      price,
      category,
      image,
    });
    await newCourse.save();
    await emitStatsUpdate();
    io.emit("courseUpdate");
    res.json({ message: "Course added successfully" });
  }
);

// Get All Courses (Admin only)
app.get("/courses", authMiddleware, adminMiddleware, async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

// Update Course (Admin only)
app.put("/courses/:id", authMiddleware, adminMiddleware, upload.single("image"), async (req, res) => {
    try {
        const { title, description, duration, price, category } = req.body;
        const updateData = { 
            title, 
            description, 
            duration, 
            price: Number(price), 
            category 
        };

        if (req.file) {
            updateData.image = req.file.filename;
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id, 
            updateData,
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ error: "Course not found" });
        }

        res.json({ message: "Course updated successfully", course: updatedCourse });
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ error: "Error updating course" });
    }
});

// Delete Course (Admin only)
app.delete("/courses/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        if (!deletedCourse) {
            return res.status(404).json({ error: "Course not found" });
        }
        await emitStatsUpdate();
        io.emit("courseUpdate");
        res.json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ error: "Error deleting course" });
    }
});

// Add this new route for public course listing
app.get("/api/courses/public", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses" });
  }
});

// Get all users (Admin only)
app.get("/api/users", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 });
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Error fetching users" });
    }
});

// Delete user (Admin only)
app.delete("/api/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        await emitStatsUpdate();
        io.emit("userUpdate");
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Error deleting user" });
    }
});

// Dashboard stats (Admin only)
app.get("/api/dashboard/stats", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const totalStudents = await User.countDocuments();
        const totalCourses = await Course.countDocuments();
        res.json({ totalStudents, totalCourses });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ error: "Error fetching dashboard stats" });
    }
});

// Start Server
httpServer.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${PORT}`));
