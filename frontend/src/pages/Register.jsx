import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    profilePic: "",
    restaurantName: "",
    restaurantInfo: ""
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!data.name.trim()) newErrors.name = "Name is required";
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
    if (data.role === "owner") {
      if (!data.restaurantName.trim()) newErrors.restaurantName = "Restaurant name is required";
      if (!data.restaurantInfo.trim()) newErrors.restaurantInfo = "Restaurant info is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setMessage(null);

    try {
      await api.post("/auth/register", data);
      setMessage({ type: "success", text: "Registration successful. Please login." });
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setMessage({ type: "error", text: err?.response?.data || err.message || "Registration failed" });
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
        <h2>Register</h2>
        <p className="subtitle">Create a student or restaurant owner account to manage meal plans and menus.</p>

        <div className="form-group">
          <label>Name</label>
          <input
            value={data.name}
            onChange={e => handleChange("name", e.target.value)}
            placeholder="Name"
            disabled={loading}
            className={errors.name ? "error" : ""}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>
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
        <div className="form-group">
          <label>User Role</label>
          <select
            value={data.role}
            onChange={e => handleChange("role", e.target.value)}
            disabled={loading}
          >
            <option value="student">Student</option>
            <option value="owner">Restaurant Owner</option>
          </select>
        </div>
        {data.role === "owner" && (
          <>
            <div className="form-group">
              <label>Restaurant Name</label>
              <input
                value={data.restaurantName}
                onChange={e => handleChange("restaurantName", e.target.value)}
                placeholder="Restaurant Name"
                disabled={loading}
                className={errors.restaurantName ? "error" : ""}
              />
              {errors.restaurantName && <span className="error-text">{errors.restaurantName}</span>}
            </div>
            <div className="form-group">
              <label>Restaurant Info</label>
              <textarea
                value={data.restaurantInfo}
                onChange={e => handleChange("restaurantInfo", e.target.value)}
                placeholder="Restaurant description"
                disabled={loading}
                className={errors.restaurantInfo ? "error" : ""}
              />
              {errors.restaurantInfo && <span className="error-text">{errors.restaurantInfo}</span>}
            </div>
          </>
        )}
        <button className="primary-button" onClick={handleRegister} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        {message && (
          <p className={`message ${message.type}`}>{message.text}</p>
        )}
        <p>
          Already have an account? <Link to="/login">Login now</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
