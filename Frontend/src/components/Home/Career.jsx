import './Career.css';
import a from "../../assets/Section/a.png";
import b from "../../assets/Section/b.png";
import c from "../../assets/Section/c.png";
import d from "../../assets/Section/d.png";

const Career = () => {
  const skills = [
    {
      icon: a,
      title: "Industry Training",
      description: "Get hands-on experience with cutting-edge technologies and real industry projects that matter."
    },
    {
      icon: b,
      title: "Interview Excellence",
      description: "Master technical interviews with our comprehensive preparation program and expert mentoring."
    },
    {
      icon: c,
      title: "Expert Mentors",
      description: "Learn from industry veterans who bring years of real-world experience to your learning journey."
    },
    {
      icon: d,
      title: "Career Growth",
      description: "Transform your career with personalized guidance, job placement support, and ongoing mentorship."
    }
  ];

  return (
    <section className="network-marketing-section">
      <div className="container">
        <div className="section-title">
          <h2>Transform Your Career</h2>
         
        </div>
        <div className="row justify-content-center">
          {skills.map((skill, index) => (
            <div key={index} className="col-lg-3 col-md-6 mb-4">
              <div className="skill-card text-center">
                <img 
                  src={skill.icon} 
                  alt={skill.title} 
                  className="img-fluid" 
                />
                <h5>{skill.title}</h5>
                <p>{skill.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Career;