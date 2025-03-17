import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Courses.css';
import { useLoading } from '../LoadingContext/LoadingContext';

function Courses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [cart, setCart] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoading();

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
        fetchCourses();
        checkAuthStatus();
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(savedCart);
    }, []);

    const checkAuthStatus = () => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    };

    const fetchCourses = async () => {
        showLoader();
        try {
            const response = await axios.get('http://localhost:5000/api/courses/public');
            setCourses(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setLoading(false);
        } finally {
            hideLoader();
        }
    };

    const addToCart = (course) => {
        const updatedCart = [...cart, course];
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const buyNow = (course) => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
        navigate('/checkout', { state: { courses: [course] } });
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    function enrollNow(courseTitle) {
        const message = encodeURIComponent(`Hello, I'm interested in enrolling for the course: ${courseTitle}. Please provide more details.`);
        window.location.href = `https://wa.me/919664778530?text=${message}`;
    }

    return (
        <div className="courses-container">
            
            <div className="courses-hero">
                <h1>Explore Our Courses</h1>
                <p>Advance your career with industry-leading certifications</p>
            </div>

            <div className="search-section">
                <div className="search-wrapper">
                    <i className="fas fa-search search-icon"></i>
                    <input
                        type="text"
                        placeholder="What do you want to learn today?"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                        style={{ paddingLeft: '40px' }} 
                    />
                </div>
                
                <div className="filter-wrapper">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select>
                    
                    {/* <button onClick={() => navigate('/cart')} className="cart-button">
                        <i className="fas fa-shopping-cart"></i>
                        <span className="cart-badge">{cart.length}</span>
                    </button> */}
                </div>
            </div>

            {loading ? (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading amazing courses for you...</p>
                </div>
            ) : (
                <div className="courses-grid">
                    {filteredCourses.map(course => (
                        <div key={course._id} className="course-card">
                            <div className="course-image-container">
                                {course.image && (
                                    <img
                                        src={`http://localhost:5000/uploads/${course.image}`}
                                        alt={course.title}
                                        className="course-image"
                                    />
                                )}
                                {/* <div className="course-overlay">
                                    <button 
                                        onClick={() => buyNow(course)}
                                        className="preview-btn"
                                    >
                                        Preview Course
                                    </button>
                                </div> */}
                            </div>
                            
                            <div className="course-content">
                                <div className="course-category-tag">
                                    {course.category}
                                </div>
                                <h3 className="course-title">{course.title}</h3>
                                <p className="course-description">{course.description}</p>
                                
                                <div className="course-meta">
                                    <span className="duration">
                                        <i className="far fa-clock"></i>
                                        {course.duration}
                                    </span>
                                    <span className="students">
                                        <i className="fas fa-users"></i>
                                        {Math.floor(Math.random() * 1000) + 100} students
                                    </span>
                                </div>

                                <div className="course-footer">
                                    <div className="price-tag">
                                        <span className="currency">₹</span>
                                        <span className="amount">{course.price}</span>
                                    </div>
                                    <div className="action-buttons">
                                        
                                        {/* <button 
                                            onClick={() => addToCart(course)}
                                            className="add-to-cart-btn"
                                        >
                                            <i className="fas fa-cart-plus"></i>
                                        </button> */}
                                        {/* <button 
                                            onClick={() => buyNow(course)}
                                            className="buy-now-btn"
                                        >
                                            Enroll Now
                                        </button> */}


<button 
    onClick={() => enrollNow(course.title)}
    className="buy-now-btn"
>
    Enroll Now
</button>


                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
           
        </div>
    );
}

export default Courses;