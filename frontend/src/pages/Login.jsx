import React, { useState } from "react";
import api from "../api/apiClient";
import { Form } from "react-bootstrap";
import "./Login.css"; // ✅ Add this

const Login = ({ onLoginSuccess, goToRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("⚠️ Enter all fields");
      return;
    }
    try {
      const res = await api.post("/login", { username, password });
      onLoginSuccess(res.data.username);
      alert("✅ Logged in successfully!");
    } catch (err) {
      alert(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="glow glow1"></div>
      <div className="glow glow2"></div>

      <div className="login-card">
        <h3>🔐 Login</h3>
        <Form>
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
          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>
        </Form>
        <p>
          Don’t have an account?{" "}
          <button className="link-btn" onClick={goToRegister}>
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
