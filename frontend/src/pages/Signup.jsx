// ========== Signup.jsx ==========
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Auth.css";
import { API_URL } from "../api"
import { GoogleLogin } from '@react-oauth/google';
const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/register`, form);
      setMessage(`Success: Welcome ${res.data.name}`);
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (err) {
      setMessage(`${err.response?.data?.message || "Error occurred"}`);
    }
  };
  const handleGoogleSuccess = async (credentialResponse) => {
  const res = await axios.post(`${API_URL}/auth/google`, {
    idToken: credentialResponse.credential,
  });
  localStorage.setItem("token", res.data.token); // Matches your api.js logic
  navigate("/home");
};
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Sign Up</button>
          <div className="google-login-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log("Login Failed")}
            />
          </div>
        </form>
        {message && <div className="message">{message}</div>}
        
        <div className="auth-switch">
          <p>Already a user? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;