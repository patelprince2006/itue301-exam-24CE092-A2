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
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🍔</span>
          <span className="brand-name">QuickBite</span>
        </Link>

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
            Order
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Admin
          </NavLink>
        </div>

        <div className="navbar-auth">
          {isAuthenticated && customer ? (
            <div className="user-section">
              <span className="user-greeting">
                👤 <strong>{customer.name}</strong>
              </span>
              <button className="button btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="guest-section">
              <Link to="/" className="button btn-login-link">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
