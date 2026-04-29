import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <header>
      <nav className="navbar">

        {/* ✅ CLICKABLE LOGO (NO UNDERLINE) */}
        <Link to="/" className="logo">
          <span className="blue">Skill</span>
          <span className="black">Bridge</span>
        </Link>

        {/* NAV LINKS */}
        <ul className="nav-links">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/explore" className="nav-link">Explore</Link></li>
          <li><Link to="/resources" className="nav-link">Resources</Link></li>

          {isLoggedIn ? (
            <>
              <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
              <li>
                <button onClick={handleLogout} className="logout-link">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="login-btn">Log In</Link></li>
              <li><Link to="/signup" className="signup-btn">Sign Up</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;