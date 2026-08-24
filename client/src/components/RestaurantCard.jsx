import React from 'react';

const RestaurantCard = ({ name, cuisine, rating, isOpen }) => {
  return (
    <div className="restaurant-card">
      <div className="restaurant-card-header">
        <h3 className="restaurant-name">{name}</h3>
        <span className={`status-badge ${isOpen ? 'open' : 'closed'}`}>
          {isOpen ? 'Open Now' : 'Closed'}
        </span>
      </div>
      <div className="restaurant-details">
        <p className="cuisine">
          <strong>Cuisine:</strong> {cuisine}
        </p>
        <p className="rating">
          <strong>Rating:</strong> ⭐ {rating} / 5
        </p>
      </div>
    </div>
  );
};

export default RestaurantCard;
