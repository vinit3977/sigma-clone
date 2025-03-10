import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Courses/CartContext";
import { useAuth } from "../AuthContext/AuthContext";
import "./Cart.css";

function Cart() {
  const { cart, total, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="cart-container">
      <div className="cart-hero">
        <div className="cart-hero-content">
          <h1>Your Learning Cart</h1>
          <p className="hero-subtitle">Review and manage your selected courses</p>
          <div className="cart-breadcrumb">
            <span onClick={() => navigate("/")} className="breadcrumb-link">Home</span>
            <i className="fas fa-chevron-right"></i>
            <span className="active">Shopping Cart</span>
          </div>
        </div>
      </div>

      <div className="cart-content-wrapper">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-content">
              <div className="empty-cart-icon">
                <i className="fas fa-shopping-basket"></i>
              </div>
              <h2>Your Learning Journey Awaits</h2>
              <p>Your cart is currently empty. Start your learning adventure by exploring our courses!</p>
              <button
                onClick={() => navigate("/courses")}
                className="browse-courses-btn"
              >
                Explore Courses <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        ) : (
          <div className="cart-grid">
            <div className="cart-items">
              <div className="cart-header">
                <h2>Selected Courses</h2>
                <span className="course-count">{cart.length} {cart.length === 1 ? 'Course' : 'Courses'}</span>
              </div>
              {cart.map((course) => (
                <div key={course._id} className="cart-item-card">
                  <div className="cart-item-image">
                    <img
                      src={`http://localhost:5000/uploads/${course.image}`}
                      alt={course.title}
                    />
                    <div className="course-overlay">
                      <span className="course-category">{course.category}</span>
                    </div>
                  </div>
                  <div className="cart-item-content">
                    <div className="cart-item-header">
                      <div className="cart-item-title-group">
                        <h3 className="cart-item-title">{course.title}</h3>
                        <p className="cart-item-description">{course.description}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(course._id)}
                        className="remove-btn"
                        aria-label="Remove course"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                    <div className="cart-item-meta">
                      <div className="meta-info">
                        <span className="duration">
                          <i className="far fa-clock"></i>
                          {course.duration} hours
                        </span>
                        <span className="students">
                          <i className="fas fa-user-graduate"></i>
                          1.2k students
                        </span>
                        <span className="rating">
                          <i className="fas fa-star"></i>
                          4.8
                        </span>
                      </div>
                      <div className="price-tag">
                        <span className="price-label">Price:</span>
                        <span className="price-value">₹{course.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary-card">
              <div className="summary-header">
                <h3>Order Summary</h3>
                <div className="summary-badge">
                  <i className="fas fa-lock"></i>
                  Secure Checkout
                </div>
              </div>
              <div className="summary-details">
                <div className="summary-item">
                  <span>Subtotal ({cart.length} {cart.length === 1 ? 'Course' : 'Courses'})</span>
                  <span>₹{total}</span>
                </div>
                <div className="summary-item">
                  <span>Platform Fee</span>
                  <span className="free">Free</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-item total">
                  <span>Total Amount</span>
                  <span>₹{total}</span>
                </div>
              </div>
              <div className="summary-footer">
                <button onClick={handleCheckout} className="checkout-btn">
                  <i className="fas fa-lock"></i> Proceed to Checkout
                </button>
                <button
                  onClick={() => navigate("/courses")}
                  className="continue-shopping-btn"
                >
                  <i className="fas fa-shopping-cart"></i> Continue Shopping
                </button>
              </div>
              <div className="payment-methods">
                <p>Secure Payment Options</p>
                <div className="payment-icons">
                  <i className="fab fa-cc-visa"></i>
                  <i className="fab fa-cc-mastercard"></i>
                  <i className="fab fa-cc-paypal"></i>
                  <i className="fab fa-cc-amex"></i>
                  <i className="fab fa-cc-google-pay"></i>
                </div>
              </div>
              <div className="guarantee-badge">
                <i className="fas fa-shield-alt"></i>
                <span>30-Day Money-Back Guarantee</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
