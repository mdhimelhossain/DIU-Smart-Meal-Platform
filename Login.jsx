import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

function Login({ setUser }) {
  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!data.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await api.post("/auth/login", data);
      localStorage.setItem("foodPortalToken", res.data.token);
      localStorage.setItem("foodPortalUser", JSON.stringify(res.data.user));
      if (setUser) setUser(res.data.user);
      setMessage({ type: "success", text: "Login successful. Redirecting to profile..." });
      setTimeout(() => navigate("/profile"), 1000);
    } catch (err) {
      setMessage({ type: "error", text: err?.response?.data || err.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setData({ ...data, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="page-container">
      <div className="page-card">
        <h2>Login</h2>
        <p className="subtitle">Access your student or restaurant owner dashboard to manage meals and menus.</p>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={data.email}
            onChange={e => handleChange("email", e.target.value)}
            placeholder="Email"
            disabled={loading}
            className={errors.email ? "error" : ""}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={data.password}
            onChange={e => handleChange("password", e.target.value)}
            placeholder="Password"
            disabled={loading}
            className={errors.password ? "error" : ""}
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>
        <button className="primary-button" onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {message && (
          <p className={`message ${message.type}`}>{message.text}</p>
        )}
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
