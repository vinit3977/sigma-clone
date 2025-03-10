import React from "react";
import "../DropDown/ITstaffing.css";
import cc from "../../assets/ITstaff/cc.jpg";
import cs from "../../assets/ITstaff/cs.jpg";
import wdev from "../../assets/ITstaff/wdev.jpg";



const TrainingPage = () => {
  return (
    <div className="corporate-container">
      <div className="corporate-hero">
        <div className="hero-content">
          <h1 className="hero-title">Transform Your IT Career with Professional Training</h1>
          <p className="hero-subtitle">
            Master the latest technologies with industry-expert led training programs.
          </p>
          <a href="/courses" className="hero-button">
            <i className="fas fa-arrow-right"></i>
            Explore Programs
          </a>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-box">
          <i className="fas fa-chalkboard-teacher"></i>
          <h3>Expert Instructors</h3>
          <p>Learn from certified professionals with real-world experience</p>
        </div>
        <div className="feature-box">
          <i className="fas fa-certificate"></i>
          <h3>Industry Certifications</h3>
          <p>Globally recognized IT certifications</p>
        </div>
        <div className="feature-box">
          <i className="fas fa-users"></i>
          <h3>Practical Learning</h3>
          <p>Hands-on labs and real-world projects</p>
        </div>
      </div>

      <section className="courses-section">
        <div className="section-header">
          <h2>Our IT Training Programs</h2>
          <div className="header-line"></div>
        </div>
        
        <div className="courses-grid">
          <div className="course-card">
            <div className="card-image">
              <img src={cc} alt="Cloud Computing" />
              <div className="card-overlay">
                <span className="duration"><i className="far fa-clock"></i> 4 Months</span>
              </div>
            </div>
            <div className="card-content">
              <div className="card-tag">Cloud</div>
              <h3>Cloud Computing</h3>
              <p>AWS Certified Solutions Architect, Azure Administrator, Google Cloud Professional, DevOps Engineering</p>
              <a href="#" className="learn-more">
                Learn More <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>

          <div className="course-card">
            <div className="card-image">
              <img src={wdev} alt="Cybersecurity" />
              <div className="card-overlay">
                <span className="duration"><i className="far fa-clock"></i> 3 Months</span>
              </div>
            </div>
            <div className="card-content">
              <div className="card-tag">Security</div>
              <h3>Cybersecurity</h3>
              <p>CompTIA Security+, Certified Ethical Hacker (CEH), CISSP, Network Security, Threat Intelligence</p>
              <a href="#" className="learn-more">
                Learn More <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>

          <div className="course-card">
            <div className="card-image">
              <img src={cs} alt="Advanced Security" />
              <div className="card-overlay">
                <span className="duration"><i className="far fa-clock"></i> 4 Months</span>
              </div>
            </div>
            <div className="card-content">
              <div className="card-tag">Advanced Security</div>
              <h3>Advanced Cybersecurity</h3>
              <p>Penetration Testing, Incident Response, Security Operations Center (SOC), Cloud Security, Risk Management</p>
              <a href="#" className="learn-more">
                Learn More <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="section-header">
          <h2>What Our IT Professionals Say</h2>
          <div className="header-line"></div>
        </div>
        
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="quote-icon">
              <i className="fas fa-quote-right"></i>
            </div>
            <p>The AWS certification training was exceptional! The instructors provided practical insights and hands-on experience that helped me advance my cloud computing career. The course structure and lab exercises were perfectly designed for real-world scenarios.</p>
            <div className="testimonial-author">
              <div className="author-avatar">A</div>
              <div className="author-info">
                <h4>Akash</h4>
                <span>Cloud Engineer</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="quote-icon">
              <i className="fas fa-quote-right"></i>
            </div>
            <p>The cybersecurity program was comprehensive and up-to-date with the latest threats and security measures. The practical labs and real-world case studies made the learning experience invaluable for my career in information security.</p>
            <div className="testimonial-author">
              <div className="author-avatar">P</div>
              <div className="author-info">
                <h4>Khushboo</h4>
                <span>Security Analyst</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrainingPage;
