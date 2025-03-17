import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "./AdminDashboard.css";


function AdminDashboard() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalCourses: 0,
        // activeEnrollments: 0,
        // totalRevenue: 0
    });
    const [socket, setSocket] = useState(null);
    
    // Form states
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Cloud Computing");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [users, setUsers] = useState([]);
    const [showUserManagement, setShowUserManagement] = useState(false);
    
    
    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");

    const [loading, setLoading] = useState({
        courses: false,
        users: false,
        form: false
    });
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const categories = [
        "Cloud Computing",
        "Cybersecurity",
        "Data Science and AI",
        "Software Development",
        "Networking",
        "Database Administration",
        "Project Management",
        "UX/UI Design",
        "ERP Training",
        "Digital Marketing",
        "Blockchain Development"
    ];

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        // Initialize socket connection
        const newSocket = io("http://localhost:5000", {
            auth: {
                token
            }
        });

        setSocket(newSocket);

        // Listen for real-time updates
        newSocket.on("statsUpdate", (newStats) => {
            setStats(prevStats => ({
                ...prevStats,
                ...newStats
            }));
        });

        newSocket.on("courseUpdate", () => {
            fetchCourses();
            fetchDashboardData();
        });

        newSocket.on("userUpdate", () => {
            fetchUsers();
            fetchDashboardData();
        });

        fetchDashboardData();
        fetchCourses();
        fetchUsers();

        // Cleanup socket connection
        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, [navigate]);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/dashboard/stats", config);
            setStats(response.data);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            if (error.response?.status === 401) {
                handleLogout();
            }
        }
    };

    const fetchCourses = async () => {
        setLoading(prev => ({ ...prev, courses: true }));
        try {
            const response = await axios.get("http://localhost:5000/courses", config);
            setCourses(response.data);
        } catch (error) {
            console.error("Error fetching courses:", error);
            if (error.response?.status === 401) {
                handleLogout();
            }
        } finally {
            setLoading(prev => ({ ...prev, courses: false }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const validateForm = () => {
        if (!title.trim()) {
            setError("Course title is required");
            return false;
        }
        if (!description.trim()) {
            setError("Course description is required");
            return false;
        }
        if (!duration.trim()) {
            setError("Course duration is required");
            return false;
        }
        if (!price || price <= 0) {
            setError("Valid course price is required");
            return false;
        }
        setError("");
        return true;
    };

    const addCourse = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setLoading(prev => ({ ...prev, form: true }));
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("duration", duration);
            formData.append("price", price);
            formData.append("category", category);
            if (image) {
                formData.append("image", image);
            }

            await axios.post("http://localhost:5000/courses", formData, {
                ...config,
                headers: {
                    ...config.headers,
                    "Content-Type": "multipart/form-data"
                }
            });
            
            fetchCourses();
            resetForm();
            alert("Course added successfully!");
        } catch (error) {
            console.error("Error adding course:", error);
            setError(error.response?.data?.message || "Error adding course. Please try again.");
            if (error.response?.status === 401) {
                handleLogout();
            }
        } finally {
            setLoading(prev => ({ ...prev, form: false }));
        }
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === "all" || course.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

     // Add these new functions
     const handleEdit = (course) => {
        setIsEditing(true);
        setEditingCourse(course);
        setTitle(course.title);
        setDescription(course.description);
        setDuration(course.duration);
        setPrice(course.price);
        setCategory(course.category);
        setPreview(course.image ? `http://localhost:5000/uploads/${course.image}` : "");
    };

    const handleDelete = async (courseId) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            try {
                await axios.delete(`http://localhost:5000/courses/${courseId}`, config);
                fetchCourses();
                alert("Course deleted successfully!");
            } catch (error) {
                console.error("Error deleting course:", error);
                alert(error.response?.data?.message || "Error deleting course. Please try again.");
                if (error.response?.status === 401) {
                    handleLogout();
                }
            }
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("duration", duration);
            formData.append("price", price);
            formData.append("category", category);
            if (image) {
                formData.append("image", image);
            }

            await axios.put(`http://localhost:5000/courses/${editingCourse._id}`, formData, {
                ...config,
                headers: {
                    ...config.headers,
                    "Content-Type": "multipart/form-data"
                }
            });
            
            fetchCourses();
            resetForm();
            alert("Course updated successfully!");
        } catch (error) {
            console.error("Error updating course:", error);
            alert(error.response?.data?.message || "Error updating course. Please try again.");
            if (error.response?.status === 401) {
                handleLogout();
            }
        }
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setDuration("");
        setPrice("");
        setCategory("Cloud Computing");
        setImage(null);
        setPreview("");
        setIsEditing(false);
        setEditingCourse(null);
    };

    // Add user management functions
    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/users", config);
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            if (error.response?.status === 401) {
                handleLogout();
            }
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`http://localhost:5000/api/users/${userId}`, config);
                fetchUsers();
                alert("User deleted successfully!");
            } catch (error) {
                console.error("Error deleting user:", error);
                alert(error.response?.data?.message || "Error deleting user. Please try again.");
                if (error.response?.status === 401) {
                    handleLogout();
                }
            }
        }
    };

    const verifyAdminAccess = async () => {
        try {
            if (!token) {
                // No token means not logged in, redirect to login
                window.location.href = '/login';
                return false;
            }

            const response = await fetch('http://localhost:5000/api/auth/verify-admin', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!data.isAdmin) {
                // Not an admin, redirect to login
                window.location.href = '/login';
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error verifying admin access:', error);
            window.location.href = '/login';
            return false;
        }
    };

    useEffect(() => {
        const checkAdminAccess = async () => {
            const hasAccess = await verifyAdminAccess();
            if (!hasAccess) {
                return; // Will redirect to login if not admin
            }
            // Load admin dashboard content
        };

        checkAdminAccess();
    }, []);

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Admin Dashboard</h1>
                <button className="logout-btn" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    Logout
                </button>
            </div>

            <div className="stats-container">
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h3>{stats.totalStudents}</h3>
                        <p>Total Students</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📚</div>
                    <div className="stat-info">
                        <h3>{stats.totalCourses}</h3>
                        <p>Total Courses</p>
                    </div>
                </div>


                {/* <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-info">
                        <h3>{stats.activeEnrollments}</h3>
                        <p>Active Enrollments</p>
                    </div>
                </div> */}
            
            </div>

            <div className="management-tabs">
                <button 
                    className={!showUserManagement ? "active" : ""} 
                    onClick={() => setShowUserManagement(false)}
                >
                    Manage Courses
                </button>
                <button 
                    className={showUserManagement ? "active" : ""} 
                    onClick={() => setShowUserManagement(true)}
                >
                    Manage Users
                </button>
            </div>

            {!showUserManagement ? (
                <div className="course-management">
                    <form className="form-container" onSubmit={isEditing ? handleUpdate : addCourse}>
                        <h2>{isEditing ? "Update Course" : "Add New Course"}</h2>
                        {error && <div className="error-message">{error}</div>}
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Course Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                placeholder="Course Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Duration (e.g., 3 Months)"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="number"
                                placeholder="Price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {categories.map((cat, index) => (
                                    <option key={index} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {preview && <img src={preview} alt="Preview" width="100" />}
                        </div>
                        <div className="form-actions">
                            <button type="submit" disabled={loading.form}>
                                {loading.form ? "Processing..." : (isEditing ? "Update Course" : "Add Course")}
                            </button>
                            {isEditing && (
                                <button type="button" className="cancel-btn" onClick={resetForm} disabled={loading.form}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="search-filter">
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            className="filter-select"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            {categories.map((cat, index) => (
                                <option key={index} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="courses-list">
                        {loading.courses ? (
                            <div className="loading-message">Loading courses...</div>
                        ) : filteredCourses.length === 0 ? (
                            <div className="no-courses-message">No courses found</div>
                        ) : (
                            filteredCourses.map(course => (
                                <div key={course._id} className="course-item">
                                    <div className="course-image">
                                        {course.image && (
                                            <img 
                                                src={`http://localhost:5000/uploads/${course.image}`}
                                                alt={course.title}
                                            />
                                        )}
                                    </div>
                                    <div className="course-item-content">
                                        <h4>{course.title}</h4>
                                        <p className="description">{course.description}</p>
                                        <div className="course-meta">
                                            <p>Duration: {course.duration}</p>
                                            <p>Price: ₹{course.price}</p>
                                            <p>Category: {course.category}</p>
                                        </div>
                                        <div className="course-actions">
                                            <button 
                                                className="edit-button"
                                                onClick={() => handleEdit(course)}
                                            >
                                                <i className="fas fa-edit"></i> Edit
                                            </button>
                                            <button 
                                                className="delete-button"
                                                onClick={() => handleDelete(course._id)}
                                            >
                                                <i className="fas fa-trash"></i> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ) : (
                <div className="user-management">
                    <h2>User Management</h2>
                    <div className="users-list">
                        {users.map(user => (
                            <div key={user._id} className="user-item">
                                <div className="user-info">
                                    <h4>{user.username}</h4>
                                    <p>{user.email}</p>
                                </div>
                                <div className="user-actions">
                                    <button 
                                        className="delete-button"
                                        onClick={() => handleDeleteUser(user._id)}
                                    >
                                        Delete User
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            
        </div>
    );
}

export default AdminDashboard;
