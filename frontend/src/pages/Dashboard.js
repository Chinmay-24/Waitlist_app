import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { bookingService, orderService, restaurantService, favoritesService } from '../services/api';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalOrders: 0,
    totalSpent: 0,
    activeBookings: 0
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, ordersRes, restaurantsRes, favoritesRes] = await Promise.all([
        bookingService.getMyBookings(),
        orderService.getMyOrders(),
        restaurantService.getAll(),
        favoritesService.getFavorites()
      ]);

      setBookings(bookingsRes.data || []);
      setOrders(ordersRes.data || []);
      setRestaurants(restaurantsRes.data || []);
      setFavorites(favoritesRes.data || []);

      // Calculate stats
      const activeBookingsCount = (bookingsRes.data || []).filter(b => new Date(b.bookingDate) > new Date()).length;
      const totalExpent = (ordersRes.data || []).reduce((sum, o) => sum + (o.totalPrice || 0), 0);

      setStats({
        totalBookings: (bookingsRes.data || []).length,
        totalOrders: (ordersRes.data || []).length,
        totalSpent: totalExpent,
        activeBookings: activeBookingsCount
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="dashboard-container"><div className="loading">Loading dashboard...</div></div>;

  const recentBookings = bookings.slice(0, 3);
  const recentOrders = orders.slice(0, 3);
  const suggestedRestaurants = restaurants.slice(0, 4);

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>👋 Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p>Here's what's happening with your bookings and orders</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/restaurants')}>
          🔍 Explore Restaurants
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{stats.totalBookings}</h3>
            <p>Total Bookings</p>
          </div>
          <Link to="/bookings" className="stat-link">View All →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
          <Link to="/orders" className="stat-link">View All →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>₹{stats.totalSpent.toFixed(0)}</h3>
            <p>Total Spent</p>
          </div>
          <Link to="/orders" className="stat-link">View History →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>{stats.activeBookings}</h3>
            <p>Active Bookings</p>
          </div>
          <Link to="/bookings" className="stat-link">Manage →</Link>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Recent Bookings */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>📅 Upcoming Bookings</h2>
            <Link to="/bookings" className="view-all-link">View All →</Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <p>No upcoming bookings</p>
              <button className="btn-primary" onClick={() => navigate('/restaurants')}>
                Make a Booking
              </button>
            </div>
          ) : (
            <div className="bookings-list">
              {recentBookings.map(booking => (
                <div key={booking._id} className="booking-item">
                  <div className="booking-info">
                    <h3>{booking.restaurantName || 'Restaurant'}</h3>
                    <div className="booking-details">
                      <span>📅 {new Date(booking.bookingDate).toLocaleDateString()}</span>
                      <span>🕐 {booking.bookingTime}</span>
                      <span>👥 {booking.guestCount} guests</span>
                    </div>
                    <p className="booking-notes">{booking.specialRequests}</p>
                  </div>
                  <div className="booking-status">
                    <span className={`status-badge ${booking.status || 'confirmed'}`}>
                      {(booking.status || 'Confirmed').toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Orders */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>🛒 Recent Orders</h2>
            <Link to="/orders" className="view-all-link">View All →</Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🛒</div>
              <p>No recent orders</p>
              <button className="btn-primary" onClick={() => navigate('/restaurants')}>
                Order Now
              </button>
            </div>
          ) : (
            <div className="orders-list">
              {recentOrders.map(order => (
                <div key={order._id} className="order-item">
                  <div className="order-info">
                    <h3>{order.restaurantName || 'Restaurant'}</h3>
                    <div className="order-details">
                      <span>📦 {order.items?.length || 0} items</span>
                      <span>💰 ₹{order.totalPrice}</span>
                      <span>📍 {order.deliveryAddress?.slice(0, 40)}...</span>
                    </div>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge ${order.status || 'pending'}`}>
                      {(order.status || 'Pending').toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Favorites */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>❤️ Your Favorites</h2>
            <Link to="/favorites" className="view-all-link">View All →</Link>
          </div>

          {favorites.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">❤️</div>
              <p>No favorite restaurants yet</p>
              <button className="btn-primary" onClick={() => navigate('/restaurants')}>
                Browse Restaurants
              </button>
            </div>
          ) : (
            <div className="favorites-grid">
              {favorites.slice(0, 3).map(fav => (
                <div key={fav._id} className="favorite-card">
                  <div className="favorite-header">
                    <h3>{fav.name}</h3>
                    <span className="favorite-icon">❤️</span>
                  </div>
                  <p className="cuisine">{fav.cuisine?.join(', ')}</p>
                  <p className="address">{fav.address?.slice(0, 50)}...</p>
                  <button 
                    className="btn-secondary"
                    onClick={() => navigate(`/restaurant/${fav._id}`)}
                  >
                    View Menu
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Suggested Restaurants */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>✨ Suggested For You</h2>
            <Link to="/restaurants" className="view-all-link">Browse All →</Link>
          </div>

          <div className="suggested-grid">
            {suggestedRestaurants.map(restaurant => (
              <div key={restaurant._id} className="suggested-card">
                <div className="card-image">🍽️</div>
                <h3>{restaurant.name}</h3>
                <p className="cuisine">{restaurant.cuisine?.slice(0, 2).join(', ')}</p>
                <div className="card-footer">
                  <span className="rating">⭐ 4.5</span>
                  <button 
                    className="btn-small"
                    onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
