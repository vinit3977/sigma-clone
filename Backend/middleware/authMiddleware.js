const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token received from header:", token);
    }

    if (!token) {
      console.log("No token found in request");
      return res.status(401).json({ error: "Not authorized, no token" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
      console.log("Decoded token payload:", decoded);
      console.log("Looking for user with id:", decoded.id);

      // Check if token has expired
      if (decoded.exp * 1000 < Date.now()) {
        console.log("Token has expired");
        return res.status(401).json({ error: "Token expired" });
      }

      const user = await User.findById(decoded.id).select("-password");
      console.log("Found user:", user);

      if (!user) {
        console.log("No user found for token");
        return res.status(401).json({ error: "Not authorized, user not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: "Token expired" });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: "Invalid token" });
      }
      return res.status(401).json({ error: "Not authorized, token failed" });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authorized" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized as admin" });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { protect, adminMiddleware };
