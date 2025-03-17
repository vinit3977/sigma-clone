import './OurSkillsSection.css'; 

import teamDiscussion from "../../assets/PW.png";

import React, { useEffect, useState, useRef } from "react";


const OurSkillsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('services');
  const [hoveredCard, setHoveredCard] = useState(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          if (activeTab === 'expertise') {
            startCountAnimation();
          }
        }
      },
      { threshold: 0.2 }
    );

    const section = document.querySelector(".our-skills-section");
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) observer.unobserve(section);
    };
  }, [activeTab]);

  const startCountAnimation = () => {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-value'));
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          stat.textContent = stat.getAttribute('data-format');
          clearInterval(timer);
        } else {
          stat.textContent = Math.floor(current) + (stat.getAttribute('data-suffix') || '');
        }
      }, 30);
    });
  };

  const servicesData = [
    {
      title: "Enterprise IT Solutions",
      percentage: 95,
      description: "Comprehensive enterprise-level IT management",
      icon: "🏢",
      features: ["24/7 Support", "Cloud Integration", "Security"],
      color: "blue"
    },
    {
      title: "Digital Transformation",
      percentage: 92,
      description: "End-to-end digital transformation services",
      icon: "🚀",
      features: ["Process Automation", "Data Analytics", "Innovation"],
      color: "orange"
    },
    {
      title: "Custom Development",
      percentage: 88,
      description: "Bespoke software solutions for your needs",
      icon: "💻",
      features: ["Web Apps", "Mobile Apps", "Enterprise Software"],
      color: "green"
    },
    {
      title: "Tech Consulting",
      percentage: 90,
      description: "Strategic technology consulting services",
      icon: "📊",
      features: ["Strategy Planning", "Tech Advisory", "Implementation"],
      color: "purple"
    }
  ];

  const expertiseAreas = [
    {
      title: "Cloud Solutions",
      count: "50+",
      suffix: "+",
      value: 50,
      description: "Successfully Deployed Cloud Projects",
      icon: "☁️"
    },
    {
      title: "Digital Innovation",
      count: "200+",
      suffix: "+",
      value: 200,
      description: "Digital Transformation Projects",
      icon: "💡"
    },
    {
      title: "Client Success",
      count: "98%",
      suffix: "%",
      value: 98,
      description: "Client Satisfaction Rate",
      icon: "⭐"
    },
    {
      title: "Global Reach",
      count: "20+",
      suffix: "+",
      value: 20,
      description: "Countries Served",
      icon: "🌍"
    }
  ];

  return (
    <section className="our-skills-section">
      <div className="modern-background">
        <div className="gradient-sphere gradient-1"></div>
        <div className="gradient-sphere gradient-2"></div>
        <div className="pattern-grid"></div>
      </div>

      <div className="container position-relative">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <div className={`section-header fade-in ${isVisible ? 'visible' : ''}`}>
              <span className="section-badge">Our Expertise</span>
              <h2 className="section-title">
                Driving Digital Excellence Through Innovation
              </h2>
              <p className="section-subtitle">
                Empowering businesses with cutting-edge technology solutions and strategic innovations
              </p>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-12">
            <div className="tab-navigation">
              <button 
                className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
                onClick={() => setActiveTab('services')}
              >
                <span className="tab-icon">⚡</span>
                Our Services
              </button>
              <button 
                className={`tab-btn ${activeTab === 'expertise' ? 'active' : ''}`}
                onClick={() => setActiveTab('expertise')}
              >
                <span className="tab-icon">📈</span>
                Key Metrics
              </button>
            </div>
          </div>
        </div>

        <div className="content-wrapper">
          {activeTab === 'services' ? (
            <div className="row services-grid">
              {servicesData.map((service, index) => (
                <div 
                  className="col-lg-6 mb-4" 
                  key={index}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className={`service-card fade-in ${isVisible ? 'visible' : ''} ${service.color}`}>
                    <div className="service-header">
                      <div className="service-icon">{service.icon}</div>
                      <h3 className="service-title">{service.title}</h3>
                    </div>
                    <p className="service-description">{service.description}</p>
                    <div className="progress-wrapper">
                      <div className="progress">
                        <div 
                          className="progress-bar"
                          style={{ 
                            width: isVisible ? `${service.percentage}%` : '0%',
                            background: hoveredCard === index ? 'linear-gradient(90deg, #FF5733, #ff7e57)' : ''
                          }}
                        >
                          <span className="progress-label">{service.percentage}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="features-list">
                      {service.features.map((feature, idx) => (
                        <span key={idx} className="feature-tag">
                          <span className="feature-dot"></span>
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="row expertise-stats" ref={statsRef}>
              {expertiseAreas.map((area, index) => (
                <div className="col-lg-3 col-md-6 mb-4" key={index}>
                  <div className={`stat-card fade-in ${isVisible ? 'visible' : ''}`}>
                    <div className="stat-icon">{area.icon}</div>
                    <h3 
                      className="stat-number" 
                      data-value={area.value}
                      data-suffix={area.suffix}
                      data-format={area.count}
                    >
                      0{area.suffix}
                    </h3>
                    <h4 className="stat-title">{area.title}</h4>
                    <p className="stat-description">{area.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="row mt-5">
          <div className="col-12 text-center">
            <a href="#contact" className="cta-button">
              <span>Start Your Digital Journey</span>
              <svg className="arrow-icon" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
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
