import React, { useState } from "react";
import axios from "axios";
import "../styles/Auth.css"; // We'll style this separately

const Auth = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setMessage("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isSignup
        ? "http://localhost:5000/api/auth/register"
        : "http://localhost:5000/api/auth/login";
      const res = await axios.post(url, form);
      setMessage(` Success: Welcome ${res.data.name}`);
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      setMessage(` ${err.response?.data?.message || "Error occurred"}`);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          )}
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
          <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
        </form>
        <p className="toggle" onClick={toggleForm}>
          {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </p>
        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
};

export default Auth;
