import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FOOD_CATEGORIES = [
  { name: 'Pizza', icon: '🍕', tag: 'Italian' },
  { name: 'Burgers', icon: '🍔', tag: 'Fast Food' },
  { name: 'North Indian', icon: '🍛', tag: 'North Indian' },
  { name: 'South Indian', icon: '🥞', tag: 'South Indian' },
  { name: 'Chinese', icon: '🍜', tag: 'Chinese' },
  { name: 'Biryani', icon: '🥘', tag: 'Biryani' },
];

const HomePage = () => {
  const { customer, isAuthenticated, login, logout, authError } = useAuth();
  const [emailInput, setEmailInput] = useState('customer@example.com');
  const [loginLoading, setLoginLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setLoginLoading(true);
    setStatusMsg('');
    const result = await login(emailInput.trim());
    setLoginLoading(false);

    if (result.success) {
      setStatusMsg('Logged in successfully! Welcome back.');
    } else {
      setStatusMsg(result.message || 'Login failed. Please check your email or register.');
    }
  };

  return (
    <div className="home-page-wrapper">
      {/* Zomato-style Hero Header Section */}
      <section className="zomato-hero">
        <div className="hero-overlay"></div>
        <div className="hero-inner container">
          <h1 className="zomato-logo-hero">
            Quick<em>Bite</em>
          </h1>
          <p className="hero-subheading">
            Discover the best food & drinks in your city
          </p>

          <div className="hero-search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search for restaurant, cuisine, or a dish..."
              onClick={() => navigate('/restaurants')}
              readOnly
            />
            <button
              className="button btn-search-hero"
              onClick={() => navigate('/restaurants')}
            >
              Search
            </button>
          </div>

          <div className="hero-quick-actions">
            <Link to="/restaurants" className="button btn-hero-explore">
              Browse Restaurants
            </Link>
            <Link to="/order" className="button btn-hero-order">
              Order Now
            </Link>
          </div>
        </div>
      </section>

      <div className="container main-body-container">
        {/* Popular Food Categories */}
        <section className="categories-section">
          <h2 className="section-title">Inspiration for your first order</h2>
          <div className="categories-grid">
            {FOOD_CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className="category-circle-card"
                onClick={() => navigate('/restaurants')}
              >
                <div className="cat-icon-circle">{cat.icon}</div>
                <span className="cat-name">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Cards / What We Offer */}
        <section className="features-banner-grid">
          <div className="feature-banner-card card-delivery" onClick={() => navigate('/restaurants')}>
            <div className="feature-card-content">
              <h3>Order Online</h3>
              <p>Stay home and order to your doorstep with live tracking</p>
              <span className="card-arrow-btn">Explore menu ➔</span>
            </div>
            <div className="feature-card-icon">🛵</div>
          </div>

          <div className="feature-banner-card card-dining" onClick={() => navigate('/restaurants')}>
            <div className="feature-card-content">
              <h3>Top Rated Places</h3>
              <p>Discover city's highest-rated dining & takeaways</p>
              <span className="card-arrow-btn">View top rated ➔</span>
            </div>
            <div className="feature-card-icon">⭐</div>
          </div>
        </section>

        {/* Authentication Card (Login / Register / Profile) */}
        <section className="auth-card-section">
          <div className="auth-card">
            {isAuthenticated && customer ? (
              <div className="auth-logged-in">
                <div className="profile-badge-header">
                  <div className="big-avatar">{customer.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <h3>Logged in as {customer.name}</h3>
                    <p className="subtext">{customer.email}</p>
                  </div>
                </div>

                <div className="customer-info-box">
                  <p><strong>📞 Phone:</strong> {customer.phone || '9876543210'}</p>
                  <p><strong>📍 Delivery Address:</strong> {customer.address || 'Ahmedabad, Gujarat'}</p>
                </div>

                <div className="auth-actions">
                  <button
                    className="button btn-primary btn-block"
                    onClick={() => navigate('/order')}
                  >
                    Proceed to Order Food ➔
                  </button>
                  <button className="button btn-logout btn-block" onClick={logout}>
                    Log Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="auth-logged-out">
                <h2>Welcome to QuickBite</h2>
                <p className="auth-instruction">
                  Login with your email or register a new customer account to place orders.
                </p>

                <form onSubmit={handleLoginSubmit} className="login-form">
                  <div className="form-group">
                    <label htmlFor="loginEmail">Customer Email Address:</label>
                    <input
                      id="loginEmail"
                      type="email"
                      className="search-box"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="e.g. customer@example.com"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="button btn-primary btn-block"
                    disabled={loginLoading}
                  >
                    {loginLoading ? 'Signing In...' : 'Sign In with One-Click'}
                  </button>
                </form>

                {statusMsg && (
                  <p className={`status-text ${statusMsg.includes('success') ? 'text-success' : 'error'}`}>
                    {statusMsg}
                  </p>
                )}
                {authError && <p className="error">{authError}</p>}

                <div className="auth-footer-links">
                  <span>Don't have an account?</span>
                  <Link to="/register" className="auth-link-bold">
                    Create New Account
                  </Link>
                </div>

                <div className="sample-hint">
                  💡 <em>Exam Pre-seeded Account: <code>customer@example.com</code></em>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
