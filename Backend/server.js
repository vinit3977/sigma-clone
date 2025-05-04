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
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const User = require("./models/userModel");
const Course = require("./models/courseModel");
const fs = require("fs");

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://sigmaitacademy.com",
  ],
  credentials: true,
};

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: corsOptions,
});

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/) || !file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "xnsbddjsrrdsvinitgreat";
const dbURL = process.env.MONGO_URI || "your-mongodb-connection-url";

mongoose.connect(dbURL)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

// JWT Middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

// Admin Middleware
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }
  next();
};

// Verify Admin Route
app.get("/api/auth/verify-admin", authMiddleware, (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ isAdmin: false, message: "Access denied. Admin only." });
    }
    res.json({
      isAdmin: true,
      user: {
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error verifying admin status" });
  }
});

// Upload Middleware
const uploadMiddleware = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError || err) {
      return res.status(400).json({ error: "File upload error", details: err.message });
    }
    next();
  });
};

// Socket.io auth
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication error"));
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error("Invalid token"));
    socket.user = decoded;
    next();
  });
});

io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Emit stats update
const emitStatsUpdate = async () => {
  const totalStudents = await User.countDocuments();
  const totalCourses = await Course.countDocuments();
  io.emit("statsUpdate", { totalStudents, totalCourses });
};

// Register
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
    const newUser = new User({ email, password: hashedPassword, username, role: "user" });
    await newUser.save();
    await emitStatsUpdate();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
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
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add Course (Admin)
app.post("/courses", authMiddleware, adminMiddleware, uploadMiddleware, async (req, res) => {
  try {
    const { title, description, duration, category } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a course image" });
    }
    if (!title || !description || !duration || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const newCourse = new Course({
      title: title.trim(),
      description: description.trim(),
      duration: duration.trim(),
      category,
      image: req.file.filename,
      createdBy: req.user.id,
    });
    await newCourse.save();
    io.emit("courseUpdate", { course: newCourse });
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// Get All Courses (Admin)
app.get("/courses", authMiddleware, adminMiddleware, async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

// Update Course (Admin)
app.put("/courses/:id", authMiddleware, adminMiddleware, upload, async (req, res) => {
  try {
    const { title, description, duration, category } = req.body;
    const updateData = { title, description, duration, category };
    if (req.file) {
      updateData.image = req.file.filename;
    }
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json({ message: "Course updated successfully", course: updatedCourse });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// Attach other routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
