import React from "react";
import "./WelcomePage.css";

const WelcomePage = ({ username, goToDashboard }) => {
  return (
    <div className="homepage">
      {/* Main Center Content */}
      <div className="home-content">

        {username ? (
          <h2 className="welcome-text">
            Welcome, <span>{username}</span> 👋
          </h2>
        ) : (
          <h2 className="welcome-text">
            Welcome to <span>Vision Analytics</span> 👋
          </h2>
        )}

        <h1 className="main-heading">
          Transforming <span>Data</span> into <span>Intelligence</span>
        </h1>

        <p className="sub-text">
          Discover insights faster with our next-generation data visualization platform.
        </p>

        {/* ✅ GET STARTED BUTTON */}
        <button className="get-started-btn" onClick={goToDashboard}>
          Get Started
        </button>

      </div>
    </div>
  );
};

export default WelcomePage;
