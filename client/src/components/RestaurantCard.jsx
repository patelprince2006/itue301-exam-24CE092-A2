import React from 'react';
import { useNavigate } from 'react-router-dom';

// Cuisine image map for realistic Zomato-like restaurant cards
const CUISINE_IMAGES = {
  Italian: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60',
  'American Fast Food': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60',
  'North Indian': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&auto=format&fit=crop&q=60',
  'Chinese & Asian': 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=500&auto=format&fit=crop&q=60',
  'South Indian': 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500&auto=format&fit=crop&q=60',
  Mexican: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&auto=format&fit=crop&q=60',
  Default: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60',
};

const RestaurantCard = ({ name, cuisine, rating, isOpen }) => {
  const navigate = useNavigate();
  const bgImage = CUISINE_IMAGES[cuisine] || CUISINE_IMAGES.Default;

  return (
    <div className="restaurant-card" onClick={() => navigate('/order')}>
      <div className="card-image-wrapper">
        <img src={bgImage} alt={name} className="card-banner-img" />
        <span className={`status-badge ${isOpen ? 'open' : 'closed'}`}>
          {isOpen ? 'Open Now' : 'Closed'}
        </span>
        <span className="delivery-time-chip">30-40 min • Free Delivery</span>
      </div>

      <div className="card-content">
        <div className="card-header-row">
          <h3 className="restaurant-name">{name}</h3>
          <div className="rating-badge-green">
            <span>{rating}</span>
            <span className="star-icon">★</span>
          </div>
        </div>

        <div className="card-sub-row">
          <p className="cuisine-tag">{cuisine}</p>
          <p className="price-tag">₹250 for one</p>
        </div>

        <div className="card-footer-action">
          <button
            className={`button ${isOpen ? 'btn-order-card' : 'btn-disabled-card'}`}
            disabled={!isOpen}
            onClick={(e) => {
              e.stopPropagation();
              navigate('/order');
            }}
          >
            {isOpen ? 'Order Online ➔' : 'Currently Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
