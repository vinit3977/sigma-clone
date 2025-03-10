import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

    const token = localStorage.getItem("token");

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
        fetchDashboardData();
        fetchCourses();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/dashboard/stats", {
                headers: { Authorization: token }
            });
            setStats(response.data);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await axios.get("http://localhost:5000/courses", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCourses(response.data);
        } catch (error) {
            console.error("Error fetching courses:", error);
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

    const addCourse = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("duration", duration);
        formData.append("price", price);
        formData.append("category", category);
        formData.append("image", image);

        try {
            await axios.post("http://localhost:5000/courses", formData, {
                headers: { 
                    Authorization: `Bearer ${token}`, // Ensure the token is prefixed with 'Bearer'
                    "Content-Type": "multipart/form-data"
                }
            });
            fetchCourses();
            // Reset form
            setTitle("");
            setDescription("");
            setDuration("");
            setPrice("");
            setCategory("Cloud Computing");
            setImage(null);
            setPreview("");
        } catch (error) {
            console.error("Error adding course:", error);
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
                await axios.delete(`http://localhost:5000/courses/${courseId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchCourses();
                alert("Course deleted successfully");
            } catch (error) {
                console.error("Error deleting course:", error);
                alert("Error deleting course");
            }
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("duration", duration);
        formData.append("price", price);
        formData.append("category", category);
        if (image) formData.append("image", image);

        try {
            await axios.put(`http://localhost:5000/courses/${editingCourse._id}`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            fetchCourses();
            resetForm();
            alert("Course updated successfully");
        } catch (error) {
            console.error("Error updating course:", error);
            alert("Error updating course");
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
            const response = await axios.get("http://localhost:5000/api/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`http://localhost:5000/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchUsers();
                alert("User deleted successfully");
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Error deleting user");
            }
        }
    };

    useEffect(() => {
        fetchUsers();
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
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Course Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
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
                            <button type="submit">
                                {isEditing ? "Update Course" : "Add Course"}
                            </button>
                            {isEditing && (
                                <button type="button" className="cancel-btn" onClick={resetForm}>
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
                        {filteredCourses.map(course => (
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
                        ))}
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
