import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const API_BASE_URL = "https://sigma-clone.onrender.com" || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user state from localStorage if available
    const savedUserData = localStorage.getItem("userData");
    return savedUserData ? JSON.parse(savedUserData) : null;
  });
  const [loading, setLoading] = useState(true);

  // Set up axios interceptor for token
  useEffect(() => {
    // Request interceptor
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        console.log("Current token from localStorage:", token);

        if (token) {
          // Don't override Content-Type if it's already set (for multipart/form-data)
          const headers = {
            Authorization: `Bearer ${token}`,
          };

          // Only set Content-Type to application/json if it's not already set
          if (!config.headers["Content-Type"]) {
            headers["Content-Type"] = "application/json";
          }

          config.headers = {
            ...config.headers,
            ...headers,
          };
        }
        return config;
      },
      (error) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
      }
    );
    // Response interceptor
    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        console.log("Response received:", response);
        return response;
      },
      (error) => {
        console.error("Response error:", error);
        if (error.response?.status === 401) {
          console.log("Token expired or invalid, logging out user");
          localStorage.removeItem("token");
          localStorage.removeItem("userData");
          setUser(null);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      // Clean up interceptors
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data) {
        const userData = {
          ...response.data,
          name: response.data.name || response.data.username, // Fallback to username if name is missing
        };

        setUser(userData);
        localStorage.setItem("userData", JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Auth check failed:", error);

      // If unauthorized, remove token and reset user state
      // if (error.response?.status === 401 || error.response?.status === 403) {
      //   localStorage.removeItem("token");
      //   localStorage.removeItem("userData");
      //   setUser(null);
      // }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log("Attempting login with email:", email);
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Login API Response:", response.data);

      if (!response.data.token) {
        throw new Error("No token received from server");
      }

      const { token, user: userData } = response.data;

      // Store token and user data
      localStorage.setItem("token", token);
      const enhancedUserData = {
        ...userData,
        name: userData.username,
        role: userData.role,
      };
      localStorage.setItem("userData", JSON.stringify(enhancedUserData));

      // Debug logging
      console.log("Stored token:", token);
      console.log("Stored user data:", enhancedUserData);
      console.log("User role:", enhancedUserData.role);

      // Set user state first
      setUser(enhancedUserData);

      // Verify admin status only if user is admin
      if (enhancedUserData.role === "admin") {
        try {
          const adminResponse = await axios.get(
            `${API_BASE_URL}/api/auth/verify-admin`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Admin verification response:", adminResponse.data);
        } catch (error) {
          console.error("Admin verification failed:", error.response?.data);
          // Don't logout on verification failure, just log the error
        }
      }

      return response.data;
    } catch (error) {
      console.error("Login error details:", error);
      console.error("Error response:", error.response?.data);
      // Clear any existing tokens on login failure
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      setUser(null);
      throw error.response?.data || error || { error: "Login failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
