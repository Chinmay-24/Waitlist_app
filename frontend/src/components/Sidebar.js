import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import '../styles/Sidebar.css';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {isAuthenticated ? (
          <div className="sidebar-content">
            <div className="user-profile">
              <div className="user-avatar">{user?.name?.charAt(0) || 'U'}</div>
              <div className="user-details">
                <p className="user-name">{user?.name}</p>
                <p className="user-email">{user?.email}</p>
              </div>
            </div>

            <nav className="sidebar-nav">
              <button 
                className="nav-item"
                onClick={() => handleNavigation('/dashboard')}
              >
                <span className="nav-icon">📊</span>
                <span className="nav-text">Dashboard</span>
              </button>

              <button 
                className="nav-item"
                onClick={() => handleNavigation('/restaurants')}
              >
                <span className="nav-icon">🏪</span>
                <span className="nav-text">Browse Restaurants</span>
              </button>

              <button 
                className="nav-item"
                onClick={() => handleNavigation('/map')}
              >
                <span className="nav-icon">🗺️</span>
                <span className="nav-text">Map View</span>
              </button>

              <button 
                className="nav-item"
                onClick={() => handleNavigation('/checkout')}
              >
                <span className="nav-icon">💳</span>
                <span className="nav-text">Checkout</span>
              </button>

              <button 
                className="nav-item"
                onClick={() => handleNavigation('/bookings')}
              >
                <span className="nav-icon">📅</span>
                <span className="nav-text">My Bookings</span>
              </button>

              <button 
                className="nav-item"
                onClick={() => handleNavigation('/orders')}
              >
                <span className="nav-icon">🛒</span>
                <span className="nav-text">My Orders</span>
              </button>

              <button 
                className="nav-item"
                onClick={() => handleNavigation('/favorites')}
              >
                <span className="nav-icon">❤️</span>
                <span className="nav-text">Favorites</span>
              </button>

              <div className="sidebar-divider"></div>

              <button 
                className="nav-item"
                onClick={() => handleNavigation('/profile')}
              >
                <span className="nav-icon">👤</span>
                <span className="nav-text">My Profile</span>
              </button>

              <button 
                className="nav-item"
                onClick={() => handleNavigation('/settings')}
              >
                <span className="nav-icon">⚙️</span>
                <span className="nav-text">Settings</span>
              </button>

              <button 
                className="nav-item"
                onClick={() => handleNavigation('/admin')}
              >
                <span className="nav-icon">🎛️</span>
                <span className="nav-text">Admin Panel</span>
              </button>
            </nav>

            <button 
              className="logout-btn"
              onClick={handleLogout}
            >
              <span className="nav-icon">🚪</span>
              <span className="nav-text">Logout</span>
            </button>
          </div>
        ) : (
          <div className="sidebar-content">
            <nav className="sidebar-nav">
              <button 
                className="nav-item"
                onClick={() => handleNavigation('/login')}
              >
                <span className="nav-icon">🔑</span>
                <span className="nav-text">Login</span>
              </button>

              <button 
                className="nav-item"
                onClick={() => handleNavigation('/register')}
              >
                <span className="nav-icon">📝</span>
                <span className="nav-text">Register</span>
              </button>
            </nav>
          </div>
        )}
      </aside>
    </>
  );
}
