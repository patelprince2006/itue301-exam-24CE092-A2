import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (formData.name.trim().length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Valid email is required.');
      return;
    }
    if (formData.phone.trim().length < 10) {
      setError('Phone number must be at least 10 digits.');
      return;
    }
    if (formData.address.trim().length < 5) {
      setError('Delivery address must be at least 5 characters.');
      return;
    }

    setLoading(true);
    const result = await register({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
    });
    setLoading(false);

    if (result.success) {
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/order');
      }, 1000);
    } else {
      setError(result.message || 'Failed to register.');
    }
  };

  if (isAuthenticated) {
    return (
      <div className="container auth-card-section">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <h2>You are already registered & logged in!</h2>
          <p style={{ margin: '1rem 0' }}>Go ahead and browse restaurants or order food.</p>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            <Link to="/restaurants" className="button btn-primary">
              Browse Restaurants
            </Link>
            <Link to="/order" className="button btn-secondary">
              Place Order
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container auth-card-section">
      <div className="auth-card">
        <h2>Customer Registration</h2>
        <p className="auth-instruction">
          Create a new QuickBite customer account to order from your favourite restaurants.
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="regName">Full Name *</label>
            <input
              id="regName"
              name="name"
              type="text"
              className="search-box"
              placeholder="e.g. Prince Patel"
              value={formData.name}
              onChange={handleChange}
              required
              minLength={2}
            />
          </div>

          <div className="form-group">
            <label htmlFor="regEmail">Email Address *</label>
            <input
              id="regEmail"
              name="email"
              type="email"
              className="search-box"
              placeholder="e.g. prince@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="regPhone">Phone Number *</label>
            <input
              id="regPhone"
              name="phone"
              type="tel"
              className="search-box"
              placeholder="e.g. 9876543210"
              value={formData.phone}
              onChange={handleChange}
              required
              minLength={10}
            />
          </div>

          <div className="form-group">
            <label htmlFor="regAddress">Default Delivery Address *</label>
            <textarea
              id="regAddress"
              name="address"
              rows="3"
              className="search-box"
              placeholder="e.g. 123 Green City, Ahmedabad"
              value={formData.address}
              onChange={handleChange}
              required
              minLength={5}
            />
          </div>

          <button
            type="submit"
            className="button btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register as Customer'}
          </button>
        </form>

        {error && <div className="error" style={{ marginTop: '1rem' }}>{error}</div>}
        {success && <div className="status-box success-box" style={{ marginTop: '1rem' }}>{success}</div>}

        <p className="sample-hint" style={{ marginTop: '1.2rem' }}>
          Already have an account? <Link to="/" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
