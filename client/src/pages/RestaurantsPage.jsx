import React, { useState, useEffect } from 'react';
import RestaurantCard from '../components/RestaurantCard';
import { apiFetch } from '../api';

const RestaurantsPage = () => {
  // Conceptual states required by Task 4
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Client-side search & filter states
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'OPEN' | 'RATED'

  useEffect(() => {
    setLoading(true);
    setError('');

    // Fetch restaurants from GET /api/v1/restaurants
    apiFetch('/restaurants')
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
  }, []); // Empty dependency array ensures API request runs only on mount

  // Client-side search and quick filter without extra API calls
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'OPEN') return restaurant.isOpen === true;
    if (filterType === 'RATED') return Number(restaurant.rating) >= 4.0;

    return true;
  });

  return (
    <div className="container restaurants-page">
      {/* Top Breadcrumb & Title */}
      <div className="page-header-zomato">
        <div className="title-area">
          <h2>Delivery Restaurants in Ahmedabad</h2>
          <p className="sub-counter">
            Showing {filteredRestaurants.length} of {restaurants.length} food places
          </p>
        </div>

        {/* Client-side search input */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-box"
              placeholder="Search by restaurant name or cuisine (e.g. Pizza, Indian, Burger)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="clear-btn" onClick={() => setSearch('')}>
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Zomato Quick Filter Chips */}
      <div className="filter-chips-bar">
        <button
          className={`filter-chip ${filterType === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilterType('ALL')}
        >
          All ({restaurants.length})
        </button>
        <button
          className={`filter-chip ${filterType === 'OPEN' ? 'active' : ''}`}
          onClick={() => setFilterType('OPEN')}
        >
          🟢 Open Now
        </button>
        <button
          className={`filter-chip ${filterType === 'RATED' ? 'active' : ''}`}
          onClick={() => setFilterType('RATED')}
        >
          ⭐ Rating 4.0+
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading">
          <div className="zomato-spinner"></div>
          <p>Loading restaurants...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="error">
          <p>{error}</p>
          <button
            className="button btn-primary btn-sm"
            onClick={() => window.location.reload()}
            style={{ marginTop: '0.8rem' }}
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* Restaurant List Display */}
      {!loading && !error && (
        <>
          {filteredRestaurants.length === 0 ? (
            <div className="no-results-zomato">
              <span className="empty-icon">🍽️</span>
              <h3>No matching restaurants found</h3>
              <p>Try searching for a different dish or clearing your search filters.</p>
              <button
                className="button btn-secondary btn-sm"
                onClick={() => {
                  setSearch('');
                  setFilterType('ALL');
                }}
              >
                Clear all filters
              </button>
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
