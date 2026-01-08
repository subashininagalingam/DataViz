import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HomePage.css";

const HomePage = ({ goToLogin, goToRegister }) => {
  return (
    <div className="homepage-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <h3 className="brand">DataViz</h3>
        </div>
        <div className="navbar-right">
          <button className="nav-btn login" onClick={goToLogin}>
            Login
          </button>
          <button className="nav-btn register" onClick={goToRegister}>
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero">
        <h1 className="hero-title">
          Transforming <span className="highlight">Data</span> into{" "}
          <span className="highlight">Intelligence</span>
        </h1>
        <p className="hero-text">
          Discover insights faster with our next-generation data visualization platform.
        </p>
        <button className="explore-btn" onClick={goToRegister}>
          Get Started
        </button>
      </div>

      {/* Background Shapes */}
      <div className="glow glow1"></div>
      <div className="glow glow2"></div>
    </div>
  );
};

export default HomePage;