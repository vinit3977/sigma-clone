import './OurSkillsSection.css'; 

import React, { useEffect } from "react";

const OurSkillsSection = () => {
  useEffect(() => {
    // Animate progress bars on scroll
    const handleScroll = () => {
      const progressBars = document.querySelectorAll(".progress-bar");
      const section = document.querySelector(".our-skills-section");
      if (!section) return;

      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollY = window.scrollY + window.innerHeight;

      if (scrollY > sectionTop && scrollY < sectionTop + sectionHeight) {
        progressBars.forEach((bar) => {
          const percentage = bar.getAttribute("data-percentage");
          bar.style.width = `${percentage}%`;
        });
        window.removeEventListener("scroll", handleScroll); // Run only once
      }
    };

    // Animate fade-in sections on scroll
    const handleFadeInScroll = () => {
      const elements = document.querySelectorAll(".fade-in");
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          el.classList.add("visible");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", handleFadeInScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleFadeInScroll);
    };
  }, []);

  return (
    <section className="our-skills-section py-5 fade-in">
      <div className="container">
        <div className="row align-items-center">
          {/* Text Content */}
          <div className="col-lg-6">
            <div className="content">
              <h6 className="section-subtitle">OUR SKILLS</h6>
              <h2 className="section-title">
                We Provide IT Services That Are Designed For Growth And Success
                Of Your Business.
              </h2>
              <p className="text-muted">
                Sigma IT Solutions and Services can be one of the best choices
                you make to take IT services as we maintain our expertise,
                cost-effectiveness, scalability, and reliability to satisfy our
                customers which allows us to focus on our core business
                objectives while effectively managing your IT needs.
              </p>
              <ul className="skills-list">
                <li>Total Tech Support Solutions</li>
                <li>Comprehensive Business Solutions Provider</li>
                <li>Customized ERP Software Development</li>
                <li>Strategic Brand Identity Development</li>
              </ul>
              <a href="#" className="btn btn-primary">
                Learn More
              </a>
            </div>
          </div>

          {/* Image and Progress Bars */}
          <div className="col-lg-6 text-center">
            <div className="image-wrapper position-relative mb-4">
              <a
                href="https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
                target="_blank"
                rel="noopener noreferrer"
                className="play-icon"
              >
                <img
                  src="team-discussion.jpg"
                  alt="Team Discussion"
                  className="img-fluid rounded"
                />
                <div className="play-icon">
                  <i className="fas fa-play"></i>
                </div>
              </a>
            </div>
            <div className="progress-bars">
              {[
                { title: "Managed Services", percentage: 90 },
                { title: "Business One Solutions", percentage: 95 },
                { title: "ERP Development", percentage: 80 },
                { title: "Branding Solutions", percentage: 80 },
              ].map((item, index) => (
                <div className="progress-item mb-3" key={index}>
                  <span className="title">{item.title}</span>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{ width: "0%" }}
                      data-percentage={item.percentage}
                    >
                      <span className="progress-number">0%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const BannerSection = () => {
  return (
    <section className="banner-section">
      <div className="overlay"></div>
      <div className="content">
        <h4>We Make Difference</h4>
        <h1>Your Best Choice For Business Growth</h1>
        <button className="cta-button">Get Started Now</button>
      </div>
    </section>
  );
};

export { OurSkillsSection, BannerSection };
