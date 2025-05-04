import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Courses/CartContext';
import { useAuth } from '../AuthContext/AuthContext';
import axios from 'axios';
import './Checkout.css';

function Checkout() {
    const { cart, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        email: ''
    });

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/api/users/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                setUserDetails(response.data);
                setFormData({
                    name: response.data.name || '',
                    email: response.data.email || ''
                });
            } catch (error) {
                console.error('Error fetching user details:', error);
                // If there's an error, try to get data from the auth context
                if (user) {
                    setFormData({
                        name: user.name || '',
                        email: user.email || ''
                    });
                }
            }
        };

        if (user) {
            fetchUserDetails();
        }
    }, [user]);

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'name':
                if (!value.trim()) {
                    error = 'Name is required';
                } else if (value.length < 2) {
                    error = 'Name must be at least 2 characters';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value.trim()) {
                    error = 'Email is required';
                } else if (!emailRegex.test(value)) {
                    error = 'Please enter a valid email';
                }
                break;
            default:
                break;
        }
        return error;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Validate field
        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handlePayment = async () => {
        try {
            setLoading(true);
            
            // Validate cart is not empty
            if (!cart || cart.length === 0) {
                alert('Your cart is empty');
                return;
            }

            // Generate order ID
            const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
            
            // Navigate to payment page with order details
            navigate('/payment', {
                state: {
                    orderId: orderId,
                    courses: cart,
                    amount: total,
                    userDetails: {
                        name: formData.name,
                        email: formData.email
                    }
                }
            });
        } catch (error) {
            console.error('Payment initiation failed:', error);
            alert('Failed to initiate payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-container">
            <div className="checkout-hero">
                <div className="checkout-hero-content">
                    <div className="hero-badge">
                        <i className="fas fa-shield-alt"></i>
                        <span>Secure Checkout</span>
                    </div>
                    <h1>Complete Your Purchase</h1>
                    <p className="hero-subtitle">Your learning journey starts here</p>
                    {/* <div className="checkout-breadcrumb">
                        <span>Home</span>
                        <i className="fas fa-chevron-right"></i>
                        <span>Cart</span>
                        <i className="fas fa-chevron-right"></i>
                        <span className="active">Checkout</span>
                    </div> */}
                </div>
            </div>

            <div className="checkout-content-wrapper">
                <div className="checkout-grid">
                    <div className="checkout-details">
                        <div className="checkout-card">
                            <div className="card-header">
                                <div className="header-content">
                                    <div className="header-title">
                                        <h2>Order Details</h2>
                                        <p className="order-summary">Order #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                                    </div>
                                    <div className="order-status">
                                        <span className="status-badge">
                                            <i className="fas fa-clock"></i>
                                            Pending Payment
                                        </span>
                                    </div>
                                </div>
                                <div className="order-progress">
                                    <div className="progress-step active">
                                        <div className="step-number">1</div>
                                        <span>Details</span>
                                    </div>
                                    <div className="progress-step">
                                        <div className="step-number">2</div>
                                        <span>Payment</span>
                                    </div>
                                    <div className="progress-step">
                                        <div className="step-number">3</div>
                                        <span>Confirmation</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="user-info-section">
                                <h3>
                                    <i className="fas fa-user-circle"></i>
                                    Account Information
                                </h3>
                                <div className="user-info">
                                    <div className="info-item">
                                        <div className="info-icon">
                                            <i className="fas fa-user"></i>
                                        </div>
                                        <div className="info-content">
                                            <label>Full Name</label>
                                            <div className="input-wrapper">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your full name"
                                                    className={`${formData.name && !errors.name ? 'filled' : ''} ${errors.name ? 'error' : ''}`}
                                                />
                                                {formData.name && !errors.name && (
                                                    <span className="verified-badge">
                                                        <i className="fas fa-check-circle"></i>
                                                        Verified
                                                    </span>
                                                )}
                                                {errors.name && (
                                                    <span className="error-message">{errors.name}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <div className="info-icon">
                                            <i className="fas fa-envelope"></i>
                                        </div>
                                        <div className="info-content">
                                            <label>Email Address</label>
                                            <div className="input-wrapper">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your email address"
                                                    className={`${formData.email && !errors.email ? 'filled' : ''} ${errors.email ? 'error' : ''}`}
                                                />
                                                {formData.email && !errors.email && (
                                                    <span className="verified-badge">
                                                        <i className="fas fa-check-circle"></i>
                                                        Verified
                                                    </span>
                                                )}
                                                {errors.email && (
                                                    <span className="error-message">{errors.email}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="courses-section">
                                <h3>
                                    <i className="fas fa-graduation-cap"></i>
                                    Courses Selected ({cart.length})
                                </h3>
                                <div className="courses-list">
                                    {cart.map(course => (
                                        <div key={course._id} className="checkout-course-item">
                                            <div className="course-image">
                                                <img 
                                                    src={`${API_BASE_URL}/uploads/${course.image}`}
                                                    alt={course.title}
                                                />
                                                <div className="course-overlay">
                                                    <i className="fas fa-lock"></i>
                                                </div>
                                            </div>
                                            <div className="course-details">
                                                <span className="course-category">{course.category}</span>
                                                <h4>{course.title}</h4>
                                                <div className="course-meta">
                                                    <span className="duration">
                                                        <i className="far fa-clock"></i>
                                                        {course.duration} hours
                                                    </span>
                                                    <span className="price">₹{course.price}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="payment-summary">
                        <div className="summary-card">
                            <div className="summary-header">
                                <h3>Payment Summary</h3>
                                <div className="secure-payment">
                                    <i className="fas fa-lock"></i>
                                    <span>Secure Payment</span>
                                </div>
                            </div>
                            <div className="summary-details">
                                <div className="summary-item">
                                    <span>Subtotal</span>
                                    <span>₹{total}</span>
                                </div>
                                <div className="summary-item">
                                    <span>Platform Fee</span>
                                    <span>₹10</span>
                                </div>
                                <div className="summary-item">
                                    <span>Tax</span>
                                    <span>₹9.5</span>
                                </div>
                                <div className="summary-item total">
                                    <span>Total Amount</span>
                                    <span>₹{(parseFloat(total) + 10 + 9.5).toFixed(2)}</span>
                                </div>
                            </div>

                            <button 
                                onClick={handlePayment}
                                disabled={loading || !formData.name || !formData.email}
                                className="pay-now-btn"
                            >
                                {loading ? (
                                    <span className="loading-spinner">
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Processing...
                                    </span>
                                ) : (
                                    <span>
                                        <i className="fas fa-lock"></i><br/>
                                        Pay Securely ₹{(parseFloat(total) + 10 + 9.5).toFixed(2)}
                                    </span>
                                )}
                            </button>

                            <button 
                                onClick={() => navigate('/cart')}
                                className="back-to-cart-btn"
                            >
                                <i className="fas fa-arrow-left"></i>
                                Back to Cart
                            </button>

                            <div className="payment-methods">
                                <p>Secure Payment Methods</p>
                                <div className="payment-icons">
                                    <i className="fab fa-cc-visa"></i>
                                    <i className="fab fa-cc-mastercard"></i>
                                    <i className="fab fa-cc-paypal"></i>
                                </div>
                                <div className="secure-badge">
                                    <i className="fas fa-shield-alt"></i>
                                    <span>256-bit SSL Secured</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;