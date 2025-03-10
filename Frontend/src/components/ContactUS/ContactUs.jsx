import React from 'react';
import './ContactUs.css';


const ContactUs = () => {
  return (
    <>
    
      {/* Contact Header */}
      <section className="contact-header">
        <h1>Contact Us</h1>
      </section>

      {/* Contact Information */}
      <section className="contacts-infos container mt-5">
        <div className="info-box">
          <i className="bi bi-geo-alt-fill text-danger"></i>
          <h4>Visit Us On</h4>
          <p>TF-10, Divya Plaza complex, Ajwa Road - Vadodara, Gujarat(390019)</p>
        </div>
        <div className="info-box">
          <i className="bi bi-telephone-fill text-primary"></i>
          <h4>Call Us On</h4>
          <p>+91-9664778530</p>
        </div>
        <div className="info-box">
          <i className="bi bi-envelope-fill text-warning"></i>
          <h4>Mail Us @</h4>
          <p>hello@sigmaacademy.net</p>
        </div>
        <div className="info-box">
          <i className="bi bi-calendar-event-fill text-success"></i>
          <h4>Visit Time</h4>
          <p>Mon-Sat: 10:00am-7:00pm<br />Sunday: Closed</p>
        </div>
      </section>

      <section>
        <div className="custom container mt-5">
          <div className="row">
            {/* Form Section */}
            <div className="col-md-6">
              <div className="form-section">
                <h2>Request A Call Back</h2>
                <form action="http://localhost:3000/send-email" method="POST">
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input type="text" className="form-control" id="firstName" name="firstName" placeholder="First Name" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input type="text" className="form-control" id="lastName" name="lastName" placeholder="Last Name" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email" placeholder="Email Address" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone No</label>
                    <input type="text" className="form-control" id="phone" name="phone" placeholder="Phone No" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="comments" className="form-label">Comments</label>
                    <textarea className="form-control" id="comments" name="comments" rows="3" placeholder="Comments"></textarea>
                  </div>
                  <button type="submit" className="btn btn-submit">Submit Form</button>
                </form>
              </div>
            </div>

            {/* Help & Location Section */}
            <div className="col-md-6">
              <div className="contact-details mb-4">
                <h2>Help You With Heart</h2>
                <p>
                  Feel free to reach out to Sigma IT Solutions and Services for all your technology needs. Whether it's software development, IT consulting, or SAP solutions, we're here to help you innovate and succeed. Contact us today for a consultation and let's explore how we can collaborate to achieve your business goals.
                </p>
            
              </div>
              <div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3690.9107489259763!2d73.2472949758667!3d22.319214942208543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fcff1425394f3%3A0x306e1ed6302945a9!2sSigma%20IT%20Academy!5e0!3m2!1sen!2sin!4v1733988937857!5m2!1sen!2sin"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
      <br></br>
    
    </>
  );
};

export default ContactUs;
