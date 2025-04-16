import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import "./Auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login(formData.email, formData.password);
      console.log("Login response:", response); // ✅ Debug: Check returned data

      if (!response || !response.user) {
        throw new Error("Invalid response from server");
      }

      const user = response.user;

      // ✅ Role-based navigation
      if (user.role === "user") {
        navigate("/");
      } else if (user.role === "admin") {
        navigate("/admin");
      } else {
        console.warn("Unknown user role:", user.role);
        setError("Unauthorized role");
        navigate("/login"); // fallback just in case
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Please sign in to your account</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>
              <i className="fas fa-envelope"></i>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-lock"></i>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? (
              <span className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i> Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>

          <Link to="/signup" className="auth-switch-link">
            Don't have an account? <span>Sign up</span>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
