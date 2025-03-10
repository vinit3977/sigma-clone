import React from "react";
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      {/* Main Footer Section */}
      <div className="main-footer">
        <div className="container">
          <div className="footer-content">
            {/* Brand Section */}
            <div className="brand-section">
              <h2>Sigma IT Academy</h2>
              <p>Your partner in IT education and career growth, offering industry-focused courses, expert training, and IT staffing solutions to shape your future in technology.</p>
              <div className="social-links">
                <a href="https://www.facebook.com/sigmaitss" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="https://www.google.com/search?q=Sigma+IT+Solutions" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-google"></i>
                </a>
                <a href="https://www.linkedin.com/company/sigma-it-solutions-and-services" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="https://www.instagram.com/sigmaitss" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-links-section">
              <h3>Quick Links</h3>
              <ul className="footer-links">
                <li><a href="">Home</a></li>
                <li><a href="">Services</a></li>
                <li><a href="/about-us.html">About Us</a></li>
                <li><a href="#">Courses</a></li>
                <li><a href="/Contact-us.html">Contact Us</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="contact-section">
              <h3>Contact Us</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <h4>Our Address</h4>
                    <p>TF-10, Divya Plaza complex, Ajwa Road Vadodara, Gujarat(390019)</p>
                  </div>
                </div>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <div>
                    <h4>Email Us</h4>
                    <p>hello@sigmaacademy.net</p>
                  </div>
                </div>
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <div>
                    <h4>Call Us Now</h4>
                    <p>+91-9664778530</p>
                  </div>
                </div>
                {/* Contact Us underline */}
                <div className="contact-underline"></div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="copyright">
              Copyright &copy; 2020 Sigma IT Academy. |{" "}
              <a href="/privacy Policy.html">Privacy Policy</a> |{" "}
              <a href="/T&C.html">Terms & Conditions</a> |{" "}
              <a href="/faq.html">FAQ</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
