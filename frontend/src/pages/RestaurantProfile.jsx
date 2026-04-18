import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../utils/api";

function RestaurantProfile() {
  const { ownerId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "RO";

  useEffect(() => {
    api
      .get(`/food/restaurant/${ownerId}`)
      .then((res) => setData(res.data))
      .catch((err) => setError(err?.response?.data || err.message || "Unable to load restaurant"))
      .finally(() => setLoading(false));
  }, [ownerId]);

  if (loading) return <div className="page-container">Loading restaurant...</div>;
  if (error) return <div className="page-container error">{error}</div>

  const owner = data?.owner || {};
  const ownerName = owner.name || "Restaurant Owner";
  const restaurantTitle = owner.restaurantName || ownerName;
  const profileIntro = owner.restaurantInfo || "Restaurant page with current food menu and monthly meal plan.";
  const ownerInitials = getInitials(ownerName);

  return (
    <div className="page-container">
      <div className="page-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {owner.profilePic ? (
              <img src={owner.profilePic} alt={`${ownerName} profile`} />
            ) : (
              <div className="avatar-placeholder">{ownerInitials}</div>
            )}
          </div>

          <div className="profile-info">
            <h1>{restaurantTitle}</h1>
            <p className="restaurant-subtitle">{profileIntro}</p>
            {owner.email && <p className="profile-contact">Contact: {owner.email}</p>}
          </div>
        </div>

        <div className="profile-card restaurant-details">
          <div className="profile-row">
            <strong>Owner</strong>
            <span>{ownerName}</span>
          </div>
          <div className="profile-row">
            <strong>Email</strong>
            <span>{owner.email || "Not available"}</span>
          </div>
          <div className="profile-row">
            <strong>Restaurant</strong>
            <span>{restaurantTitle}</span>
          </div>
        </div>

      </div>

      <div className="section-header">
        <h2>Current Menu</h2>
        <p>Browse this restaurant’s menu in clean, responsive food cards.</p>
      </div>
      <div className="food-grid">
        {(data.foods || []).map((item) => (
          <article className="food-card" key={item._id}>
            <img
              src={item.image || "https://images.pexels.com/photos/376464/food-plate-restaurant-table-376464.jpeg"}
              alt={item.name}
            />
            <div className="food-card-body">
              <h3>{item.name}</h3>
              <p>{item.description || "Fresh and tasty meal prepared by the restaurant."}</p>
              <div className="food-meta">
                <span className="category-tag">{item.category || "Menu"}</span>
                <span className={`status-tag ${item.status === "available" ? "available" : "unavailable"}`}>
                  {item.status || "Unknown"}
                </span>
              </div>
              <div className="food-meta">
                <span className="price-tag">Price: {item.price} tk</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="back-link">
        Back to <Link to="/">Public Dashboard</Link>
      </p>
    </div>
  );
}

export default RestaurantProfile;
