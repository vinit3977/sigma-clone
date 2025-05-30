import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import SITLogo from "../../assets/MainLogo/SITLogo.png";
import "./Header.css";
import { useAuth } from '../AuthContext/AuthContext';
import { useCart } from '../Courses/CartContext';
import axios from 'axios';

const Header = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileUserOpen, setMobileUserOpen] = useState(false);
  const navigate = useNavigate();
  
  const servicesDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target)) {
        setServicesDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setServicesDropdownOpen(false);
        setUserDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
        document.body.style.overflow = 'auto';
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
      document.body.style.overflow = 'auto';
      navigate("/");
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto'; // Changed from 'unset' to 'auto' for better compatibility
    }
  };

  const toggleMobileServices = () => {
    setMobileServicesOpen(!mobileServicesOpen);
  };

  const toggleMobileUser = () => {
    setMobileUserOpen(!mobileUserOpen);
  };

  const handleServiceClick = (path) => {
    setServicesDropdownOpen(false);
    setMobileServicesOpen(false);
    setMobileMenuOpen(false);
    document.body.style.overflow = 'auto'; // Reset overflow when navigating
    navigate(path);
  };

  const handleUserMenuClick = (path) => {
    setUserDropdownOpen(false);
    setMobileUserOpen(false);
    setMobileMenuOpen(false);
    document.body.style.overflow = 'auto'; // Reset overflow when navigating
    navigate(path);
  };

  return (
    <header className="main-header">
      <div className="header-top">
        <div className="container">
          <div className="header-top-content">
            <div className="contact-section">
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <a href="tel:+919664778530">+91 96647-78530</a>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <a href="mailto:hello@sigmaacademy.net">hello@sigmaacademy.net</a>
              </div>
              <div className="contact-item">
                <i className="fas fa-balance-scale"></i>
                <a href="#">GST: 24EGXPP1475B1Z4</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="header-main">
        <div className="container">
          <div className="header-main-content">
            <Link to="/" className="logo">
              <img src={SITLogo} alt="Sigma Academy Logo" />
            </Link>

            <div className="nav-section">
              <div className="nav-links">
                <Link to="/" className="nav-link">
                  <i className="fas fa-home"></i>
                  <span>Home</span>
                </Link>
                <div className="dropdown" ref={servicesDropdownRef}>
                  <button 
                    className="nav-link dropdown"
                    onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  >
                    <i className="fas fa-cogs"></i>
                    <span>Services</span>
                    <i className={`fas fa-chevron-down ${servicesDropdownOpen ? 'rotate' : ''}`}></i>
                  </button>
                  <div className={`dropdown-menu ${servicesDropdownOpen ? 'show' : ''}`}>
                    <button 
                      className="dropdown-item"
                      onClick={() => handleServiceClick('/OnlineTraining')}
                    >
                      <div className="dropdown-icon">
                        <i className="fas fa-laptop"></i>
                      </div>
                      <div className="dropdown-content">
                        <h4>Online Training</h4>
                        <p>Learn from anywhere, anytime</p>
                      </div>
                    </button>
                    <button 
                      className="dropdown-item"
                      onClick={() => handleServiceClick('/Corporate')}
                    >
                      <div className="dropdown-icon">
                        <i className="fas fa-building"></i>
                      </div>
                      <div className="dropdown-content">
                        <h4>Corporate Training</h4>
                        <p>Professional development for teams</p>
                      </div>
                    </button>
                    <button 
                      className="dropdown-item"
                      onClick={() => handleServiceClick('/ITstaffing')}
                    >
                      <div className="dropdown-icon">
                        <i className="fas fa-users"></i>
                      </div>
                      <div className="dropdown-content">
                        <h4>IT Staffing</h4>
                        <p>Find the right talent</p>
                      </div>
                    </button>
                  </div>
                </div>
                <Link to="/about" className="nav-link">
                  <i className="fas fa-info-circle"></i>
                  <span>About Us</span>
                </Link>
                <Link to="/courses" className="nav-link">
                  <i className="fas fa-graduation-cap"></i>
                  <span>Courses</span>
                </Link>
                <Link to="/contact" className="nav-link">
                  <i className="fas fa-envelope"></i>
                  <span>Contact Us</span>
                </Link>
              </div>
            </div>

            <button 
              className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-nav ${mobileMenuOpen ? 'show' : ''}`} ref={mobileMenuRef}>
        <button className="mobile-close-btn" onClick={toggleMobileMenu}>
          <i className="fas fa-times"></i>
        </button>
        
        {/* Logo in mobile menu */}
        <div className="mobile-logo">
          <img src={SITLogo} alt="Sigma Academy Logo" />
        </div>
        
        <div className="mobile-nav-links">
          <Link to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            <i className="fas fa-home"></i>
            Home
          </Link>
          
          <div className="mobile-dropdown">
            <button 
              className="mobile-dropdown-toggle"
              onClick={toggleMobileServices}
            >
              <span>
                <i className="fas fa-cogs"></i>
                Services
              </span>
              <i className={`fas fa-chevron-down ${mobileServicesOpen ? 'rotate' : ''}`}></i>
            </button>
            <div className={`mobile-dropdown-menu ${mobileServicesOpen ? 'show' : ''}`}>
              <button 
                className="mobile-dropdown-item"
                onClick={() => handleServiceClick('/OnlineTraining')}
              >
                <i className="fas fa-laptop"></i>
                Online Training
              </button>
              <button 
                className="mobile-dropdown-item"
                onClick={() => handleServiceClick('/Corporate')}
              >
                <i className="fas fa-building"></i>
                Corporate Training
              </button>
              <button 
                className="mobile-dropdown-item"
                onClick={() => handleServiceClick('/ITstaffing')}
              >
                <i className="fas fa-users"></i>
                IT Staffing
              </button>
            </div>
          </div>
          
          <Link to="/about" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            <i className="fas fa-info-circle"></i>
            About Us
          </Link>
          <Link to="/courses" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            <i className="fas fa-graduation-cap"></i>
            Courses
          </Link>
          <Link to="/contact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            <i className="fas fa-envelope"></i>
            Contact Us
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
