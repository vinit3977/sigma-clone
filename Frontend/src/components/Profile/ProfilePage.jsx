import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import './ProfilePage.css';

function ProfilePage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [purchasedCourses, setPurchasedCourses] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [selectedVideo, setSelectedVideo] = useState(null);

    const API_BASE_URL = "https://sigma-clone.onrender.com" || 'http://localhost:5000';

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        // Fetch user profile, purchased courses, and transactions
        const fetchUserData = async () => {
            try {
                setLoading(true);
                
                // Fetch detailed user profile
                const profileResponse = await axios.get(`${API_BASE_URL}/api/users/profile`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUserProfile(profileResponse.data);
                
                // Fetch user's purchased courses with details
                const coursesResponse = await axios.get(`${API_BASE_URL}/api/users/profile`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                // Get the course details for each purchased course
                if (coursesResponse.data.purchasedCourses && coursesResponse.data.purchasedCourses.length > 0) {
                    const coursesData = await axios.get(`${API_BASE_URL}/api/courses/public`);
                    const purchasedCoursesDetails = coursesData.data.filter(
                        course => coursesResponse.data.purchasedCourses.includes(course._id)
                    );
                    setPurchasedCourses(purchasedCoursesDetails);
                }
                
                // Fetch user's transaction history
                const transactionsResponse = await axios.get(`${API_BASE_URL}/api/transactions/user`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setTransactions(transactionsResponse.data);
                
                setLoading(false);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Failed to load user data. Please try again later.');
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user, navigate]);

    // Format date for display
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleEditProfile = () => {
        setIsEditing(true);
        setFormData({
            name: userProfile?.name || user?.name || '',
            email: userProfile?.email || user?.email || '',
            phone: userProfile?.phone || '',
            address: userProfile?.address || ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.put(`${API_BASE_URL}/api/users/profile`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.data) {
                setUserProfile(response.data);
                setIsEditing(false);
                // Show success message
                alert('Profile updated successfully!');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleStartLearning = (course) => {
        // Default YouTube video URL if course.videoUrl doesn't exist
        const videoUrl = course.videoUrl || "https://youtu.be/XZwBNDGuWGU?si=CUJ4ZXUAaEBnTaK_";
        setSelectedVideo(videoUrl);
    };

    const handleCloseVideo = () => {
        setSelectedVideo(null);
    };

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="spinner"></div>
                <p>Loading your profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-error">
                <h2>Oops! Something went wrong</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="reload-btn">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="user-info-header">
                    <div className="user-avatar">
                        {user?.name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-details">
                        <h1>{user?.name || user?.username}</h1>
                        <p>{user?.email}</p>
                    </div>
                </div>
                <div className="profile-actions">
                    {!isEditing ? (
                        <button className="edit-profile-btn" onClick={handleEditProfile}>
                            <i className="fas fa-user-edit"></i>
                            Edit Profile
                        </button>
                    ) : (
                        <div className="edit-actions">
                            <button className="save-btn" onClick={handleSaveProfile}>
                                <i className="fas fa-save"></i>
                                Save
                            </button>
                            <button className="cancel-btn" onClick={handleCancelEdit}>
                                <i className="fas fa-times"></i>
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="profile-nav">
                <button 
                    className={`profile-nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    <i className="fas fa-user"></i>
                    Profile
                </button>
                <button 
                    className={`profile-nav-tab ${activeTab === 'courses' ? 'active' : ''}`}
                    onClick={() => setActiveTab('courses')}
                >
                    <i className="fas fa-graduation-cap"></i>
                    My Courses
                    <span className="badge">{purchasedCourses.length}</span>
                </button>
                <button 
                    className={`profile-nav-tab ${activeTab === 'transactions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('transactions')}
                >
                    <i className="fas fa-receipt"></i>
                    Transactions
                    <span className="badge">{transactions.length}</span>
                </button>
            </div>

            <div className="profile-content">
                {activeTab === 'profile' && (
                    <div className="profile-section">
                        <h2>Personal Information</h2>
                        <div className="profile-info-grid">
                            <div className="profile-info-item">
                                <label>Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="profile-input"
                                    />
                                ) : (
                                    <p>{userProfile?.name || user?.name || user?.username}</p>
                                )}
                            </div>
                            <div className="profile-info-item">
                                <label>Email</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="profile-input"
                                    />
                                ) : (
                                    <p>{userProfile?.email || user?.email}</p>
                                )}
                            </div>
                            <div className="profile-info-item">
                                <label>Phone</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="profile-input"
                                    />
                                ) : (
                                    <p>{userProfile?.phone || 'Not provided'}</p>
                                )}
                            </div>
                            <div className="profile-info-item">
                                <label>Address</label>
                                {isEditing ? (
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="profile-input"
                                    />
                                ) : (
                                    <p>{userProfile?.address || 'Not provided'}</p>
                                )}
                            </div>
                            <div className="profile-info-item">
                                <label>Account Type</label>
                                <p>{user?.role === 'admin' ? 'Administrator' : 'Student'}</p>
                            </div>
                            <div className="profile-info-item">
                                <label>Member Since</label>
                                <p>{userProfile?.createdAt ? formatDate(userProfile.createdAt) : 'Not available'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'courses' && (
                    <div className="courses-section">
                        <h2>My Courses</h2>
                        {purchasedCourses.length === 0 ? (
                            <div className="empty-state">
                                <i className="fas fa-book-open empty-icon"></i>
                                <h3>No courses purchased yet</h3>
                                <p>Browse our catalog and enroll in courses to start learning.</p>
                                <button 
                                    className="browse-courses-btn"
                                    onClick={() => navigate('/courses')}
                                >
                                    Browse Courses
                                </button>
                            </div>
                        ) : (
                            <div className="courses-grid">
                                {purchasedCourses.map(course => (
                                    <div className="course-card" key={course._id}>
                                        <div className="course-image">
                                            <img 
                                                src={`${API_BASE_URL}/uploads/${course.image}`} 
                                                alt={course.title} 
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/300x200?text=Course+Image';
                                                }}
                                            />
                                            <div className="course-category">{course.category}</div>
                                        </div>
                                        <div className="course-content">
                                            <h3 className="course-title">{course.title}</h3>
                                            <p className="course-description">{course.description.substring(0, 100)}...</p>
                                            <div className="course-meta">
                                                <span><i className="fas fa-clock"></i> {course.duration}</span>
                                                <button 
                                                    className="start-course-btn"
                                                    onClick={() => handleStartLearning(course)}
                                                >
                                                    Start Learning
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'transactions' && (
                    <div className="transactions-section">
                        <h2>Transaction History</h2>
                        {transactions.length === 0 ? (
                            <div className="empty-state">
                                <i className="fas fa-receipt empty-icon"></i>
                                <h3>No transactions yet</h3>
                                <p>Your purchase history will appear here.</p>
                            </div>
                        ) : (
                            <div className="transactions-table-container">
                                <table className="transactions-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Date</th>
                                            <th>Courses</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map(transaction => (
                                            <tr key={transaction._id}>
                                                <td className="order-id">#{transaction.orderId}</td>
                                                <td>{formatDate(transaction.createdAt)}</td>
                                                <td>{transaction.courses.length} course(s)</td>
                                                <td className="amount">₹{transaction.totalAmount}</td>
                                                <td>
                                                    <span className={`status-badge ${transaction.paymentStatus}`}>
                                                        {transaction.paymentStatus}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button 
                                                        className="view-transaction-btn"
                                                        onClick={() => navigate(`/transaction/${transaction._id}`)}
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {selectedVideo && (
                <VideoPlayer 
                    videoUrl={selectedVideo}
                    onClose={handleCloseVideo}
                />
            )}
        </div>
    );
}

export default ProfilePage; 