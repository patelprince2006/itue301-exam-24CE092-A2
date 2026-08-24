import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { customer, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Zomato-styled Brand Logo */}
        <Link to="/" className="navbar-brand">
          <span className="brand-logo-text">Quick<em>Bite</em></span>
        </Link>

        {/* Location pill */}
        <div className="location-pill">
          <span className="pin-icon">📍</span>
          <span className="location-text">Ahmedabad, India</span>
        </div>

        {/* Navigation Links using React Router Link without reload */}
        <div className="navbar-links">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/restaurants"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Restaurants
          </NavLink>
          <NavLink
            to="/order"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Order Food
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Admin Panel
          </NavLink>
        </div>

        {/* Auth Buttons / Active Profile */}
        <div className="navbar-auth">
          {isAuthenticated && customer ? (
            <div className="user-section">
              <div className="user-avatar-badge">
                <span className="avatar-circle">{customer.name.charAt(0).toUpperCase()}</span>
                <span className="user-name-label">{customer.name}</span>
              </div>
              <button className="button btn-logout" onClick={handleLogout} title="Log Out">
                Logout
              </button>
            </div>
          ) : (
            <div className="guest-section">
              <Link to="/" className="nav-auth-link">
                Log in
              </Link>
              <Link to="/register" className="button btn-primary btn-sm">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
