import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
      setStatusMsg('Logged in successfully!');
    } else {
      setStatusMsg(result.message || 'Login failed');
    }
  };

  return (
    <div className="container home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">QuickBite</h1>
        <p className="hero-tagline">Fast. Fresh. Delivered.</p>
        <p className="hero-description">
          Delicious food from the best local restaurants, delivered right to your doorstep in minutes.
        </p>

        <div className="hero-actions">
          <Link to="/restaurants" className="button btn-primary">
            Browse Restaurants
          </Link>
          <Link to="/order" className="button btn-secondary">
            Order Now
          </Link>
        </div>
      </section>

      {/* Highlights / Features Section */}
      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">🏪</div>
          <h3>Browse restaurants</h3>
          <p>Explore a wide variety of top-rated local restaurants and diverse cuisines.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🍕</div>
          <h3>Order your favourite food</h3>
          <p>Select your favorite dishes and place orders with just a few clicks.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🚀</div>
          <h3>Track your orders</h3>
          <p>Real-time order tracking and status updates from kitchen to doorstep.</p>
        </div>
      </section>

      {/* Authentication / Quick Login Card */}
      <section className="auth-card-section">
        <div className="auth-card">
          <h2>Authentication State</h2>
          {isAuthenticated && customer ? (
            <div className="auth-logged-in">
              <p className="auth-welcome">
                Welcome back, <strong>{customer.name}</strong>!
              </p>
              <div className="customer-info-box">
                <p><strong>Email:</strong> {customer.email}</p>
                <p><strong>Phone:</strong> {customer.phone || 'N/A'}</p>
                <p><strong>Address:</strong> {customer.address || 'N/A'}</p>
              </div>
              <div className="auth-actions">
                <button
                  className="button btn-primary"
                  onClick={() => navigate('/order')}
                >
                  Proceed to Order Page
                </button>
                <button className="button btn-logout" onClick={logout}>
                  Log Out
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-logged-out">
              <p className="auth-instruction">
                Please login with your customer email to access the protected Order page.
              </p>
              <form onSubmit={handleLoginSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="loginEmail">Customer Email:</label>
                  <input
                    id="loginEmail"
                    type="email"
                    className="search-box"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter email e.g. customer@example.com"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="button btn-primary"
                  disabled={loginLoading}
                >
                  {loginLoading ? 'Logging in...' : 'Login with Bearer Token'}
                </button>
              </form>

              {statusMsg && (
                <p className={`status-text ${statusMsg.includes('success') ? 'text-success' : 'error'}`}>
                  {statusMsg}
                </p>
              )}
              {authError && <p className="error">{authError}</p>}

              <p className="sample-hint">
                💡 <em>Default seed account: <code>customer@example.com</code></em>
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
