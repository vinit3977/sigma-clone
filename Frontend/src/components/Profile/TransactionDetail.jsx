import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';
import axios from 'axios';
import './TransactionDetail.css';

function TransactionDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchTransaction = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/api/transactions/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setTransaction(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching transaction:', err);
                setError(err.response?.data?.message || 'Failed to load transaction details.');
                setLoading(false);
            }
        };

        fetchTransaction();
    }, [id, user, navigate]);

    // Format date for display
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <div className="transaction-loading">
                <div className="spinner"></div>
                <p>Loading transaction details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="transaction-error">
                <h2>Oops! Something went wrong</h2>
                <p>{error}</p>
                <div className="error-actions">
                    <button onClick={() => navigate('/profile')} className="back-btn">
                        Back to Profile
                    </button>
                    <button onClick={() => window.location.reload()} className="reload-btn">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="transaction-detail-container">
            <div className="transaction-detail-header">
                <button onClick={() => navigate('/profile')} className="back-link">
                    <i className="fas fa-arrow-left"></i> Back to Profile
                </button>
                <h1>Transaction Details</h1>
            </div>

            <div className="transaction-detail-card">
                <div className="transaction-header">
                    <div className="transaction-status">
                        <span className={`status-badge ${transaction?.paymentStatus}`}>
                            {transaction?.paymentStatus}
                        </span>
                    </div>
                    <div className="transaction-id">
                        <span>Order ID: #{transaction?.orderId}</span>
                    </div>
                </div>

                <div className="transaction-summary">
                    <div className="summary-item">
                        <span className="label">Transaction Date</span>
                        <span className="value">{formatDate(transaction?.createdAt)}</span>
                    </div>
                    <div className="summary-item">
                        <span className="label">Total Amount</span>
                        <span className="value amount">₹{transaction?.totalAmount}</span>
                    </div>
                    <div className="summary-item">
                        <span className="label">Payment Method</span>
                        <span className="value">{transaction?.paymentMethod || 'Credit/Debit Card'}</span>
                    </div>
                </div>

                <div className="transaction-courses">
                    <h2>Purchased Courses</h2>
                    <div className="courses-list">
                        {transaction?.courses?.map((courseItem, index) => (
                            <div className="course-item" key={index}>
                                <div className="course-image">
                                    <img 
                                        src={`http://localhost:5000/uploads/${courseItem.course.image}`} 
                                        alt={courseItem.course.title} 
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/80x80?text=Course';
                                        }}
                                    />
                                </div>
                                <div className="course-details">
                                    <h3>{courseItem.course.title}</h3>
                                    <p className="course-category">{courseItem.course.category}</p>
                                    <p className="course-duration">
                                        <i className="fas fa-clock"></i> {courseItem.course.duration}
                                    </p>
                                </div>
                                <div className="course-price">
                                    ₹{courseItem.price}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="transaction-actions">
                    <button 
                        className="download-invoice-btn"
                        onClick={() => window.print()}
                    >
                        <i className="fas fa-file-download"></i> Download Invoice
                    </button>
                    <button 
                        className="support-btn"
                        onClick={() => navigate('/contact')}
                    >
                        <i className="fas fa-headset"></i> Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TransactionDetail; 