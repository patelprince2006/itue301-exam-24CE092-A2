import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api';

const STATUS_OPTIONS = [
  'pending',
  'preparing',
  'out-for-delivery',
  'delivered',
  'cancelled',
];

const AdminPanel = () => {
  const { adminUser, adminToken, isAdminAuthenticated, adminLogin, adminLogout, adminError } = useAuth();

  // Admin Login Form States
  const [adminIdInput, setAdminIdInput] = useState('admin');
  const [adminPasswordInput, setAdminPasswordInput] = useState('admin123');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Admin Dashboard States
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalOrders: 0,
    orders: [],
    restaurants: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  // Fetch admin overview metrics and orders
  const fetchAdminData = async () => {
    if (!adminToken) return;

    setLoading(true);
    setError('');
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      const [orderData, resData] = await Promise.all([
        apiFetch('/orders/admin/all', { headers }).catch(() => ({ orders: [] })),
        apiFetch('/restaurants').catch(() => ({ restaurants: [] })),
      ]);

      const allOrders = orderData.orders || [];
      const allRestaurants = resData.restaurants || [];

      setStats({
        totalRestaurants: allRestaurants.length,
        totalOrders: allOrders.length,
        orders: allOrders,
        restaurants: allRestaurants,
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Failed to fetch platform metrics.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchAdminData();
    }
  }, [isAdminAuthenticated, adminToken]);

  // Handle Admin Login submission
  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    const result = await adminLogin(adminIdInput.trim(), adminPasswordInput.trim());
    setLoginLoading(false);

    if (!result.success) {
      setLoginError(result.message || 'Invalid Admin Credentials');
    }
  };

  // Handle Order Status Update (PATCH /api/v1/orders/:id/status)
  const handleStatusChange = async (orderId, newStatus) => {
    setActionMessage('');
    try {
      const data = await apiFetch(`/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!data.success) {
        throw new Error(data.message || 'Status update failed');
      }

      setActionMessage(`✅ Updated Order #${orderId.slice(-6)} status to "${newStatus}"`);
      fetchAdminData();
    } catch (err) {
      setActionMessage(`❌ Error: ${err.message}`);
    }
  };

  // ==========================================
  // VIEW 1: Admin Login Gate (Protected Portal)
  // ==========================================
  if (!isAdminAuthenticated) {
    return (
      <div className="container auth-card-section">
        <div className="auth-card admin-login-card">
          <div className="admin-lock-header">
            <span className="lock-icon">🔐</span>
            <h2>QuickBite Admin Portal</h2>
            <p className="auth-instruction">
              Restricted Area: Please authenticate with your administrator ID and password to access platform controls.
            </p>
          </div>

          <form onSubmit={handleAdminLoginSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="adminId">Admin ID / Email:</label>
              <input
                id="adminId"
                type="text"
                className="search-box"
                placeholder="e.g. admin or admin@quickbite.com"
                value={adminIdInput}
                onChange={(e) => setAdminIdInput(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="adminPassword">Admin Password:</label>
              <input
                id="adminPassword"
                type="password"
                className="search-box"
                placeholder="Enter admin password"
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="button btn-primary btn-block"
              disabled={loginLoading}
            >
              {loginLoading ? 'Authenticating...' : 'Access Admin Dashboard ➔'}
            </button>
          </form>

          {(loginError || adminError) && (
            <div className="error" style={{ marginTop: '1rem' }}>
              {loginError || adminError}
            </div>
          )}

          <div className="sample-hint" style={{ marginTop: '1.5rem', background: '#f8fafc', padding: '0.8rem', borderRadius: '6px' }}>
            🔒 <strong>Default Admin Credentials:</strong><br />
            ID: <code>admin</code> | Password: <code>admin123</code>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: Authorized Admin Console
  // ==========================================
  const totalRevenue = stats.orders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);

  return (
    <div className="container admin-panel">
      {/* Admin Header with Profile & Logout */}
      <div className="admin-header-banner">
        <div className="admin-title-row">
          <div>
            <h2>🛡️ QuickBite Platform Admin Console</h2>
            <p className="admin-subtext">
              Logged in as <strong>{adminUser?.name || 'Administrator'}</strong> ({adminUser?.email || 'admin@quickbite.com'})
            </p>
          </div>
          <button className="button btn-logout" onClick={adminLogout}>
            Exit Admin Session 🔒
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="status-box success-box" style={{ margin: '1rem 0' }}>
          <p>{actionMessage}</p>
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="zomato-spinner"></div>
          <p>Loading platform metrics...</p>
        </div>
      ) : error ? (
        <div className="error">
          <p>{error}</p>
          <button className="button btn-primary btn-sm" onClick={fetchAdminData}>
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Overview Metrics Cards */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">🏪</div>
              <div className="metric-info">
                <h3>Total Restaurants</h3>
                <p className="metric-value">{stats.totalRestaurants}</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">📦</div>
              <div className="metric-info">
                <h3>Total Orders</h3>
                <p className="metric-value">{stats.totalOrders}</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">💰</div>
              <div className="metric-info">
                <h3>Platform Revenue</h3>
                <p className="metric-value">₹{totalRevenue}</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">⚡</div>
              <div className="metric-info">
                <h3>System Health</h3>
                <p className="metric-value" style={{ fontSize: '1.3rem', color: 'var(--zomato-green)' }}>
                  Active & Online
                </p>
              </div>
            </div>
          </div>

          {/* Orders Management Table */}
          <div className="admin-orders-section">
            <div className="table-header-flex">
              <div>
                <h3>Customer Orders & Live Status Controller</h3>
                <p className="section-note">
                  Manage incoming food orders and dispatch status updates via <code>PATCH /api/v1/orders/:id/status</code>
                </p>
              </div>
              <button className="button btn-secondary btn-sm" onClick={fetchAdminData}>
                🔄 Refresh Orders
              </button>
            </div>

            {stats.orders.length === 0 ? (
              <p className="no-orders">No orders recorded on the platform yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Restaurant</th>
                      <th>Items Ordered</th>
                      <th>Total</th>
                      <th>Current Status</th>
                      <th>Update Live Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.orders.map((ord) => (
                      <tr key={ord._id}>
                        <td><code>#{ord._id.slice(-6).toUpperCase()}</code></td>
                        <td>
                          <strong>{ord.customerId?.name || 'Customer'}</strong>
                          <br />
                          <small style={{ color: '#888' }}>{ord.customerId?.email || ''}</small>
                        </td>
                        <td>{ord.restaurantId?.name || 'Restaurant'}</td>
                        <td>
                          {ord.items
                            ?.map((it) => `${it.name} (${it.quantity}x)`)
                            .join(', ')}
                        </td>
                        <td><strong>₹{ord.totalAmount}</strong></td>
                        <td>
                          <span className={`status-badge status-${ord.status}`}>
                            {ord.status}
                          </span>
                        </td>
                        <td>
                          <select
                            className="status-select"
                            value={ord.status}
                            onChange={(e) =>
                              handleStatusChange(ord._id, e.target.value)
                            }
                          >
                            {STATUS_OPTIONS.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
