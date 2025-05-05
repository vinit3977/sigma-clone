import React from "react";
import "./DataSection.css";
import B1 from "../../assets/B1.png";
import B2 from "../../assets/B2.png";
import ggl from "../../assets/Ratings/ggl.png";
import jd from "../../assets/Ratings/jd.png";

const HeroSection = () => {
  return (
    <div className="hero-section text-white">
      <div className="row align-items-center py-5">
        {/* Left Section: Text */}
        <div className="col-lg-6 px-5 text-center text-lg-start">
          <h1 className="display-4 fw-bold">Welcome To Sigma IT Academy</h1>
          <div className="lead mt-3">
            Empower your learning journey with Sigma IT Academy. We provide
            customized solutions designed to foster innovation, enhance
            efficiency, and support growth in the IT sector. From personalized
            training programs to advanced ERP solutions and comprehensive IT
            consultancy, we equip you with the tools to excel in a
            technology-driven world.
          </div>

          <div className="d-flex gap-2 mt-4">
            <a
              href="/courses"
              className="btn btn-warning"
              style={{
                width: "200px",
                height: "60px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
              }}
            >
              Get Started
            </a>
            <a
              href="/about"
              className="btn btn-outline-light ms-2"
              style={{
                width: "200px",
                height: "60px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
              }}
            >
              Learn More
            </a>

            {/* <div class="w-100"></div> */}

            {/* <img src={ggl} alt="Person 1" className="img-fluid col rounded" style={{ width: '50px', height: 'auto', objectFit: 'cover', borderRadius: '8px' }} />
            <img src={jd} alt="Person 2" className="img-fluid col" style={{ width: '50px', height: 'auto', objectFit: 'cover', borderRadius: '10px' }} /> */}
          </div>
          <div className="d-flex justify-content-right  mt-4 me-4  gap-3">
            <img
              src={ggl}
              alt="Google rating"
              className="img-fluid"
              style={{
                width: "200px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <img
              src={jd}
              alt="Justdial rating"
              className="img-fluid"
              style={{
                width: "200px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
        </div>

        {/* Right Section: Images */}
        <div className="col-lg-6 d-flex justify-content-center ">
          <img
            src={B1}
            alt="Person 1"
            style={{
              height: "400px",
              width: "150px",
              borderRadius: "50% / 20%",
              border: "2px solid black",
            }}
          />
          &nbsp;
          <img
            src={B2}
            alt="Person 2"
            style={{
              height: "400px",
              width: "150px",
              borderRadius: "50% / 20%",
              border: "2px solid black",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
