import React from 'react';
import './Clients.css';
import MG from "../../assets/Clients logos/MG.png";
import SUZ from "../../assets/Clients logos/SUZ.png";
import VAD from "../../assets/Clients logos/VAD.png";
import WAG from "../../assets/Clients logos/WAG.jpg";
import ADV from "../../assets/Clients logos/ADV.png";
import INF from "../../assets/Clients logos/INF.png";


const Clients = () => {
  return (
    <section>
      <div className="client-section">
        <h2 className="client-title">Our Valued Clients</h2>
        <p className="client-subtitle">
          We've had the privilege of collaborating with a diverse range of clients across various industries.
        </p>
        <div id="clientCarousel" className="carousel slide" data-bs-ride="carousel">
          {/* Carousel Items */}
          <div className="carousel-inner">
            {/* First Slide */}
            <div className="carousel-item active">
              <div className="d-flex justify-content-around align-items-center">
                <a href="https://www.mgmotor.co.in/" target="_blank" rel="noopener noreferrer">
                  <img className="client-logo" src={MG} alt="MG" />
                </a>
                <a href="https://www.marutisuzuki.com/" target="_blank" rel="noopener noreferrer">
                  <img className="client-logo" src={SUZ} alt="Suzuki" />
                </a>
                <a href="https://vadilalicecreams.com/" target="_blank" rel="noopener noreferrer">
                  <img className="client-logo" src={VAD} alt="Vadilal_Group_Logo" />
                </a>
                <a href="https://infocus.com/" target="_blank" rel="noopener noreferrer">
                  <img className="client-logo" src={INF} alt="infocous" />
                </a>
                <a href="https://www.waghbakritea.com/" target="_blank" rel="noopener noreferrer">
                  <img className="client-logo" src={WAG} alt="wagh bakri" />
                </a>
                <a href="http://www.addmine.in/" target="_blank" rel="noopener noreferrer">
                  <img className="client-logo" src={ADV} alt="advance admine" />
                </a>
              </div>
            </div>
            {/* Second Slide */}
            {/* <div className="carousel-item">
              <div className="d-flex justify-content-around align-items-center">
                <a href="https://example.com/client4" target="_blank" rel="noopener noreferrer">
                  <img className="client-logo" src="/assests/Clients logos/wagh bakri.jpg" alt="Client 4" />
                </a>
                <a href="https://example.com/client5" target="_blank" rel="noopener noreferrer">
                  <img className="client-logo" src="https://via.placeholder.com/150x100?text=Client5" alt="Client 5" />
                </a>
                <a href="https://example.com/client6" target="_blank" rel="noopener noreferrer">
                  <img className="client-logo" src="https://via.placeholder.com/150x100?text=Client6" alt="Client 6" />
                </a>
              </div>
            </div> */}
            {/* Third Slide */}
            {/* <div className="carousel-item">
              <div className="d-flex justify-content-around align-items-center">
                <a href="https://example.com/client7" target="_blank" rel="noopener noreferrer">
                  <img className="client-logo" src="https://via.placeholder.com/150x100?text=Client7" alt="Client 7" />
                </a>
                <a href="https://example.com/client8" target="_blank" rel="noopener noreferrer">
                  <img className="client-logo" src="https://via.placeholder.com/150x100?text=Client8" alt="Client 8" />
                </a>
                <a href="https://example.com/client9" target="_blank" rel="noopener noreferrer">
                  <img className="client-logo" src="https://via.placeholder.com/150x100?text=Client9" alt="Client 9" />
                </a>
              </div>
            </div> */}
          </div>

          {/* Dots Indicators */}
          {/* <div className="carousel-indicators">
            <button type="button" data-bs-target="#clientCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#clientCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#clientCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div> */}

          {/* Carousel Controls */}
          {/* <button className="carousel-control-prev" type="button" data-bs-target="#clientCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button> */}
          {/* <button className="carousel-control-next" type="button" data-bs-target="#clientCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button> */}
        </div>
      </div>
    </section>
  );
};

export default Clients;
