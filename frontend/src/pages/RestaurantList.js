import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { restaurantService } from '../services/api';
import CuisineFilter from '../components/CuisineFilter';
import '../styles/RestaurantList.css';

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCuisines, setSelectedCuisines] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await restaurantService.getAll();
        setRestaurants(response.data);
        setFilteredRestaurants(response.data);
      } catch (err) {
        setError('Failed to fetch restaurants');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Filter restaurants based on selected cuisines
  const handleCuisineFilter = (cuisines) => {
    setSelectedCuisines(cuisines);
    
    if (cuisines.length === 0) {
      setFilteredRestaurants(restaurants);
    } else {
      const filtered = restaurants.filter(restaurant => {
        const restaurantCuisines = Array.isArray(restaurant.cuisine) 
          ? restaurant.cuisine 
          : [restaurant.cuisine];
        return cuisines.some(cuisine => 
          restaurantCuisines.some(rc => rc.toLowerCase() === cuisine.toLowerCase())
        );
      });
      setFilteredRestaurants(filtered);
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container error-message">{error}</div>;

  return (
    <div className="container">
      <h1>Restaurants</h1>
      
      <div className="filter-section">
        <CuisineFilter 
          onFilter={handleCuisineFilter}
          restaurants={restaurants}
        />
      </div>

      {selectedCuisines.length > 0 && (
        <div className="filter-info">
          <p>Showing {filteredRestaurants.length} restaurants matching your cuisine preferences</p>
        </div>
      )}

      <div className="restaurants-grid">
        {filteredRestaurants.length === 0 ? (
          <p className="no-results">
            {selectedCuisines.length > 0 
              ? `No restaurants match the selected cuisines. Try a different filter.` 
              : 'No restaurants available yet.'}
          </p>
        ) : (
          filteredRestaurants.map((restaurant) => (
            <div key={restaurant._id} className="restaurant-card">
              <h2>{restaurant.name}</h2>
              <p>{restaurant.description}</p>
              <p><strong>Address:</strong> {restaurant.address}</p>
              <p><strong>Cuisine:</strong> {(Array.isArray(restaurant.cuisine) ? restaurant.cuisine : [restaurant.cuisine]).join(', ')}</p>
              {restaurant.phone && <p><strong>Phone:</strong> {restaurant.phone}</p>}
              <Link to={`/restaurant/${restaurant._id}`} className="btn">
                View Menu & Book
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
