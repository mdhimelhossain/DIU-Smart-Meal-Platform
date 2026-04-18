import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

function Home() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    api
      .get("/food")
      .then(res => setFoods(res.data))
      .catch(err => setError(err?.response?.data || err.message || "Failed to load food"))
      .finally(() => setLoading(false));
  }, []);

  const filteredFoods = useMemo(() => {
    return foods.filter(food => {
      const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           food.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || food.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [foods, searchTerm, selectedCategory]);

  const categories = useMemo(() => {
    const cats = [...new Set(foods.map(food => food.category).filter(Boolean))];
    return cats;
  }, [foods]);

  const restaurantGroups = useMemo(() => {
    return Object.values(
      filteredFoods.reduce((groups, item) => {
        const restaurantName = item.owner?.restaurantName || item.owner?.name || "Unknown Restaurant";
        const ownerId = item.owner?._id || "unknown";
        const key = `${ownerId}-${restaurantName}`;

        if (!groups[key]) {
          groups[key] = {
            owner: item.owner,
            restaurantName,
            items: []
          };
        }

        groups[key].items.push(item);
        return groups;
      }, {})
    );
  }, [filteredFoods]);

  return (
    <div className="page-container">
      <section className="dashboard-header">
        <h1>Campus Food Menu</h1>
        <p className="subtitle">Find fresh restaurant menus with a clean restaurant-by-restaurant layout.</p>
      </section>

      <div className="filters">
        <input
          type="text"
          placeholder="Search foods..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="skeleton-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-image"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text short"></div>
            </div>
          ))}
        </div>
      )}
      {error && <div className="error">{error}</div>}
      {!loading && !error && restaurantGroups.length === 0 && (
        <div className="empty-state">
          <h2>No food items found</h2>
          <p>Try adjusting your search or category filter.</p>
        </div>
      )}

      {restaurantGroups.map((group, groupIndex) => (
        <section className="restaurant-card" key={`${group.owner?._id || group.restaurantName}-${groupIndex}`}>
          <div className="restaurant-card-header">
            <div>
              <div className="restaurant-label">Restaurant {groupIndex + 1}</div>
              <h2>{group.restaurantName}</h2>
              <p className="restaurant-subtitle">Owner: {group.owner?.name || "Unknown"} • {group.items.length} menu {group.items.length === 1 ? "item" : "items"}</p>
            </div>
            {group.owner?._id && (
              <Link className="small-link" to={`/restaurant/${group.owner._id}`}>
                View full restaurant profile
              </Link>
            )}
          </div>

          <div className="restaurant-menu-grid">
            {group.items.map((food, itemIndex) => (
              <article className="menu-item-card" key={food._id}>
                <div className="menu-item-number">{itemIndex + 1}</div>
                <div className="menu-item-media">
                  <img
                    src={food.image || "https://images.pexels.com/photos/376464/food-plate-restaurant-table-376464.jpeg"}
                    alt={food.name}
                    loading="lazy"
                  />
                </div>
                <div className="menu-item-content">
                  <h3>{food.name}</h3>
                  <p>{food.description || "Delicious food from this restaurant."}</p>
                  <div className="food-meta">
                    <span className="category-tag">{food.category || "Menu"}</span>
                    <span className={`status-tag ${food.status === 'available' ? 'available' : 'unavailable'}`}>{food.status}</span>
                  </div>
                  <div className="food-meta">
                    <span className="price-tag">Price: {food.price} tk</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default Home;
