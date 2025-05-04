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
// const paymentRoutes = require("./routes/paymentRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const User = require("./models/userModel");
const Course = require("./models/courseModel");
const fs = require("fs");

const app = express();


// vinit yeh tera code 

// const corsOptions = {
//   origin: "https://sigmaitacademy.com",
//   credentials: true,
// };

// app.use(cors(corsOptions));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: corsOptions,
// });

// idhar se mera 

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173', // Local development
      'https://sigmaitacademy.com', // Production domain
      
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: corsOptions,
});

// yaha tak 

// Special handling for Stripe webhook route
// This must be defined before the express.json() middleware
// app.post("/api/payment/webhook", express.raw({ type: "application/json" }));

// For other routes, parse JSON
// app.use((req, res, next) => {
//   if (req.originalUrl === "/api/payment/webhook") {
//     next();
//   } else {
//     express.json()(req, res, next);
//   }
// });

// app.use(express.urlencoded({ extended: true }));
// app.use(cors(corsOptions));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Image Upload Config (Multer)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Create a unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  console.log("File being processed:", file);

  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("Only image files are allowed!"), false);
  }

  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed!"), false);
  }

  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
}).single("image"); // Specify the field name here

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;

const JWT_SECRET = process.env.JWT_SECRET || "xnsbddjsrrdsvinitgreat";

// Connect to MongoDB
const dbURL =
  process.env.MONGO_URI ||
  "mongodb+srv://vinitsharma1650:Zk4PqpWmNtV04NRO@cluster0.fgsqb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
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

// Middleware to verify JWT
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

// Admin Middleware to check if user is admin
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }
  next();
};

// Verify Admin Status Route
app.get("/api/auth/verify-admin", authMiddleware, (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        isAdmin: false,
        message: "Access denied. Admin only.",
      });
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
    console.error("Error verifying admin status:", error);
    res.status(500).json({ error: "Error verifying admin status" });
  }
});

// Socket.io Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error("Invalid token"));
    socket.user = decoded;
    next();
  });
});

// Upload Middleware
const uploadMiddleware = (req, res, next) => {
  upload(req, res, function (err) {
    // Debug logging
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Form Data:", req.body);
    console.log("Files:", req.files);
    console.log("File:", req.file);

    if (err instanceof multer.MulterError) {
      console.error("Multer Error:", err);
      return res.status(400).json({
        error: "File upload error",
        details: err.message,
      });
    } else if (err) {
      console.error("Other Upload Error:", err);
      return res.status(400).json({
        error: "File upload error",
        details: err.message,
      });
    }
    next();
  });
};

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
    console.log("Registration attempt with email:", email);

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

// // Admin Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt with email:", req.body);

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const user = await User.findOne({ email });
    // console.log("User found:", user);

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // OPTIONAL ROLE VALIDATION (allow only 'admin' or 'user')
    // if (user.role !== "admin") {
    //   return res.status(403).json({ error: "Access denied. Admins only." });
    // }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
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
    console.error("Error during user login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// **COURSE ROUTES**

// Add Course (Admin only)
app.post(
  "/courses",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "Please upload a course image",
          details: "No image file was received",
        });
      }

      const { title, description, duration, category } = req.body;

      // Validate required fields
      if (!title || !description || !duration || !category) {
        return res.status(400).json({
          error: "Missing required fields",
          details: "All fields are required",
        });
      }

      const newCourse = new Course({
        title: title.trim(),
        description: description.trim(),
        duration: duration.trim(),
        // price: Number(price),
        category,
        // videoUrl: videoUrl.trim(),
        image: req.file.filename,
        createdBy: req.user.id,
      });

      await newCourse.save();
      console.log("Course created successfully:", newCourse);
      io.emit("courseUpdate", { course: newCourse });
      res.status(201).json(newCourse);
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  }
);

// Get All Courses (Admin only)
app.get("/courses", authMiddleware, adminMiddleware, async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

// Update Course (Admin only)
app.put(
  "/courses/:id",
  authMiddleware,
  adminMiddleware,
  upload,
  async (req, res) => {
    try {
      const { title, description, duration, category } = req.body;
      const updateData = {
        title,
        description,
        duration,
        // price: Number(price),
        category,
        // videoUrl,
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

      res.json({
        message: "Course updated successfully",
        course: updatedCourse,
      });
    } catch (error) {
      console.error("Error updating course:", error);
      res.status(500).json({ error: "Error updating course" });
    }
  }
);

// Delete Course (Admin only)
app.delete(
  "/courses/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
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
  }
);

// Add this new route for public course listing
app.get("/api/courses/public", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses" });
  }
});

// Get user data - MUST BE BEFORE MODULE ROUTES
app.get("/api/users/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      username: user.username,
      name: user.username, // Using username as name if no separate name field
      role: user.role,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Error fetching user data" });
  }
});

// Get user profile
app.get("/api/users/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name || user.username,
      role: user.role,
      phone: user.phone,
      address: user.address,
      purchasedCourses: user.purchasedCourses,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Error fetching user profile" });
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
app.delete(
  "/api/users/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
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
  }
);

// Dashboard stats (Admin only)
app.get(
  "/api/dashboard/stats",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const totalStudents = await User.countDocuments();
      const totalCourses = await Course.countDocuments();
      res.json({ totalStudents, totalCourses });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ error: "Error fetching dashboard stats" });
    }
  }
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
// app.use("/api/payment", paymentRoutes);
app.use("/api/transactions", transactionRoutes);

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
