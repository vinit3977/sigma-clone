import React from "react";
import { motion } from "framer-motion";
import AU_Banner from "../../assets/AU_Banner.jpg";
import CoreValues from "../Home/CoreValues";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-container">
      
      {/* Hero Section with Parallax */}
      <div className="about-hero">
        <div className="hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Welcome to Sigma IT Academy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Empowering Future Tech Leaders
          </motion.p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stat-card">
          <i className="fas fa-users"></i>
          <h3>1000+</h3>
          <p>Students Trained</p>
        </div>
        <div className="stat-card">
          <i className="fas fa-laptop-code"></i>
          <h3>50+</h3>
          <p>Courses Offered</p>
        </div>
        <div className="stat-card">
          <i className="fas fa-certificate"></i>
          <h3>95%</h3>
          <p>Success Rate</p>
        </div>
        <div className="stat-card">
          <i className="fas fa-industry"></i>
          <h3>100+</h3>
          <p>Corporate Partners</p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="mission-section">
        <div className="mission-content">
          <div className="mission-text">
            <h2>Our Mission</h2>
            <p>
              At Sigma IT Academy, we are dedicated to empowering individuals with cutting-edge 
              technology skills and knowledge. Our mission is to bridge the gap between education 
              and industry requirements, creating job-ready professionals who can excel in their careers.
            </p>
            <div className="mission-points">
              <div className="point">
                <i className="fas fa-check-circle"></i>
                <span>Industry-Aligned Curriculum</span>
              </div>
              <div className="point">
                <i className="fas fa-check-circle"></i>
                <span>Hands-on Learning Experience</span>
              </div>
              <div className="point">
                <i className="fas fa-check-circle"></i>
                <span>Expert Mentorship</span>
              </div>
            </div>
          </div>
          <div className="mission-image">
            {/* Add your mission image here */}
          </div>
        </div>
      </div>

      {/* Journey Section */}
      <div className="journey-section">
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Our Journey
        </motion.h2>
        <div className="timeline">
          <motion.div 
            className="timeline-line"
            initial={{ height: "0%" }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          ></motion.div>

          <motion.div 
            className="timeline-item"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div 
              className="timeline-dot"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            ></motion.div>
            <motion.div 
              className="timeline-content"
              whileHover={{ boxShadow: "0 5px 15px rgba(0,0,0,0.2)" }}
            >
              <h3>2018</h3>
              <p>Founded with a vision to transform IT education</p>
            </motion.div>
          </motion.div>

          <motion.div 
            className="timeline-item"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div 
              className="timeline-dot"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            ></motion.div>
            <motion.div 
              className="timeline-content"
              whileHover={{ boxShadow: "0 5px 15px rgba(0,0,0,0.2)" }}
            >
              <h3>2020</h3>
              <p>Expanded to online learning platforms</p>
            </motion.div>
          </motion.div>

          <motion.div 
            className="timeline-item"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div 
              className="timeline-dot"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            ></motion.div>
            <motion.div 
              className="timeline-content"
              whileHover={{ boxShadow: "0 5px 15px rgba(0,0,0,0.2)" }}
            >
              <h3>2022</h3>
              <p>Launched corporate training programs</p>
            </motion.div>
          </motion.div>

          <motion.div 
            className="timeline-item"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div 
              className="timeline-dot"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 }}
            ></motion.div>
            <motion.div 
              className="timeline-content"
              whileHover={{ boxShadow: "0 5px 15px rgba(0,0,0,0.2)" }}
            >
              <h3>2024</h3>
              <p>Reaching new heights with global partnerships</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Core Values Section (Unchanged) */}
      <CoreValues />

      {/* Contact CTA Section */}
      <div className="contact-cta">
        <div className="cta-content">
          <h2>Ready to Start Your Journey?</h2>
          <p>Get in touch with us to learn more about our programs and how we can help you achieve your career goals.</p>
          <a href="/contact" className="cta-button">Contact Us</a>

        </div>
      </div>
    </div>
  );
};

export default AboutUs;
