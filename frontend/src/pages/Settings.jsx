import React, { useState } from "react";
import "./Settings.css";

const Settings = ({ username, onLogout, goToDashboard }) => {
  const [page, setPage] = useState("settings");
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [notification, setNotification] = useState("");

  const showNotify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleLogoutYes = () => {
    setShowConfirm(false);
    onLogout();
  };

  return (
    <>
      {/* 🔔 NOTIFICATION (GLOBAL) */}
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}

      {/* ================= SETTINGS PAGE ================= */}
      {page === "settings" && (
        <div className="settings-page">
          <button className="back-btn" onClick={goToDashboard}>
            ⬅ Back
          </button>

          <div className="settings-card">
            <h2>⚙️ Settings</h2>
            <p>
              Logged in as <b>{username}</b>
            </p>

            <button
              className="settings-btn"
              onClick={() => setPage("privacy")}
            >
              🛡️ Privacy
            </button>

            <button
              className="settings-btn"
              onClick={() => setPage("help")}
            >
              ❓ Help & Support
            </button>

            <button
              className="logout-btn"
              onClick={() => {
                if (!agreePrivacy) {
                  showNotify("⚠️ Please agree to Privacy Policy");
                  return;
                }
                setShowConfirm(true);
              }}
            >
              🚪 Logout
            </button>
          </div>

          {showConfirm && (
            <div className="confirm-overlay">
              <div className="confirm-box">
                <h3>Do you want to logout?</h3>

                <div className="confirm-actions">
                  <button className="yes-btn" onClick={handleLogoutYes}>
                    Yes
                  </button>
                  <button
                    className="no-btn"
                    onClick={() => setShowConfirm(false)}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= PRIVACY PAGE ================= */}
      {page === "privacy" && (
        <div className="settings-page">
          <div className="settings-card">
            <h2>🛡️ Privacy</h2>

            <p className="privacy-text">
              We never share your data without permission.
            </p>

            <div className="privacy-toggle">
              <span>I agree to Privacy Policy</span>

              <label className="switch">
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={() => {
                    setAgreePrivacy(!agreePrivacy);
                    showNotify(
                      !agreePrivacy
                        ? "✅ Privacy Accepted"
                        : "⚠️ Privacy Disabled"
                    );
                  }}
                />
                <span className="slider"></span>
              </label>
            </div>

            <p className="privacy-status">
              Status:
              <b style={{ color: agreePrivacy ? "green" : "red" }}>
                {" "}
                {agreePrivacy ? "Agreed" : "Not Agreed"}
              </b>
            </p>

            <button
              className="settings-btn"
              onClick={() => setPage("settings")}
            >
              ⬅ Back
            </button>
          </div>
        </div>
      )}

      {/* ================= HELP PAGE ================= */}
      {page === "help" && (
        <div className="settings-page">
          <div className="settings-card">
            <h2>❓ Help & Support</h2>

            <p>Contact us:</p>

            <p className="help-mail">
              📧 <b>datavisual.team@gmail.com</b>
            </p>

            <a
              href="mailto:datavisual.team@gmail.com"
              className="settings-btn"
              onClick={() => showNotify("📧 Opening mail app")}
            >
              Send Email
            </a>

            <button
              className="settings-btn"
              onClick={() => setPage("settings")}
            >
              ⬅ Back
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
