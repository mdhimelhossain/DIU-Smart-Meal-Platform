import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const emptyFoodForm = {
  name: "",
  price: "",
  image: "",
  description: "",
  status: "available",
  category: "Breakfast"
};

function Profile({ setUser }) {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    profilePic: "",
    restaurantName: "",
    restaurantInfo: ""
  });
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Food management
  const [foodMessage, setFoodMessage] = useState(null);
  const [foodSaving, setFoodSaving] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [foodForm, setFoodForm] = useState(emptyFoodForm);
  const [foodSearch, setFoodSearch] = useState("");
  const [foodFilter, setFoodFilter] = useState("all");

  // Meal plan
  const [mealPlan, setMealPlan] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [mealRestaurant, setMealRestaurant] = useState("");
  const [availableFoods, setAvailableFoods] = useState([]);
  const [mealMessage, setMealMessage] = useState(null);
  const [mealLoading, setMealLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFood, setSelectedFood] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  // Dashboard states
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState(null);

  const navigate = useNavigate();

  const loadDashboard = async () => {
    setDashboardLoading(true);
    setDashboardError(null);
    try {
      const dashRes = await api.get("/user/dashboard");
      setDashboardData(dashRes.data);
    } catch (err) {
      setDashboardData(null);
      setDashboardError(err?.response?.data || err.message || "Unable to load dashboard data");
    } finally {
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("foodPortalToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await api.get("/user/profile");
        setProfile(data);
        setForm({
          name: data.name || "",
          email: data.email || "",
          profilePic: data.profilePic || "",
          restaurantName: data.restaurantName || "",
          restaurantInfo: data.restaurantInfo || ""
        });
        if (data.profilePic) {
          setProfilePicPreview(data.profilePic);
        }

        if (data.role === "owner") {
          const foodsRes = await api.get(`/food/restaurant/${data._id}`);
          setFoods(foodsRes.data.foods || []);
        }

        if (data.role === "student") {
          const restRes = await api.get("/user/restaurants");
          setRestaurants(restRes.data);
          try {
            const planRes = await api.get("/mealplan/current");
            setMealPlan(planRes.data);
          } catch (err) {
            // No plan
          }
          await loadDashboard();
        }
      } catch (err) {
        setError(err?.response?.data || err.message || "Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    if (mealRestaurant) {
      api.get(`/food/restaurant/${mealRestaurant}`)
        .then(res => setAvailableFoods(res.data.foods || []))
        .catch(() => setAvailableFoods([]));
    } else {
      setAvailableFoods([]);
    }
  }, [mealRestaurant]);

  const handleSaveProfile = async () => {
    setMessage(null);
    setSaving(true);

    try {
      const { data } = await api.put("/user/profile", {
        name: form.name,
        email: form.email,
        profilePic: form.profilePic,
        restaurantName: form.restaurantName,
        restaurantInfo: form.restaurantInfo
      });
      setProfile(data);
      localStorage.setItem("foodPortalUser", JSON.stringify(data));
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setMessage({ type: "error", text: err?.response?.data || err.message || "Unable to save profile" });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("foodPortalToken");
      localStorage.removeItem("foodPortalUser");
      if (setUser) setUser(null);
      navigate("/");
    }
  };

  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setMessage({ type: "error", text: "Please select a valid image file" });
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setMessage({ type: "error", text: "File size must be less than 10MB" });
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        setForm({ ...form, profilePic: base64String });
        setProfilePicPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Food Management Functions
  const loadOwnerFoods = async (ownerId) => {
    try {
      const { data } = await api.get(`/food/restaurant/${ownerId}`);
      setFoods(data.foods || []);
    } catch (err) {
      setFoodMessage({ type: "error", text: err?.response?.data || err.message || "Unable to load menu" });
    }
  };

  const handleToggleStatus = async (food) => {
    setFoodMessage(null);
    setFoodSaving(true);

    try {
      const status = food.status === "available" ? "unavailable" : "available";
      const { data } = await api.put(`/food/${food._id}`, { status });
      setFoods((current) => current.map((item) => (item._id === food._id ? data : item)));
      setFoodMessage({ type: "success", text: `Food marked as ${status}.` });
    } catch (err) {
      setFoodMessage({ type: "error", text: err?.response?.data || err.message || "Unable to update status" });
    } finally {
      setFoodSaving(false);
    }
  };

  const handleAddFoodClick = () => {
    setEditingFood(null);
    setFoodForm(emptyFoodForm);
    setShowFoodModal(true);
  };

  const handleEditFood = (food) => {
    setEditingFood(food);
    setFoodForm({
      name: food.name || "",
      price: food.price || "",
      image: food.image || "",
      description: food.description || "",
      status: food.status || "available",
      category: food.category || "Breakfast"
    });
    setShowFoodModal(true);
  };

  const handleSaveFood = async () => {
    setFoodMessage(null);
    setFoodSaving(true);

    try {
      if (editingFood) {
        // Edit mode
        const { data } = await api.put(`/food/${editingFood._id}`, {
          ...foodForm,
          price: Number(foodForm.price)
        });
        setFoods((current) => current.map((item) => (item._id === editingFood._id ? data : item)));
        setFoodMessage({ type: "success", text: "Food item updated successfully." });
      } else {
        // Add mode
        const { data } = await api.post("/food/add", {
          ...foodForm,
          price: Number(foodForm.price)
        });
        setFoods((current) => [...current, data]);
        setFoodMessage({ type: "success", text: "Food item added successfully." });
      }
      setShowFoodModal(false);
      setEditingFood(null);
      setFoodForm(emptyFoodForm);
    } catch (err) {
      setFoodMessage({ type: "error", text: err?.response?.data || err.message || "Unable to save food" });
    } finally {
      setFoodSaving(false);
    }
  };

  const handleDeleteFood = async (foodId) => {
    if (!window.confirm("Are you sure you want to delete this food item?")) return;

    setFoodMessage(null);
    setFoodSaving(true);

    try {
      await api.delete(`/food/${foodId}`);
      setFoods((current) => current.filter((item) => item._id !== foodId));
      setFoodMessage({ type: "success", text: "Food item removed successfully." });
    } catch (err) {
      setFoodMessage({ type: "error", text: err?.response?.data || err.message || "Unable to remove food" });
    } finally {
      setFoodSaving(false);
    }
  };

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(foodSearch.toLowerCase()) ||
                         food.description?.toLowerCase().includes(foodSearch.toLowerCase());
    const matchesFilter = foodFilter === "all" || food.status === foodFilter;
    return matchesSearch && matchesFilter;
  });

  const handleEnroll = async () => {
    if (!selectedRestaurant) return;
    setMealLoading(true);
    setMealMessage(null);
    try {
      await api.post("/user/enroll", { restaurantId: selectedRestaurant });
      // Reload profile
      const { data } = await api.get("/user/profile");
      setProfile(data);
      setForm({
        name: data.name || "",
        email: data.email || "",
        profilePic: data.profilePic || "",
        restaurantName: data.restaurantName || "",
        restaurantInfo: data.restaurantInfo || ""
      });
      await loadDashboard();
      setMealMessage({ type: "success", text: "Enrolled successfully" });
    } catch (err) {
      setMealMessage({ type: "error", text: err?.response?.data || err.message });
    } finally {
      setMealLoading(false);
    }
  };

  const handleUnenroll = async (restaurantId) => {
    if (!window.confirm("Are you sure you want to unenroll? All your meals from this restaurant will be removed.")) {
      return;
    }
    setMealLoading(true);
    setMealMessage(null);
    try {
      await api.post("/mealplan/unenroll", { restaurantId });
      // Reload profile, meal plan, and dashboard
      const { data } = await api.get("/user/profile");
      setProfile(data);
      setForm({
        name: data.name || "",
        email: data.email || "",
        profilePic: data.profilePic || "",
        restaurantName: data.restaurantName || "",
        restaurantInfo: data.restaurantInfo || ""
      });
      try {
        const planRes = await api.get("/mealplan/current");
        setMealPlan(planRes.data);
      } catch (err) {
        setMealPlan(null);
      }
      await loadDashboard();
      setMealMessage({ type: "success", text: "Unenrolled successfully and all history removed" });
    } catch (err) {
      setMealMessage({ type: "error", text: err?.response?.data || err.message });
    } finally {
      setMealLoading(false);
    }
  };

  const handleSelectMeal = async (date, foodId, restaurantId) => {
    setMealLoading(true);
    try {
      const res = await api.post("/mealplan/select", { date, foodId, restaurantId, quantity: parseInt(quantity) || 1 });
      setMealPlan(res.data.plan);

      // Refresh profile so foodHistory gets updated from server state
      try {
        const profileRes = await api.get("/user/profile");
        setProfile(profileRes.data);
        setForm({
          name: profileRes.data.name || "",
          email: profileRes.data.email || "",
          profilePic: profileRes.data.profilePic || "",
          restaurantName: profileRes.data.restaurantName || "",
          restaurantInfo: profileRes.data.restaurantInfo || ""
        });
      } catch (profileErr) {
        // ignore profile refresh error, meal selection already done
      }

      await loadDashboard();
      setMealMessage({ type: "success", text: "Meal selected" });
    } catch (err) {
      setMealMessage({ type: "error", text: err?.response?.data || err.message });
    } finally {
      setMealLoading(false);
    }
  };

  const handleRemoveMeal = async (date, foodId, restaurantId) => {
    setMealLoading(true);
    try {
      await api.delete("/mealplan/select", { data: { date, foodId, restaurantId } });
      
      // Refresh meal plan from server
      const planRes = await api.get("/mealplan/current");
      setMealPlan(planRes.data);
      await loadDashboard();
      setMealMessage({ type: "success", text: "Meal removed" });
    } catch (err) {
      setMealMessage({ type: "error", text: err?.response?.data || err.message });
    } finally {
      setMealLoading(false);
    }
  };

  const handleRemoveFoodHistory = async (foodId, date) => {
    if (!window.confirm("Remove this item from food history?")) return;
    
    setMealLoading(true);
    try {
      const dateStr = typeof date === 'string' 
        ? date.split('T')[0] 
        : new Date(date).toISOString().split('T')[0];
      
      const { data } = await api.delete("/user/foodhistory", { data: { foodId, date: dateStr } });
      setProfile(data.user);
      await loadDashboard();
      setMealMessage({ type: "success", text: "Food history item removed" });
    } catch (err) {
      setMealMessage({ type: "error", text: err?.response?.data || err.message });
    } finally {
      setMealLoading(false);
    }
  };

  const handleRestaurantChange = async (restaurantId) => {
    setMealRestaurant(restaurantId);
    setSelectedFood(""); // Clear selected food when restaurant changes
    if (restaurantId) {
      try {
        const foodsRes = await api.get(`/food/restaurant/${restaurantId}`);
        setAvailableFoods(foodsRes.data.foods || []);
      } catch (err) {
        setAvailableFoods([]);
      }
    } else {
      setAvailableFoods([]);
    }
  };

  if (loading) return (
    <div className="page-container">
      <div className="profile-skeleton">
        <div className="skeleton-header"></div>
        <div className="skeleton-tabs"></div>
        <div className="skeleton-content"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="page-container">
      <div className="error-card">
        <h2>Unable to Load Profile</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="primary-button">
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {form.profilePic ? (
            <img src={form.profilePic} alt="Profile" />
          ) : (
            <div className="avatar-placeholder">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="profile-info">
          <h1>{profile.restaurantName || profile.name}</h1>
          <p className="profile-role">{profile.role === "owner" ? "Restaurant Owner" : "Student"}</p>
          <p className="profile-email">{profile.email}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile Settings
        </button>
        {profile.role === "owner" && (
          <button
            className={`tab-button ${activeTab === "menu" ? "active" : ""}`}
            onClick={() => setActiveTab("menu")}
          >
            Menu Management ({foods.length})
          </button>
        )}
        {profile.role === "student" && (
          <>
            <button
              className={`tab-button ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              📊 Dashboard
            </button>
            <button
              className={`tab-button ${activeTab === "meals" ? "active" : ""}`}
              onClick={() => setActiveTab("meals")}
            >
              Meal Plans
            </button>
            <button
              className={`tab-button ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              Food History
            </button>
          </>
        )}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "profile" && (
          <div className="profile-settings">
            <div className="settings-card">
              <h3>Personal Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Profile Picture</label>
                  <div className="profile-pic-upload-section">
                    <div className="upload-options">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicUpload}
                        id="profilePicUpload"
                        style={{ display: "none" }}
                      />
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => document.getElementById("profilePicUpload").click()}
                      >
                        Upload Photo
                      </button>
                    </div>
                    
                    <div className="url-input-section">
                      <label>Or enter URL:</label>
                      <input
                        type="text"
                        value={form.profilePic && !profilePicPreview ? form.profilePic : ""}
                        onChange={(e) => {
                          setForm({ ...form, profilePic: e.target.value });
                          if (e.target.value) setProfilePicPreview(e.target.value);
                        }}
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                  </div>
                  {profilePicPreview && (
                    <div className="image-preview">
                      <img src={profilePicPreview} alt="Profile preview" />
                    </div>
                  )}
                </div>
              </div>

              {profile.role === "owner" && (
                <>
                  <h3>Restaurant Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Restaurant Name</label>
                      <input
                        value={form.restaurantName}
                        onChange={(e) => setForm({ ...form, restaurantName: e.target.value })}
                        placeholder="Enter restaurant name"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Restaurant Description</label>
                      <textarea
                        value={form.restaurantInfo}
                        onChange={(e) => setForm({ ...form, restaurantInfo: e.target.value })}
                        placeholder="Describe your restaurant..."
                        rows={4}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="form-actions">
                <button
                  className="primary-button"
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                {message && (
                  <p className={`message ${message.type}`}>{message.text}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "menu" && profile.role === "owner" && (
          <div className="menu-management">
            {/* Menu Statistics */}
            <div className="stats-grid">
              <div className="stat-card">
                <h4>Total Items</h4>
                <span className="stat-number">{foods.length}</span>
              </div>
              <div className="stat-card">
                <h4>Available</h4>
                <span className="stat-number">{foods.filter(f => f.status === 'available').length}</span>
              </div>
              <div className="stat-card">
                <h4>Unavailable</h4>
                <span className="stat-number">{foods.filter(f => f.status === 'unavailable').length}</span>
              </div>
              <div className="stat-card">
                <h4>Average Price</h4>
                <span className="stat-number">
                  {foods.length > 0 ? Math.round(foods.reduce((sum, f) => sum + f.price, 0) / foods.length) : 0} tk
                </span>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="menu-controls">
              <input
                type="text"
                placeholder="Search menu items..."
                value={foodSearch}
                onChange={(e) => setFoodSearch(e.target.value)}
                className="search-input"
              />
              <select
                value={foodFilter}
                onChange={(e) => setFoodFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Items</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
              <button
                className="primary-button"
                onClick={handleAddFoodClick}
              >
                + Add Food
              </button>
            </div>

            {foodMessage && (
              <div className={`message ${foodMessage.type}`}>
                {foodMessage.text}
              </div>
            )}

            {/* Menu Items Grid */}
            <div className="menu-grid">
              {filteredFoods.length > 0 ? (
                filteredFoods.map((food) => (
                  <div key={food._id} className="menu-item-card">
                    <div className="menu-item-header">
                      <h4>{food.name}</h4>
                      <span className={`status-badge ${food.status}`}>
                        {food.status}
                      </span>
                    </div>
                    <div className="menu-item-image">
                      <img
                        src={food.image || "https://images.pexels.com/photos/376464/food-plate-restaurant-table-376464.jpeg"}
                        alt={food.name}
                        loading="lazy"
                      />
                    </div>
                    <div className="menu-item-details">
                      <p className="category">{food.category}</p>
                      <p className="price">{food.price} tk</p>
                      <p className="description">{food.description || "No description"}</p>
                    </div>
                    <div className="menu-item-actions">
                      <button
                        className="action-button edit"
                        onClick={() => handleEditFood(food)}
                        disabled={foodSaving}
                      >
                        Edit
                      </button>
                      <button
                        className={`action-button ${food.status === 'available' ? 'unavailable' : 'available'}`}
                        onClick={() => handleToggleStatus(food)}
                        disabled={foodSaving}
                      >
                        {food.status === 'available' ? 'Hide' : 'Show'}
                      </button>
                      <button
                        className="action-button delete"
                        onClick={() => handleDeleteFood(food._id)}
                        disabled={foodSaving}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <h3>No menu items found</h3>
                  <p>{foodSearch || foodFilter !== 'all' ? 'Try adjusting your search or filter.' : 'Start by adding your first menu item!'}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "meals" && profile.role === "student" && (
          <div className="meal-plans">
            {mealMessage && (
              <div className={`message ${mealMessage.type}`}>
                {mealMessage.text}
              </div>
            )}

            {/* Enrolled Restaurants */}
            <div className="enrolled-restaurants">
              <h3>Your Meal Plans</h3>
              {profile.enrolledPackages?.length > 0 ? (
                <div className="restaurant-grid">
                  {profile.enrolledPackages.map((pkg) => (
                    <div key={pkg.restaurantId} className="restaurant-card">
                      <h4>{pkg.restaurantName}</h4>
                      <div className="restaurant-stats">
                        <span>Meals: {pkg.mealCount}</span>
                        <span>Pending: {pkg.totalAmount} tk</span>
                      </div>
                      <button
                        className="danger-button"
                        onClick={() => handleUnenroll(pkg.restaurantId)}
                        disabled={mealLoading}
                      >
                        Unenroll
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <h3>No meal plans yet</h3>
                  <p>Enroll in a restaurant to start planning your meals!</p>
                </div>
              )}

              {/* Enroll New Restaurant */}
              <div className="enroll-section">
                <h4>Enroll in New Restaurant</h4>
                <div className="enroll-form">
                  <select
                    value={selectedRestaurant}
                    onChange={(e) => setSelectedRestaurant(e.target.value)}
                  >
                    <option value="">Choose restaurant</option>
                    {restaurants
                      .filter(r => !profile.enrolledPackages?.some(p => p.restaurantId === r._id))
                      .map(r => (
                        <option key={r._id} value={r._id}>{r.restaurantName || r.name}</option>
                      ))}
                  </select>
                  <button
                    className="primary-button"
                    onClick={handleEnroll}
                    disabled={!selectedRestaurant || mealLoading}
                  >
                    {mealLoading ? "Enrolling..." : "Enroll"}
                  </button>
                </div>
              </div>
            </div>

            {/* Meal Selection */}
            {profile.enrolledPackages?.length > 0 && (
              <div className="meal-selection">
                <h3>Select Meals</h3>
                <div className="meal-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Restaurant</label>
                      <select
                        value={mealRestaurant}
                        onChange={(e) => handleRestaurantChange(e.target.value)}
                      >
                        <option value="">Select restaurant</option>
                        {profile.enrolledPackages.map(p => (
                          <option key={p.restaurantId} value={p.restaurantId}>{p.restaurantName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Food Item</label>
                      <select
                        value={selectedFood}
                        onChange={(e) => setSelectedFood(e.target.value)}
                        disabled={!mealRestaurant}
                      >
                        <option value="">Select food</option>
                        {availableFoods.map(f => (
                          <option key={f._id} value={f._id}>
                            {f.name} - {f.price} tk ({f.category})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Quantity</label>
                      <input
                        id="mealQuantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    className="primary-button"
                    onClick={() => handleSelectMeal(selectedDate, selectedFood, mealRestaurant)}
                    disabled={!selectedDate || !selectedFood || !mealRestaurant || mealLoading}
                  >
                    {mealLoading ? "Adding..." : "Add to Meal Plan"}
                  </button>
                </div>

                {/* Current Selections */}
                {mealPlan?.selections?.length > 0 && (
                  <div className="meal-selections">
                    <h4>Your Meal Selections</h4>
                    <div className="selections-list">
                      {mealPlan.selections
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .map(s => {
                          // Convert date to YYYY-MM-DD format for the delete handler
                          const dateStr = typeof s.date === 'string' 
                            ? s.date.split('T')[0] 
                            : new Date(s.date).toISOString().split('T')[0];
                          return (
                            <div key={`${s.date}-${s.food._id}`} className="meal-item">
                              <div className="meal-info">
                                <strong>{new Date(s.date).toLocaleDateString()}</strong>
                                <span>{s.food?.name} x{s.quantity}</span>
                                <span>{(s.food?.price || 0) * s.quantity} tk</span>
                                <small>{s.restaurant?.restaurantName}</small>
                              </div>
                              <button
                                className="remove-button"
                                onClick={() => handleRemoveMeal(dateStr, s.food._id, s.restaurant._id)}
                                disabled={mealLoading}
                              >
                                Remove
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && profile.role === "student" && (
          <div className="food-history">
            <h3>Your Food History</h3>
            {(() => {
              const historyItems = (profile.foodHistory || []).sort((a, b) => new Date(b.date) - new Date(a.date));

              if (!historyItems.length) {
                return (
                  <div className="empty-state">
                    <h3>No food history yet</h3>
                    <p>Your consumed meals will appear here!</p>
                  </div>
                );
              }

              return (
                <div className="history-list">
                  {historyItems.map((item, index) => (
                    <div key={`${item.foodId}-${index}`} className="history-item">
                      <div className="history-image">
                        <img
                          src={item.image || "https://images.pexels.com/photos/376464/food-plate-restaurant-table-376464.jpeg"}
                          alt={item.name}
                          loading="lazy"
                        />
                      </div>
                      <div className="history-details">
                        <h4>{item.name}</h4>
                        <p className="restaurant">{item.restaurantName}</p>
                        <p className="price">{item.price} tk</p>
                        <p className="date">{new Date(item.date).toLocaleDateString()}</p>
                        <p className="quantity">x{item.quantity || 1}</p>
                      </div>
                      <button
                        className="remove-button"
                        onClick={() => handleRemoveFoodHistory(item.foodId, item.date)}
                        disabled={mealLoading}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {activeTab === "dashboard" && profile.role === "student" && (
          <div className="student-dashboard">
            {mealMessage && (
              <div className={`message ${mealMessage.type}`}>
                {mealMessage.text}
              </div>
            )}

            {dashboardLoading ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <p>Loading dashboard...</p>
              </div>
            ) : dashboardError ? (
              <div className="error-card">
                <h3>Dashboard Error</h3>
                <p>{dashboardError}</p>
              </div>
            ) : dashboardData ? (
              <>
                {/* Overall Statistics */}
                <div className="dashboard-summary">
                  <div className="summary-card">
                    <h3>📊 Total Statistics</h3>
                    <div className="stat-row">
                      <div className="stat-item">
                        <span className="stat-label">Total Restaurants</span>
                        <span className="stat-value">{dashboardData.restaurantCount}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Total Meals</span>
                        <span className="stat-value">{dashboardData.totalMeals}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Total Spent</span>
                        <span className="stat-value">৳{dashboardData.totalSpent.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Restaurants Breakdown */}
                <div className="restaurants-breakdown">
                  <h3>🏪 Restaurant Details</h3>
                  {dashboardData.restaurants.length > 0 ? (
                    <div className="restaurants-list">
                      {dashboardData.restaurants.map((restaurant) => (
                        <div key={restaurant.restaurantId} className="restaurant-breakdown-card">
                          <div className="restaurant-header">
                            <div>
                              <h4>{restaurant.restaurantName}</h4>
                              <p className="restaurant-subtitle">
                                {restaurant.mealCount > 0
                                  ? `${restaurant.mealCount} meal${restaurant.mealCount !== 1 ? "s" : ""} selected`
                                  : "No meals selected yet"}
                              </p>
                            </div>
                            <span className="enrolled-badge">
                              Enrolled: {new Date(restaurant.enrolledAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="restaurant-breakdown-stats">
                            <div className="breakdown-stat">
                              <span className="stat-icon">🍽️</span>
                              <div>
                                <span className="stat-label">Meals Consumed</span>
                                <span className="stat-value">{restaurant.mealCount}</span>
                              </div>
                            </div>

                            <div className="breakdown-stat">
                              <span className="stat-icon">💸</span>
                              <div>
                                <span className="stat-label">Amount Spent</span>
                                <span className="stat-value">৳{restaurant.totalAmount.toFixed(2)}</span>
                              </div>
                            </div>

                            {restaurant.mealCount > 0 && (
                              <div className="breakdown-stat">
                                <span className="stat-icon">💰</span>
                                <div>
                                  <span className="stat-label">Avg per Meal</span>
                                  <span className="stat-value">৳{(restaurant.totalAmount / restaurant.mealCount).toFixed(2)}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          <p className="restaurant-note">
                            Track how many meals you added and the total cost for this restaurant. Unenrolling will remove any existing selections.
                          </p>

                          <div className="restaurant-actions">
                            <button
                              className="primary-button"
                              onClick={() => setActiveTab("meals")}
                            >
                              View Plans
                            </button>
                            <button
                              className="danger-button"
                              onClick={() => handleUnenroll(restaurant.restaurantId)}
                              disabled={mealLoading}
                            >
                              Unenroll
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p>No enrolled restaurants. Enroll in a restaurant to get started!</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="empty-state">
                <p>Unable to load dashboard data</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Logout Button */}
      {profile.role !== "student" && (
        <div className="logout-section">
          <button className="danger-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      {/* Edit/Add Food Modal */}
      {showFoodModal && (
        <div className="modal-overlay" onClick={() => setShowFoodModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingFood ? "Edit Menu Item" : "Add New Menu Item"}</h3>
              <button className="close-button" onClick={() => setShowFoodModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    value={foodForm.name}
                    onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                    placeholder="Food name"
                  />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    value={foodForm.price}
                    onChange={(e) => setFoodForm({ ...foodForm, price: e.target.value })}
                    placeholder="Price"
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={foodForm.category}
                    onChange={(e) => setFoodForm({ ...foodForm, category: e.target.value })}
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Lunch/Dinner">Lunch/Dinner</option>
                  </select>
                </div>
                {editingFood && (
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={foodForm.status}
                      onChange={(e) => setFoodForm({ ...foodForm, status: e.target.value })}
                    >
                      <option value="available">Available</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
                )}
                <div className="form-group full-width">
                  <label>Image URL</label>
                  <input
                    value={foodForm.image}
                    onChange={(e) => setFoodForm({ ...foodForm, image: e.target.value })}
                    placeholder="Image URL"
                  />
                  {foodForm.image && (
                    <div className="image-preview">
                      <img src={foodForm.image} alt="Food preview" />
                    </div>
                  )}
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    value={foodForm.description}
                    onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
                    placeholder="Food description"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="secondary-button" onClick={() => setShowFoodModal(false)}>
                Cancel
              </button>
              <button
                className="primary-button"
                onClick={handleSaveFood}
                disabled={foodSaving}
              >
                {foodSaving ? "Saving..." : (editingFood ? "Save Changes" : "Add Food")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
