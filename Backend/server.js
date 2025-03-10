const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

const app = express();
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

// User Schema (Admin Only)
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
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
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the 'Bearer' prefix
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid Token" });
    req.user = decoded;
    next();
  });
};

// Image Upload Config (Multer)
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// **ADMIN ROUTES**

// Admin Registration (Only for first-time setup)
app.post("/register", async (req, res) => {
  console.log("Received Body:", req.body); // Debugging line

  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  console.log("Final Email:", email);
  console.log("Final Password:", password);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });

    await newUser.save();
    res.json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Admin Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isValidPassword = await bcrypt.compare(password, user.password); // Added `await`
    if (!isValidPassword)
      return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ username: user.username }, SECRET_KEY, {
      expiresIn: "1h", 
    });

    res.json({ token, user }); // Send user info too
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// **COURSE ROUTES**

// Add Course
app.post(
  "/courses",
  authMiddleware,
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
    res.json({ message: "Course added successfully" });
  }
);

// Get All Courses
app.get("/courses", authMiddleware, async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

// Update Course
app.put("/courses/:id", authMiddleware, upload.single("image"), async (req, res) => {
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

// Delete Course
app.delete("/courses/:id", authMiddleware, async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        if (!deletedCourse) {
            return res.status(404).json({ error: "Course not found" });
        }
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

// Get all users
app.get("/api/users", authMiddleware, async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); // Exclude password
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Error fetching users" });
    }
});

// Delete user
app.delete("/api/users/:id", authMiddleware, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Error deleting user" });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
