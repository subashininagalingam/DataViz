import React from "react";
import "./Settings.css";

const Settings = ({ username, onLogout, goToReports, goToDashboard }) => {
  return (
    <div className="settings-page">
      {/* Back Button */}
      <button className="back-btn" onClick={goToDashboard}>
        ⬅ Back
      </button>

      {/* Settings Card */}
      <div className="settings-card">
        <h2 className="settings-title">⚙️ Settings</h2>

        {/* Username */}
        <p className="username-text">
          Logged in as <span>{username}</span>
        </p>

        {/* History */}
        <button className="history-btn" onClick={goToReports}>
          📜 History
        </button>

        {/* Logout */}
        <button className="logout-btn" onClick={onLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;
