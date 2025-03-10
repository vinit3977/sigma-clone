import React from "react";
import "../DropDown/Corporate.css";
import Webdev from "../../assets/Webdev.jpg";
import DigitalM from "../../assets/DigitalM.jpg";
import DS from "../../assets/DS.jpg";

const TrainingPage = () => {
  return (
    <div className="corporate-container">
      <div className="corporate-hero">
        <div className="hero-content">
          <h1 className="hero-title">Enhance Your Skills with Our Corporate Training</h1>
          <p className="hero-subtitle">
            Learn from the best in the industry with tailored training programs.
          </p>
          <a href="/courses" className="hero-button">
            <i className="fas fa-arrow-right"></i>
            Explore Courses
          </a>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-box">
          <i className="fas fa-chalkboard-teacher"></i>
          <h3>Expert Training</h3>
          <p>Industry professionals with years of experience</p>
        </div>
        <div className="feature-box">
          <i className="fas fa-certificate"></i>
          <h3>Certification</h3>
          <p>Globally recognized certifications</p>
        </div>
        <div className="feature-box">
          <i className="fas fa-users"></i>
          <h3>Interactive Learning</h3>
          <p>Hands-on experience with real projects</p>
        </div>
      </div>

      <section className="courses-section">
        <div className="section-header">
          <h2>Our Training Programs</h2>
          <div className="header-line"></div>
        </div>
        
        <div className="courses-grid">
          <div className="course-card">
            <div className="card-image">
              <img src={Webdev} alt="Project Management" />
              <div className="card-overlay">
                <span className="duration"><i className="far fa-clock"></i> 3 Months</span>
              </div>
            </div>
            <div className="card-content">
              <div className="card-tag">Management</div>
              <h3>Project Management and IT Leadership</h3>
              <p>Project Management Professional (PMP), ITIL Foundation, Certified ScrumMaster (CSM)</p>
              <a href="#" className="learn-more">
                Learn More <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>

          <div className="course-card">
            <div className="card-image">
              <img src={DigitalM} alt="Digital Marketing" />
              <div className="card-overlay">
                <span className="duration"><i className="far fa-clock"></i> 2 Months</span>
              </div>
            </div>
            <div className="card-content">
              <div className="card-tag">Marketing</div>
              <h3>Digital Marketing</h3>
              <p>Web Development (WordPress), SMM, SEO, Graphics Design, Paid Advertisement</p>
              <a href="#" className="learn-more">
                Learn More <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>

          <div className="course-card">
            <div className="card-image">
              <img src={DS} alt="ERP Training" />
              <div className="card-overlay">
                <span className="duration"><i className="far fa-clock"></i> 4 Months</span>
              </div>
            </div>
            <div className="card-content">
              <div className="card-tag">Enterprise</div>
              <h3>ERP Training</h3>
              <p>ERP SAP (SAP Power User Training, SAP End-user Training), ERP Oracle (Oracle Applications and Solutions), Salesforce Training</p>
              <a href="#" className="learn-more">
                Learn More <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="section-header">
          <h2>What Our Students Say</h2>
          <div className="header-line"></div>
        </div>
        
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="quote-icon">
              <i className="fas fa-quote-right"></i>
            </div>
            <p>The corporate training session was outstanding! The trainers were incredibly supportive, making complex concepts easy to understand. The hands-on approach and real-world examples truly enhanced the learning experience. Highly recommended.</p>
            <div className="testimonial-author">
              <div className="author-avatar">S</div>
              <div className="author-info">
                <h4>Saurav</h4>
                <span>Corporate Trainee</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="quote-icon">
              <i className="fas fa-quote-right"></i>
            </div>
            <p>I learned so much in the digital marketing course. Highly recommend Sigma IT Solutions!</p>
            <div className="testimonial-author">
              <div className="author-avatar">R</div>
              <div className="author-info">
                <h4>Rekha</h4>
                <span>Marketing Professional</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrainingPage;
