import React, { useState, useEffect } from 'react';
import RestaurantCard from '../components/RestaurantCard';

const RestaurantsPage = () => {
  // Conceptual states required by Task 4
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Client-side search state
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    fetch('/api/v1/restaurants')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Server response not OK');
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.restaurants) {
          setRestaurants(data.restaurants);
        } else if (Array.isArray(data)) {
          setRestaurants(data);
        } else {
          setRestaurants([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch restaurants error:', err);
        setError('Failed to load restaurants.');
        setLoading(false);
      });
  }, []); // Empty dependency array ensures fetch runs only once on mount

  // Client-side search filter without triggering new API calls
  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container restaurants-page">
      <div className="page-header">
        <h2>Available Restaurants</h2>
        <p>Discover top-rated cuisines and order your favorite dishes</p>
      </div>

      {/* Client-side search box */}
      <div className="search-container">
        <input
          type="text"
          className="search-box"
          placeholder="Search restaurants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading">
          <p>Loading restaurants...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}

      {/* Restaurant List Display */}
      {!loading && !error && (
        <>
          {filteredRestaurants.length === 0 ? (
            <div className="no-results">
              <p>No restaurants found matching "{search}".</p>
            </div>
          ) : (
            <div className="restaurant-grid">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant._id || restaurant.name}
                  name={restaurant.name}
                  cuisine={restaurant.cuisine}
                  rating={restaurant.rating}
                  isOpen={restaurant.isOpen}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RestaurantsPage;
