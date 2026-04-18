import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddFood from "./pages/AddFood";
import Profile from "./pages/Profile";
import RestaurantProfile from "./pages/RestaurantProfile";

function App() {
  const [user, setUser] = useState(() => {
    const userJson = localStorage.getItem("foodPortalUser");
    return userJson ? JSON.parse(userJson) : null;
  });

  useEffect(() => {
    const handleStorage = () => {
      const userJson = localStorage.getItem("foodPortalUser");
      setUser(userJson ? JSON.parse(userJson) : null);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <BrowserRouter>
      <NavBar user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/:ownerId" element={<RestaurantProfile />} />
        <Route path="/profile" element={<Profile setUser={setUser} />} />
        <Route path="/add-food" element={<AddFood />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
