import React from "react";
import "../DropDown/OnlineTraining.css";
import Webdev from "../../assets/Webdev.jpg";
import DigitalM from "../../assets/DigitalM.jpg";
import DS from "../../assets/DS.jpg";

const TrainingPage = () => {
  return (
    <div className="corporate-container">
      <div className="corporate-hero">
        <div className="hero-content">
          <h1 className="hero-title">Master New Skills with Our Online Training Programs</h1>
          <p className="hero-subtitle">
            Learn from anywhere, anytime with our flexible online training courses.
          </p>
          <a href="/courses" className="hero-button">
            <i className="fas fa-arrow-right"></i>
            Explore Courses
          </a>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-box">
          <i className="fas fa-laptop"></i>
          <h3>Flexible Learning</h3>
          <p>Learn at your own pace with 24/7 access</p>
        </div>
        <div className="feature-box">
          <i className="fas fa-certificate"></i>
          <h3>Certification</h3>
          <p>Industry-recognized certificates upon completion</p>
        </div>
        <div className="feature-box">
          <i className="fas fa-video"></i>
          <h3>Live Sessions</h3>
          <p>Interactive live classes with expert instructors</p>
        </div>
      </div>

      <section className="courses-section">
        <div className="section-header">
          <h2>Our Online Training Programs</h2>
          <div className="header-line"></div>
        </div>
        
        <div className="courses-grid">
          <div className="course-card">
            <div className="card-image">
              <img src={Webdev} alt="Web Development" />
              <div className="card-overlay">
                <span className="duration"><i className="far fa-clock"></i> 3 Months</span>
              </div>
            </div>
            <div className="card-content">
              <div className="card-tag">Development</div>
              <h3>Web Development</h3>
              <p>Full-stack development, React, Node.js, MongoDB, and modern web technologies</p>
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
              <p>SEO, Social Media Marketing, Content Marketing, Google Analytics, and PPC</p>
              <a href="#" className="learn-more">
                Learn More <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>

          <div className="course-card">
            <div className="card-image">
              <img src={DS} alt="Data Science" />
              <div className="card-overlay">
                <span className="duration"><i className="far fa-clock"></i> 4 Months</span>
              </div>
            </div>
            <div className="card-content">
              <div className="card-tag">Data Science</div>
              <h3>Data Science</h3>
              <p>Python, Machine Learning, Data Analysis, Statistics, and Big Data Technologies</p>
              <a href="#" className="learn-more">
                Learn More <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="section-header">
          <h2>What Our Online Students Say</h2>
          <div className="header-line"></div>
        </div>
        
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="quote-icon">
              <i className="fas fa-quote-right"></i>
            </div>
            <p>The online training was excellent! The flexibility to learn at my own pace and the quality of content made it perfect for my schedule. The instructors were always available for support, and the practical projects were very helpful.</p>
            <div className="testimonial-author">
              <div className="author-avatar">A</div>
              <div className="author-info">
                <h4>Amit</h4>
                <span>Web Development Student</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="quote-icon">
              <i className="fas fa-quote-right"></i>
            </div>
            <p>The online Data Science course was comprehensive and well-structured. The live sessions were interactive, and the recorded lectures were very helpful for revision. I highly recommend their online programs!</p>
            <div className="testimonial-author">
              <div className="author-avatar">P</div>
              <div className="author-info">
                <h4>Priya</h4>
                <span>Data Science Student</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrainingPage;
