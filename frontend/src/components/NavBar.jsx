import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function NavBar({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("foodPortalUser");
    localStorage.removeItem("foodPortalToken");
    navigate("/");
    window.location.reload(); // Force re-render to update user state
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo"></span>
        <Link to="/">DIU Smart Food</Link>
      </div>

      <button className="hamburger" onClick={toggleMobileMenu} aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`navbar-links ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        {!user && <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>Login</Link>}
        {!user && <Link to="/register" className={location.pathname === "/register" ? "active" : ""}>Register</Link>}
      </nav>

      {user && (
        <div className="navbar-actions">
          <Link to="/profile">
            {user.profilePic ? (
              <img 
                src={user.profilePic} 
                alt="Profile" 
                className="navbar-profile-pic"
              />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="navbar-profile-icon">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </Link>
          <button className="logout-icon" onClick={handleLogout} aria-label="Logout">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </header>
  );
}

export default NavBar;
