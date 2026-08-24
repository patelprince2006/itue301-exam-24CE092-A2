import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = [
  'pending',
  'preparing',
  'out-fordelivery',
  'delivered',
  'cancelled',
];

const AdminPanel = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalOrders: 0,
    orders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      // First try fetching admin-specific combined endpoint
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch('/api/v1/orders/admin/all', { headers });

      if (res.ok) {
        const data = await res.json();
        setStats({
          totalRestaurants: data.totalRestaurants || 0,
          totalOrders: data.totalOrders || 0,
          orders: data.orders || [],
        });
      } else {
        // Fallback: fetch restaurants & orders independently
        const [resResp, ordResp] = await Promise.all([
          fetch('/api/v1/restaurants'),
          fetch('/api/v1/orders', { headers }),
        ]);
        const resData = await resResp.json();
        const ordData = ordResp.ok ? await ordResp.json() : { orders: [] };

        setStats({
          totalRestaurants: resData.restaurants?.length || 0,
          totalOrders: ordData.orders?.length || 0,
          orders: ordData.orders || [],
        });
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Failed to fetch platform metrics.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [token]);

  // Handle Order Status Update using PATCH /api/v1/orders/:id/status
  const handleStatusChange = async (orderId, newStatus) => {
    setActionMessage('');
    try {
      const res = await fetch(`/api/v1/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Status update failed');
      }

      setActionMessage(`Updated Order #${orderId.slice(-6)} to "${newStatus}"`);
      // Refresh list
      fetchAdminData();
    } catch (err) {
      setActionMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="container admin-panel">
      <div className="page-header">
        <h2>QuickBite Admin Panel</h2>
        <p>Platform Overview & Restaurant/Order Management</p>
      </div>

      {actionMessage && (
        <div className="status-box success-box">
          <p>{actionMessage}</p>
        </div>
      )}

      {loading ? (
        <div className="loading">
          <p>Loading Admin Overview...</p>
        </div>
      ) : error ? (
        <div className="error">
          <p>{error}</p>
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
              <div className="metric-icon">⚡</div>
              <div className="metric-info">
                <h3>Platform Overview</h3>
                <p className="metric-value">Active & Healthy</p>
              </div>
            </div>
          </div>

          {/* Orders Management Table */}
          <div className="admin-orders-section">
            <h3>Recent Orders & Status Controller</h3>
            <p className="section-note">
              Use the dropdown below to update order status via <code>PATCH /api/v1/orders/:id/status</code>
            </p>

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
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Current Status</th>
                      <th>Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.orders.map((ord) => (
                      <tr key={ord._id}>
                        <td><code>{ord._id.slice(-6)}</code></td>
                        <td>{ord.customerId?.name || 'N/A'}</td>
                        <td>{ord.restaurantId?.name || 'N/A'}</td>
                        <td>
                          {ord.items
                            ?.map((it) => `${it.name} (${it.quantity})`)
                            .join(', ')}
                        </td>
                        <td>₹{ord.totalAmount}</td>
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
