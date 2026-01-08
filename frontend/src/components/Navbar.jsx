import React, { useState } from "react";
import "./Navbar.css";

const Navbar = ({ currentPage, setPage, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (page) => {
    setPage(page);
    setMenuOpen(false); // 👈 click pannina apram close
  };

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => handleNavClick("welcome")}>
        DataViz
      </div>

      {/* ☰ Hamburger – ONLY CLICK shows menu */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Menu */}
      <div className={`nav-links ${menuOpen ? "show" : ""}`}>
        <span
          className={currentPage === "welcome" ? "nav-link active" : "nav-link"}
          onClick={() => handleNavClick("welcome")}
        >
          Home
        </span>

        <span
          className={currentPage === "upload" ? "nav-link active" : "nav-link"}
          onClick={() => handleNavClick("upload")}
        >
          Upload
        </span>

        <span
          className={currentPage === "reports" ? "nav-link active" : "nav-link"}
          onClick={() => handleNavClick("reports")}
        >
          Reports
        </span>

        <span
          className={currentPage === "charts" ? "nav-link active" : "nav-link"}
          onClick={() => handleNavClick("charts")}
        >
          Charts
        </span>

        <span
          className={currentPage === "settings" ? "nav-link active" : "nav-link"}
          onClick={() => handleNavClick("settings")}
        >
          Settings
        </span>

        <span className="logout" onClick={onLogout}>
          Logout
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
