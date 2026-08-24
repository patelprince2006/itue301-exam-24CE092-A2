import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const OrderPage = () => {
  const { customer, token } = useAuth();

  // Meaningful state variables for form input
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState(customer?.address || '');

  // Supplementary states for restaurants dropdown, status messages, and customer order history
  const [availableRestaurants, setAvailableRestaurants] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [orderMessage, setOrderMessage] = useState({ text: '', type: '' });
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Fetch available restaurants for the dropdown
  useEffect(() => {
    fetch('/api/v1/restaurants')
      .then((res) => res.json())
      .then((data) => {
        if (data.restaurants) {
          setAvailableRestaurants(data.restaurants);
          if (data.restaurants.length > 0 && !selectedRestaurant) {
            setSelectedRestaurant(data.restaurants[0]._id);
          }
        }
      })
      .catch((err) => console.error('Failed to load restaurants list:', err));
  }, []);

  // Fetch customer's previous orders using Bearer token
  const fetchCustomerOrders = () => {
    if (!token) return;
    setLoadingOrders(true);
    fetch('/api/v1/orders', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) {
          setCustomerOrders(data.orders);
        }
        setLoadingOrders(false);
      })
      .catch((err) => {
        console.error('Error fetching customer orders:', err);
        setLoadingOrders(false);
      });
  };

  useEffect(() => {
    fetchCustomerOrders();
  }, [token]);

  // Handle Order Placement
  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRestaurant) {
      setOrderMessage({ text: 'Please select a restaurant', type: 'error' });
      return;
    }
    if (!itemName.trim()) {
      setOrderMessage({ text: 'Please enter an item name', type: 'error' });
      return;
    }
    if (quantity < 1) {
      setOrderMessage({ text: 'Quantity must be at least 1', type: 'error' });
      return;
    }
    if (!address.trim()) {
      setOrderMessage({ text: 'Please enter a delivery address', type: 'error' });
      return;
    }

    setSubmitting(true);
    setOrderMessage({ text: '', type: '' });

    // Approximate unit price for demo
    const estimatedPricePerItem = 150;
    const totalAmount = estimatedPricePerItem * Number(quantity);

    const orderPayload = {
      restaurantId: selectedRestaurant,
      items: [
        {
          name: itemName.trim(),
          quantity: Number(quantity),
          price: estimatedPricePerItem,
        },
      ],
      totalAmount,
      deliveryAddress: address.trim(),
    };

    try {
      const res = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to place order');
      }

      setOrderMessage({
        text: `Order placed successfully! Order ID: ${data.order._id}`,
        type: 'success',
      });

      // Reset item details
      setItemName('');
      setQuantity(1);

      // Refresh order history
      fetchCustomerOrders();
    } catch (error) {
      setOrderMessage({
        text: error.message || 'An error occurred while placing your order',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Find selected restaurant name for dynamic display
  const currentRestaurantObj = availableRestaurants.find(
    (r) => r._id === selectedRestaurant
  );
  const selectedRestaurantName = currentRestaurantObj
    ? currentRestaurantObj.name
    : 'None Selected';

  return (
    <div className="container order-page">
      <div className="page-header">
        <h2>Place an Order</h2>
        <p>Order delicious dishes from your favourite restaurants</p>
      </div>

      <div className="order-layout">
        {/* Order Form Section */}
        <div className="order-form-container">
          <form className="order-form" onSubmit={handleOrderSubmit}>
            <h3>Order Details</h3>

            {/* 1. Selected Restaurant */}
            <div className="form-group">
              <label htmlFor="restaurantSelect">Select Restaurant:</label>
              <select
                id="restaurantSelect"
                value={selectedRestaurant}
                onChange={(e) => setSelectedRestaurant(e.target.value)}
                required
              >
                <option value="">-- Choose a Restaurant --</option>
                {availableRestaurants.map((res) => (
                  <option key={res._id} value={res._id}>
                    {res.name} ({res.cuisine}) {res.isOpen ? '🟢 Open' : '🔴 Closed'}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Item Name */}
            <div className="form-group">
              <label htmlFor="itemName">Item Name:</label>
              <input
                id="itemName"
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Margherita Pizza, Burger, Dosa"
                required
              />
            </div>

            {/* 3. Quantity */}
            <div className="form-group">
              <label htmlFor="quantity">Quantity:</label>
              <input
                id="quantity"
                type="number"
                min="1"
                max="50"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
              />
            </div>

            {/* 4. Delivery Address */}
            <div className="form-group">
              <label htmlFor="address">Delivery Address:</label>
              <textarea
                id="address"
                rows="3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter complete delivery address"
                required
              />
            </div>

            <button
              type="submit"
              className="button btn-primary btn-block"
              disabled={submitting}
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>

          {/* Dynamic State Preview */}
          <div className="order-summary-box">
            <h4>Live Order Summary (Real-time State)</h4>
            <div className="summary-details">
              <p>
                <strong>Selected Restaurant:</strong> {selectedRestaurantName}
              </p>
              <p>
                <strong>Item:</strong> {itemName || '<em>Not entered yet</em>'}
              </p>
              <p>
                <strong>Quantity:</strong> {quantity}
              </p>
              <p>
                <strong>Delivery Address:</strong> {address || '<em>Not entered yet</em>'}
              </p>
            </div>
          </div>

          {/* Status Message */}
          {orderMessage.text && (
            <div
              className={
                orderMessage.type === 'success'
                  ? 'status-box success-box'
                  : 'status-box error'
              }
            >
              <p>{orderMessage.text}</p>
            </div>
          )}
        </div>

        {/* Customer's Order History */}
        <div className="order-history-section">
          <h3>Your Past Orders ({customer?.name})</h3>
          {loadingOrders ? (
            <p className="loading">Loading your orders...</p>
          ) : customerOrders.length === 0 ? (
            <p className="no-orders">No orders placed yet.</p>
          ) : (
            <div className="orders-list">
              {customerOrders.map((ord) => (
                <div key={ord._id} className="order-item-card">
                  <div className="order-item-header">
                    <strong>{ord.restaurantId?.name || 'Restaurant'}</strong>
                    <span className={`status-badge status-${ord.status}`}>
                      {ord.status}
                    </span>
                  </div>
                  <div className="order-item-body">
                    <p>
                      <strong>Items:</strong>{' '}
                      {ord.items
                        ?.map((it) => `${it.name} x${it.quantity}`)
                        .join(', ')}
                    </p>
                    <p>
                      <strong>Total:</strong> ₹{ord.totalAmount}
                    </p>
                    <p className="order-date">
                      <small>
                        Placed on: {new Date(ord.createdAt).toLocaleString()}
                      </small>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
