import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import '../styles/Navbar.css';

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setUserMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <button className="menu-toggle" onClick={onMenuClick}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="navbar-brand" onClick={() => navigate('/dashboard')}>
          <span className="brand-icon">🍽️</span>
          <h1>RestaurantHub</h1>
        </div>

        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <button className="link-btn" onClick={() => navigate('/restaurants')}>
                <span className="nav-icon">🏪</span> Restaurants
              </button>
              <button className="link-btn" onClick={() => navigate('/map')}>
                <span className="nav-icon">🗺️</span> Map View
              </button>
              <button className="link-btn" onClick={() => navigate('/bookings')}>
                <span className="nav-icon">📅</span> Bookings
              </button>
              <button className="link-btn" onClick={() => navigate('/orders')}>
                <span className="nav-icon">🛒</span> Orders
              </button>
              <button className="link-btn" onClick={() => navigate('/checkout')}>
                <span className="nav-icon">💳</span> Checkout
              </button>
              <button className="link-btn" onClick={() => navigate('/favorites')}>
                <span className="nav-icon">❤️</span> Favorites
              </button>

              <div className="navbar-divider"></div>

              <div className="user-dropdown">
                <button 
                  className="user-section"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="user-avatar">{user?.name?.charAt(0) || 'U'}</div>
                  <span className="user-name">{user?.name}</span>
                </button>
                {userMenuOpen && (
                  <div className="dropdown-menu">
                    <button 
                      className="dropdown-item"
                      onClick={() => { navigate('/dashboard'); setUserMenuOpen(false); }}
                    >
                      📊 Dashboard
                    </button>
                    <button 
                      className="dropdown-item"
                      onClick={() => { navigate('/profile'); setUserMenuOpen(false); }}
                    >
                      👤 My Profile
                    </button>
                    <button 
                      className="dropdown-item"
                      onClick={() => { navigate('/settings'); setUserMenuOpen(false); }}
                    >
                      ⚙️ Settings
                    </button>
                    <button 
                      className="dropdown-item"
                      onClick={() => { navigate('/admin'); setUserMenuOpen(false); }}
                    >
                      🎛️ Admin Panel
                    </button>
                    <div className="dropdown-divider"></div>
                    <button 
                      className="dropdown-item logout"
                      onClick={handleLogout}
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button className="link-btn" onClick={() => navigate('/login')}>Login</button>
              <button className="link-btn" onClick={() => navigate('/register')}>Register</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
