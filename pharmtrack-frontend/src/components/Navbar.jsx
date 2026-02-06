import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("pharmtrack_token");
  const user = JSON.parse(localStorage.getItem("pharmtrack_user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("pharmtrack_token");
    localStorage.removeItem("pharmtrack_user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          ⚕️ PharmTrack AI
        </Link>
      </div>

      <div className="nav-right">
        {!token ? (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Sign Up</Link>
          </>
        ) : (
          <>
             <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/symptom-checker">Symptoms</Link></li>
            <li><Link to="/emergency">Emergency Help</Link></li>
            <li><Link to="/medicine-tracker">Tracker</Link></li>
            <li><Link to="/aidoc">AI Doctor</Link></li>
            <li><Link to="/health">Health</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <button onClick={handleLogout} className="logout-btn">
              Logout ({user.name || "User"})
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
