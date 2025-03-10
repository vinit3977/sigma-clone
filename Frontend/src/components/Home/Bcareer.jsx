import './Bcareer.css';
import PW from "../../assets/PW.png";

const Bcareer = () => {
  return (
  < div>
      {/* About Us Section */}
      <section className="about-us-section py-5 fade-in">
        <div className="container">
          <div className="row align-items-center">
            {/* Image Section */}
            <div className="col-lg-6 text-center mb-4 mb-lg-0">
              <div className="image-wrapper">
                <img 
                  src={PW} 
                  alt="Team Working" 
                  className="img-fluid rounded-image" 
                />
              </div>
            </div>
            {/* Content Section */}
            <div className="col-lg-6">
              <div className="content">
                {/* Badge Section */}
                <div className="badge-section d-flex align-items-center mb-3">
                  <i className="fas fa-user-check"></i>
                  <span className="badge-title">&nbsp;Building Careers</span>
                </div>
                {/* Title */}
                <h3 className="section-title">We Are Dedicated To Support You.</h3>
                {/* Description */}
                <p className="text mb-4">
                  At Sigma IT Academy, we are dedicated to shaping the future of IT professionals worldwide. 
                  With over a decade of experience, we specialize in delivering top-notch online training, 
                  corporate training, and IT staffing solutions tailored to individual and organizational needs. 
                  Our expert trainers empower learners with hands-on skills and industry insights, ensuring they 
                  are job-ready from day one.
                  <br /><br />
                  Operating across the UK, USA, and South Africa, we are committed to bridging the skills gap and 
                  helping individuals and businesses thrive in the fast-paced tech world. Join us at Sigma IT Academy, 
                  where we turn ambitions into thriving IT careers.
                </p>
                {/* Button */}
                <a href="/about us.html" className="btn btn-primary">More About Us</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Bcareer;
