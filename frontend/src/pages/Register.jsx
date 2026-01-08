import React, { useState } from "react";
import api from "../api/apiClient";
import "./Register.css";
import { Form } from "react-bootstrap";

const Register = ({ goToLogin, goToDashboard }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault(); // ❗ stop page reload

    if (!username || !password) {
      alert("⚠️ Enter all fields");
      return;
    }

    try {
      await api.post("/register", { username, password });

      alert("✅ Registered successfully!");

      // go to dashboard with username
      goToDashboard(username);
    } catch (err) {
      alert(err?.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="register-page">
      <div className="glow glow1"></div>
      <div className="glow glow2"></div>

      <div className="register-card">
        <h3>Register</h3>

        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <button type="submit" className="register-btn">
            Register
          </button>
        </Form>

        <p style={{ marginTop: "12px" }}>
          Already have an account?{" "}
          <button
            className="link-btn"
            onClick={(e) => {
              e.preventDefault();
              goToLogin();
            }}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
