// ========== Login.jsx ==========
import React, { useState } from "react";
import axios from "axios";
import "../styles/Auth.css";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ emailOrUsername: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      setMessage(`Welcome back ${res.data.name}`);
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (err) {
      setMessage(`${err.response?.data?.message || "Error occurred"}`);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="emailOrUsername"
            placeholder="Email / Username"
            value={form.emailOrUsername}
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
          <button type="submit">Login</button>
        </form>
        {message && <div className="message">{message}</div>}
        
        <div className="auth-switch">
          <p>New user? <Link to="/signup">Create an account</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;