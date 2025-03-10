import './Career.css';
import a from "../../assets/Section/a.png";
import b from "../../assets/Section/b.png";
import c from "../../assets/Section/c.png";
import d from "../../assets/Section/d.png";


const Career = () => {
  return (
    <div><section className="network-marketing-section fade-in">
    <div className="container">
      <h2 className="text-center mb-4">Building Careers in Tech</h2>
      <div className="row text-center">
        {/* Practical Training */}
        <div className="col-lg-3 col-md-6 mb-4">
          <img 
            src={a} 
            alt="Practical training" 
            className="img-fluid mb-3" 
          />
          <h5>Practical Training</h5>
        </div>
        {/* Dedicated Interview Preparation */}
        <div className="col-lg-3 col-md-6 mb-4">
          <img 
            src={b} 
            alt="Dedicated Interview preparation" 
            className="img-fluid mb-3" 
          />
          <h5>Dedicated Interview Preparation</h5>
        </div>
        {/* 10+ Years Experienced Expert */}
        <div className="col-lg-3 col-md-6 mb-4">
          <img 
            src={c} 
            alt="10+ years experienced Expert" 
            className="img-fluid mb-3" 
          />
          <h5>10+ Years Experienced Expert</h5>
        </div>
        {/* Guaranteed Job Assistance */}
        <div className="col-lg-3 col-md-6 mb-4">
          <img 
            src={d}
            alt="Guaranteed Job Assistance" 
            className="img-fluid mb-3" 
          />
          <h5>Guaranteed Job Assistance</h5>
        </div>
      </div>
    </div>
  </section>
  </div>
  )
}
export default Career;