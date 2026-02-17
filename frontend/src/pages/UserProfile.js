import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { authService } from '../services/api';
import '../styles/UserProfile.css';

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user, isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      // In a real app, you'd have an updateProfile endpoint
      localStorage.setItem('userProfile', JSON.stringify(formData));
      setMessage('✓ Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('✗ Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">{user?.name?.charAt(0) || 'U'}</div>
        <h1>{user?.name}</h1>
        <p className="profile-email">{user?.email}</p>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Profile Information
        </button>
        <button 
          className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          🎯 Preferences
        </button>
        <button 
          className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          🔒 Security
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'profile' && (
          <form className="profile-form" onSubmit={handleSaveProfile}>
            <div className="form-section">
              <h2>Edit Profile</h2>
              
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled
                  placeholder="Your email"
                />
                <small>Email cannot be changed</small>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              {message && <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>{message}</div>}

              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? 'Saving...' : '✓ Save Changes'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'preferences' && (
          <div className="preferences-section">
            <h2>Dining Preferences</h2>
            <div className="pref-grid">
              <div className="pref-card">
                <h3>Dietary Preferences</h3>
                <div className="pref-options">
                  <label><input type="checkbox" /> Vegetarian</label>
                  <label><input type="checkbox" /> Vegan</label>
                  <label><input type="checkbox" /> Gluten-Free</label>
                  <label><input type="checkbox" /> Dairy-Free</label>
                </div>
              </div>

              <div className="pref-card">
                <h3>Cuisine Preferences</h3>
                <div className="pref-options">
                  <label><input type="checkbox" /> Indian</label>
                  <label><input type="checkbox" /> Italian</label>
                  <label><input type="checkbox" /> Chinese</label>
                  <label><input type="checkbox" /> Mexican</label>
                </div>
              </div>

              <div className="pref-card">
                <h3>Service Preferences</h3>
                <div className="pref-options">
                  <label><input type="checkbox" /> Dine-In</label>
                  <label><input type="checkbox" /> Takeout</label>
                  <label><input type="checkbox" /> Delivery</label>
                  <label><input type="checkbox" /> Room Service</label>
                </div>
              </div>

              <div className="pref-card">
                <h3>Price Range</h3>
                <div className="pref-options">
                  <label><input type="radio" name="price" /> Budget (₹ $)</label>
                  <label><input type="radio" name="price" /> Moderate (₹ $$$)</label>
                  <label><input type="radio" name="price" /> Premium (₹ $$$$)</label>
                </div>
              </div>
            </div>
            <button className="btn-save">✓ Save Preferences</button>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="security-section">
            <h2>Security Settings</h2>
            
            <div className="security-card">
              <h3>🔐 Change Password</h3>
              <form className="password-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input type="password" placeholder="Enter current password" />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" placeholder="Enter new password" />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input type="password" placeholder="Confirm new password" />
                </div>
                <button type="submit" className="btn-save">Update Password</button>
              </form>
            </div>

            <div className="security-card">
              <h3>📱 Two-Factor Authentication</h3>
              <p>Add an extra layer of security to your account</p>
              <button className="btn-secondary">Enable 2FA</button>
            </div>

            <div className="security-card">
              <h3>🔑 Active Sessions</h3>
              <div className="session-item">
                <div>
                  <p className="session-device">Windows • Chrome</p>
                  <p className="session-time">Last active: Just now</p>
                </div>
                <button className="btn-logout">Sign Out</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
