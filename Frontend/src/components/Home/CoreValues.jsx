import React from 'react';
import './CoreValues.css';

const CoreValues = () => {
  const coreValues = [
    {
      icon: "fas fa-bullseye",
      title: "GOALS",
      description: "We want to establish a platform where individuals can learn, skill up, and build their professional careers in both IT and Non-IT domains"
    },
    {
      icon: "fas fa-users",
      title: "TEAMWORK",
      description: "We believe in fostering a collaborative environment where individuals come together, share ideas, and work as one to achieve collective success"
    },
    {
      icon: "fas fa-handshake",
      title: "CUSTOMERS",
      description: "We aim to provide unparalleled value and create lasting relationships by understanding and exceeding the expectations of our customers"
    },
    {
      icon: "fas fa-check-circle",
      title: "COMMITMENT",
      description: "We are dedicated to delivering excellence by staying true to our promises and putting consistent effort into achieving results"
    },
    {
      icon: "fas fa-sync",
      title: "INTEGRITY",
      description: "We uphold honesty and transparency in every interaction, building trust and credibility with our clients, learners, and team"
    },
    {
      icon: "fas fa-cog",
      title: "RESPONSIBILITY",
      description: "We take ownership of our actions and their impact, ensuring accountability while contributing positively to our community and industry"
    }
  ];

  return (
    <section className="core-values">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="core-value-title">Our Core Values</h2>
          <p className="core-value-description">
            Our guiding principles define our mission, drive our success, and inspire excellence for our clients and team.
          </p>
        </div>
        <div className="row g-4">
          {coreValues.map((value, index) => (
            <div className="col-md-4" key={index}>
              <div className="core-value-card">
                <div className="icon-wrapper">
                  <i className={value.icon}></i>
                </div>
                <h5>{value.title}</h5>
                <p>{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValues;
