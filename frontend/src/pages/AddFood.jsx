import { useState } from "react";
import api from "../utils/api";

function AddFood() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    status: "available",
    category: "Breakfast"
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Food name is required";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) {
      newErrors.price = "Please enter a valid price greater than 0";
    }
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (form.image && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(form.image)) {
      newErrors.image = "Please enter a valid image URL (jpg, png, gif, webp)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddFood = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setMessage(null);

    try {
      await api.post("/food/add", {
        ...form,
        price: Number(form.price)
      });
      setMessage({ type: "success", text: "Food item added successfully." });
      setForm({ name: "", price: "", image: "", description: "", status: "available", category: "Breakfast" });
    } catch (err) {
      setMessage({ type: "error", text: err?.response?.data || err.message || "Failed to add food" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="page-container">
      <div className="page-card">
        <h2>Add Food</h2>
        <p className="subtitle">Add a new dish to your restaurant menu and keep your students updated in real time.</p>

        <div className="form-group">
          <label>Name</label>
          <input
            value={form.name}
            onChange={e => handleChange("name", e.target.value)}
            placeholder="Food name"
            disabled={loading}
            className={errors.name ? "error" : ""}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            value={form.price}
            onChange={e => handleChange("price", e.target.value)}
            placeholder="Price"
            disabled={loading}
            className={errors.price ? "error" : ""}
          />
          {errors.price && <span className="error-text">{errors.price}</span>}
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            value={form.category}
            onChange={e => handleChange("category", e.target.value)}
            disabled={loading}
          >
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snacks">Snacks</option>
            <option value="Drinks">Drinks</option>
            <option value="Lunch/Dinner">Lunch/Dinner</option>
          </select>
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input
            value={form.image}
            onChange={e => handleChange("image", e.target.value)}
            placeholder="Image URL (optional)"
            disabled={loading}
            className={errors.image ? "error" : ""}
          />
          {errors.image && <span className="error-text">{errors.image}</span>}
          {form.image && !errors.image && (
            <div className="image-preview">
              <img src={form.image} alt="Preview" onError={() => setErrors({ ...errors, image: "Invalid image URL" })} />
            </div>
          )}
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={e => handleChange("description", e.target.value)}
            placeholder="Description"
            disabled={loading}
            className={errors.description ? "error" : ""}
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>
        <button className="primary-button" onClick={handleAddFood} disabled={loading}>
          {loading ? "Adding..." : "Add Food"}
        </button>
        {message && (
          <p className={`message ${message.type}`}>{message.text}</p>
        )}
      </div>
    </div>
  );
}

export default AddFood;
