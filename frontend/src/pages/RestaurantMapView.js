import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantService } from '../services/api';
import '../styles/RestaurantMapView.css';

export default function RestaurantMapView() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 12.9716, lng: 77.5946 }); // Bangalore
  const [searchRadius, setSearchRadius] = useState(5); // in km
  const [filterCuisine, setFilterCuisine] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [viewMode, setViewMode] = useState('map'); // map or list

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await restaurantService.getAll();
      const restaurantsWithCoords = (response.data || []).map((rest, idx) => ({
        ...rest,
        lat: 12.9716 + (Math.random() - 0.5) * 0.1,
        lng: 77.5946 + (Math.random() - 0.5) * 0.1,
        rating: (Math.random() * 2 + 3.5).toFixed(1),
        distance: (Math.random() * 8 + 0.5).toFixed(1)
      }));
      setRestaurants(restaurantsWithCoords);
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAllCuisines = () => {
    const cuisines = new Set();
    restaurants.forEach(rest => {
      if (rest.cuisine && Array.isArray(rest.cuisine)) {
        rest.cuisine.forEach(c => cuisines.add(c));
      }
    });
    return Array.from(cuisines);
  };

  const filteredRestaurants = restaurants.filter(rest => {
    if (filterCuisine !== 'all' && (!rest.cuisine || !rest.cuisine.includes(filterCuisine))) return false;
    if (filterRating !== 'all' && parseFloat(rest.rating || 0) < parseFloat(filterRating)) return false;
    return true;
  });

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newLat = mapCenter.lat + (0.5 - y / rect.height) * 0.1;
    const newLng = mapCenter.lng + (x / rect.width - 0.5) * 0.1;
    setMapCenter({ lat: newLat, lng: newLng });
  };

  if (loading) {
    return (
      <div className="map-container">
        <div className="loading-state">
          <p>Loading restaurants on map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-view-wrapper">
      {/* Header */}
      <div className="map-header">
        <h1>🗺️ Find Restaurants Near You</h1>
        <p>Browse and explore restaurants on the map</p>
      </div>

      {/* Controls */}
      <div className="map-controls">
        <div className="control-group">
          <label>Cuisine</label>
          <select value={filterCuisine} onChange={(e) => setFilterCuisine(e.target.value)} className="filter-select">
            <option value="all">All Cuisines</option>
            {getAllCuisines().map(cuisine => (
              <option key={cuisine} value={cuisine}>{cuisine}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Minimum Rating</label>
          <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)} className="filter-select">
            <option value="all">All Ratings</option>
            <option value="3">3.0+ ⭐</option>
            <option value="3.5">3.5+ ⭐</option>
            <option value="4">4.0+ ⭐</option>
            <option value="4.5">4.5+ ⭐</option>
          </select>
        </div>

        <div className="control-group">
          <label>Search Radius</label>
          <div className="radius-input">
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={searchRadius}
              onChange={(e) => setSearchRadius(e.target.value)}
              className="radius-slider"
            />
            <span className="radius-value">{searchRadius} km</span>
          </div>
        </div>

        <div className="view-toggle">
          <button 
            className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => setViewMode('map')}
          >
            🗺️ Map
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            📋 List
          </button>
        </div>
      </div>

      <div className="map-content">
        {viewMode === 'map' ? (
          <>
            {/* Map Area */}
            <div className="map-area-wrapper">
              <div className="map-container" onClick={handleMapClick}>
                {/* Simulated Map Background */}
                <div className="map-background">
                  <div className="map-grid"></div>
                  <div className="map-center-marker">📍</div>
                </div>

                {/* Restaurant Markers */}
                {filteredRestaurants.map(restaurant => {
                  const x = ((restaurant.lng - mapCenter.lng) / 0.1 + 0.5) * 100;
                  const y = ((mapCenter.lat - restaurant.lat) / 0.1 + 0.5) * 100;
                  const isSelected = selectedRestaurant?._id === restaurant._id;
                  
                  if (x < 5 || x > 95 || y < 5 || y > 95) return null;

                  return (
                    <div
                      key={restaurant._id}
                      className={`map-marker ${isSelected ? 'selected' : ''}`}
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                      }}
                      onClick={() => setSelectedRestaurant(restaurant)}
                    >
                      <span className="marker-icon">📍</span>
                    </div>
                  );
                })}
              </div>

              {/* Info Panel */}
              {selectedRestaurant && (
                <div className="map-info-panel">
                  <button className="close-panel" onClick={() => setSelectedRestaurant(null)}>×</button>
                  <div className="info-header">
                    <h2>{selectedRestaurant.name}</h2>
                    <div className="info-rating">
                      <span className="stars">{'⭐'.repeat(Math.floor(selectedRestaurant.rating))}</span>
                      <span className="rating-value">{selectedRestaurant.rating}</span>
                    </div>
                  </div>

                  <div className="info-details">
                    <p><strong>📍 Distance:</strong> {selectedRestaurant.distance} km away</p>
                    <p><strong>🍽️ Cuisines:</strong> {selectedRestaurant.cuisine?.join(', ') || 'N/A'}</p>
                    <p><strong>📍 Address:</strong> {selectedRestaurant.address}</p>
                    {selectedRestaurant.phone && (
                      <p><strong>📞 Phone:</strong> {selectedRestaurant.phone}</p>
                    )}
                  </div>

                  <div className="info-description">
                    <p>{selectedRestaurant.description}</p>
                  </div>

                  <button 
                    className="btn-view-menu"
                    onClick={() => navigate(`/restaurant/${selectedRestaurant._id}`)}
                  >
                    View Menu & Book
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Legend */}
            <div className="map-legend">
              <p>🔍 Showing {filteredRestaurants.length} restaurants</p>
              <p className="legend-hint">📍 Click markers to view details</p>
            </div>
          </>
        ) : (
          /* List View */
          <div className="restaurants-list-view">
            <div className="list-header">
              <h2>Restaurants ({filteredRestaurants.length})</h2>
            </div>

            {filteredRestaurants.length === 0 ? (
              <div className="empty-state">
                <p>No restaurants found matching your filters</p>
                <button className="btn-reset" onClick={() => {
                  setFilterCuisine('all');
                  setFilterRating('all');
                }}>
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="restaurant-list">
                {filteredRestaurants.map(restaurant => (
                  <div key={restaurant._id} className="restaurant-list-item">
                    <div className="item-image">🍽️</div>
                    <div className="item-content">
                      <div className="item-header">
                        <h3>{restaurant.name}</h3>
                        <span className="item-rating">
                          ⭐ {restaurant.rating}
                        </span>
                      </div>
                      <p className="item-cuisine">{restaurant.cuisine?.join(', ')}</p>
                      <p className="item-distance">📍 {restaurant.distance} km away</p>
                      <p className="item-address">{restaurant.address?.slice(0, 60)}...</p>
                    </div>
                    <button 
                      className="btn-view-item"
                      onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                    >
                      View →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
