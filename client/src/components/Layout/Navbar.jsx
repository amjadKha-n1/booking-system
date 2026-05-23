import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="logo">
          <span className="logo-icon">◆</span>
          <div className="logo-text">
            <span className="logo-main">MAISON</span>
            <span className="logo-sub">LUXE</span>
          </div>
        </Link>

        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/book"
                className={`nav-link ${
                  location.pathname.startsWith("/book") ? "active" : ""
                }`}
              >
                Booking
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className={`nav-link admin-nav-link ${
                    location.pathname.startsWith("/admin") ? "active" : ""
                  }`}
                >
                  Dashboard
                </Link>
              )}

              <div className="user-section">
                <div className="user-avatar">{user?.name?.charAt(0)}</div>
                <span className="user-name">{user?.name}</span>
                {isAdmin && <span className="admin-badge">Admin</span>}
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="logout-btn"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="nav-btn">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
