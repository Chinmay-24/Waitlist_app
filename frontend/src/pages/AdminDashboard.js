import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantService, bookingService, orderService } from '../services/api';
import '../styles/AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [restaurants, setRestaurants] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    cuisine: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalBookings: 0,
    totalOrders: 0,
    revenue: 0
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [restRes, bookRes, ordRes] = await Promise.all([
        restaurantService.getAll(),
        bookingService.getMyBookings(),
        orderService.getMyOrders()
      ]);

      setRestaurants(restRes.data || []);
      setBookings(bookRes.data || []);
      setOrders(ordRes.data || []);

      const revenue = (ordRes.data || []).reduce((sum, o) => sum + (o.totalPrice || 0), 0);

      setStats({
        totalRestaurants: (restRes.data || []).length,
        totalBookings: (bookRes.data || []).length,
        totalOrders: (ordRes.data || []).length,
        revenue
      });
    } catch (error) {
      setMessage('✗ Failed to load admin data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    if (!newRestaurant.name || !newRestaurant.address) {
      setMessage('✗ Please fill in required fields');
      return;
    }

    try {
      setLoading(true);
      // In a real app, you'd call a createRestaurant API
      const updatedRestaurants = [...restaurants, { ...newRestaurant, _id: Date.now() }];
      setRestaurants(updatedRestaurants);
      setNewRestaurant({ name: '', description: '', address: '', phone: '', cuisine: '' });
      setMessage('✓ Restaurant added successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('✗ Failed to add restaurant');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRestaurant = (id) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      setRestaurants(restaurants.filter(r => r._id !== id));
      setMessage('✓ Restaurant deleted successfully');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>🎛️ Admin Dashboard</h1>
        <p>Manage restaurants, bookings, and orders</p>
      </div>

      {message && (
        <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {/* Admin Stats */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">🏪</div>
          <h3>{stats.totalRestaurants}</h3>
          <p>Total Restaurants</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <h3>{stats.totalBookings}</h3>
          <p>Total Bookings</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <h3>{stats.totalOrders}</h3>
          <p>Total Orders</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <h3>₹{stats.revenue.toFixed(0)}</h3>
          <p>Revenue</p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'restaurants' ? 'active' : ''}`}
          onClick={() => setActiveTab('restaurants')}
        >
          🏪 Restaurants
        </button>
        <button 
          className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          📅 Bookings
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          🛒 Orders
        </button>
      </div>

      {/* Tab Content */}
      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <h2>📊 Dashboard Overview</h2>
            <div className="charts-grid">
              <div className="chart-card">
                <h3>📈 Bookings Trend</h3>
                <div className="chart-placeholder">
                  <p>Chart showing 7-day booking trend</p>
                  <div className="bar-chart">
                    <div className="bar" style={{ height: '40%' }}></div>
                    <div className="bar" style={{ height: '60%' }}></div>
                    <div className="bar" style={{ height: '45%' }}></div>
                    <div className="bar" style={{ height: '75%' }}></div>
                    <div className="bar" style={{ height: '55%' }}></div>
                    <div className="bar" style={{ height: '80%' }}></div>
                    <div className="bar" style={{ height: '70%' }}></div>
                  </div>
                </div>
              </div>

              <div className="chart-card">
                <h3>🥘 Top Cuisines</h3>
                <div className="cuisine-list">
                  <div className="cuisine-item">
                    <span>🇮🇳 Indian</span>
                    <div className="progress-bar">
                      <div className="progress" style={{ width: '85%' }}></div>
                    </div>
                    <span className="count">85%</span>
                  </div>
                  <div className="cuisine-item">
                    <span>🇮🇹 Italian</span>
                    <div className="progress-bar">
                      <div className="progress" style={{ width: '60%' }}></div>
                    </div>
                    <span className="count">60%</span>
                  </div>
                  <div className="cuisine-item">
                    <span>🇨🇳 Chinese</span>
                    <div className="progress-bar">
                      <div className="progress" style={{ width: '45%' }}></div>
                    </div>
                    <span className="count">45%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'restaurants' && (
          <div className="restaurants-section">
            <h2>🏪 Manage Restaurants</h2>

            {/* Add Restaurant Form */}
            <div className="form-section">
              <h3>➕ Add New Restaurant</h3>
              <form className="restaurant-form" onSubmit={handleAddRestaurant}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Restaurant Name *</label>
                    <input 
                      type="text" 
                      value={newRestaurant.name}
                      onChange={(e) => setNewRestaurant({...newRestaurant, name: e.target.value})}
                      placeholder="Enter restaurant name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      type="tel" 
                      value={newRestaurant.phone}
                      onChange={(e) => setNewRestaurant({...newRestaurant, phone: e.target.value})}
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    value={newRestaurant.description}
                    onChange={(e) => setNewRestaurant({...newRestaurant, description: e.target.value})}
                    placeholder="Restaurant description"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Address *</label>
                    <input 
                      type="text" 
                      value={newRestaurant.address}
                      onChange={(e) => setNewRestaurant({...newRestaurant, address: e.target.value})}
                      placeholder="Enter address"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Cuisines</label>
                    <input 
                      type="text" 
                      value={newRestaurant.cuisine}
                      onChange={(e) => setNewRestaurant({...newRestaurant, cuisine: e.target.value})}
                      placeholder="e.g., Indian, Italian (comma separated)"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-save" disabled={loading}>
                  {loading ? 'Adding...' : '➕ Add Restaurant'}
                </button>
              </form>
            </div>

            {/* Restaurants List */}
            <div className="restaurants-list">
              <h3>📋 All Restaurants</h3>
              {restaurants.length === 0 ? (
                <p className="empty">No restaurants added yet</p>
              ) : (
                <div className="table-responsive">
                  <table className="restaurants-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Cuisines</th>
                        <th>Phone</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {restaurants.map(restaurant => (
                        <tr key={restaurant._id}>
                          <td><strong>{restaurant.name}</strong></td>
                          <td>{restaurant.address}</td>
                          <td>{restaurant.cuisine ? (typeof restaurant.cuisine === 'string' ? restaurant.cuisine : restaurant.cuisine.join(', ')) : 'N/A'}</td>
                          <td>{restaurant.phone || 'N/A'}</td>
                          <td>
                            <button className="btn-edit">✏️ Edit</button>
                            <button 
                              className="btn-delete"
                              onClick={() => handleDeleteRestaurant(restaurant._id)}
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bookings-section">
            <h2>📅 Recent Bookings</h2>
            {bookings.length === 0 ? (
              <p className="empty">No bookings to manage</p>
            ) : (
              <div className="bookings-table">
                {bookings.slice(0, 10).map(booking => (
                  <div key={booking._id} className="booking-row">
                    <div className="booking-col">
                      <span className="label">Restaurant</span>
                      <span className="value">{booking.restaurantName}</span>
                    </div>
                    <div className="booking-col">
                      <span className="label">Date & Time</span>
                      <span className="value">{new Date(booking.bookingDate).toLocaleDateString()} {booking.bookingTime}</span>
                    </div>
                    <div className="booking-col">
                      <span className="label">Guests</span>
                      <span className="value">{booking.guestCount}</span>
                    </div>
                    <div className="booking-col">
                      <span className="label">Status</span>
                      <span className={`badge ${booking.status}`}>{booking.status}</span>
                    </div>
                    <div className="booking-col">
                      <button className="btn-secondary">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>🛒 Recent Orders</h2>
            {orders.length === 0 ? (
              <p className="empty">No orders to manage</p>
            ) : (
              <div className="orders-table">
                {orders.slice(0, 10).map(order => (
                  <div key={order._id} className="order-row">
                    <div className="order-col">
                      <span className="label">Restaurant</span>
                      <span className="value">{order.restaurantName}</span>
                    </div>
                    <div className="order-col">
                      <span className="label">Items</span>
                      <span className="value">{order.items?.length || 0}</span>
                    </div>
                    <div className="order-col">
                      <span className="label">Amount</span>
                      <span className="value">₹{order.totalPrice}</span>
                    </div>
                    <div className="order-col">
                      <span className="label">Status</span>
                      <span className={`badge ${order.status}`}>{order.status}</span>
                    </div>
                    <div className="order-col">
                      <button className="btn-secondary">View Details</button>
                    </div>
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
