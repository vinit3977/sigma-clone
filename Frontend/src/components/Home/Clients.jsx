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
    <section className="clients-container">
      <div className="section-header">
        <h2 className="section-title">Our Valued Clients</h2>
        <div className="title-underline"></div>
        <p className="section-description">
          We've had the privilege of collaborating with a diverse range of clients across various industries.
        </p>
      </div>

      <div className="clients-slider-container">
        <div className="clients-track">
          {/* First Set */}
          <div className="client-slide">
            <a href="https://www.mgmotor.co.in/" target="_blank" rel="noopener noreferrer" className="client-item">
              <img className="client-logo" src={MG} alt="MG" />
            </a>
          </div>
          <div className="client-slide">
            <a href="https://www.marutisuzuki.com/" target="_blank" rel="noopener noreferrer" className="client-item">
              <img className="client-logo" src={SUZ} alt="Suzuki" />
            </a>
          </div>
          <div className="client-slide">
            <a href="https://vadilalicecreams.com/" target="_blank" rel="noopener noreferrer" className="client-item">
              <img className="client-logo" src={VAD} alt="Vadilal_Group_Logo" />
            </a>
          </div>
          <div className="client-slide">
            <a href="https://infocus.com/" target="_blank" rel="noopener noreferrer" className="client-item">
              <img className="client-logo" src={INF} alt="infocous" />
            </a>
          </div>
          <div className="client-slide">
            <a href="https://www.waghbakritea.com/" target="_blank" rel="noopener noreferrer" className="client-item">
              <img className="client-logo" src={WAG} alt="wagh bakri" />
            </a>
          </div>
          <div className="client-slide">
            <a href="http://www.addmine.in/" target="_blank" rel="noopener noreferrer" className="client-item">
              <img className="client-logo" src={ADV} alt="advance admine" />
            </a>
          </div>

          {/* Duplicate Set for Infinite Scroll Effect */}
          <div className="client-slide">
            <a href="https://www.mgmotor.co.in/" target="_blank" rel="noopener noreferrer" className="client-item">
              <img className="client-logo" src={MG} alt="MG" />
            </a>
          </div>
          <div className="client-slide">
            <a href="https://www.marutisuzuki.com/" target="_blank" rel="noopener noreferrer" className="client-item">
              <img className="client-logo" src={SUZ} alt="Suzuki" />
            </a>
          </div>
          <div className="client-slide">
            <a href="https://vadilalicecreams.com/" target="_blank" rel="noopener noreferrer" className="client-item">
              <img className="client-logo" src={VAD} alt="Vadilal_Group_Logo" />
            </a>
          </div>
          <div className="client-slide">
            <a href="https://infocus.com/" target="_blank" rel="noopener noreferrer" className="client-item">
              <img className="client-logo" src={INF} alt="infocous" />
            </a>
          </div>
          <div className="client-slide">
            <a href="https://www.waghbakritea.com/" target="_blank" rel="noopener noreferrer" className="client-item">
              <img className="client-logo" src={WAG} alt="wagh bakri" />
            </a>
          </div>
          <div className="client-slide">
            <a href="http://www.addmine.in/" target="_blank" rel="noopener noreferrer" className="client-item">
              <img className="client-logo" src={ADV} alt="advance admine" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Clients;
