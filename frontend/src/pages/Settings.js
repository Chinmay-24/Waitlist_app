import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Settings.css';

export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderUpdates: true,
    bookingReminders: true,
    specialOffers: true,
    darkMode: false,
    language: 'en',
    timezone: 'IST'
  });
  const [message, setMessage] = useState('');

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    setMessage('✓ Setting updated');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleSelect = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveAll = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    setMessage('✓ All settings saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>⚙️ Settings</h1>
        <p>Manage your preferences and app configuration</p>
      </div>

      {message && <div className="message success">{message}</div>}

      <div className="settings-grid">
        {/* Notifications Section */}
        <div className="settings-section">
          <div className="section-header">
            <h2>🔔 Notifications</h2>
          </div>

          <div className="settings-item">
            <div className="item-info">
              <h3>Email Notifications</h3>
              <p>Receive updates via email</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={settings.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="settings-item">
            <div className="item-info">
              <h3>SMS Notifications</h3>
              <p>Get important alerts via text message</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={settings.smsNotifications}
                onChange={() => handleToggle('smsNotifications')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="settings-item">
            <div className="item-info">
              <h3>Push Notifications</h3>
              <p>Browser push notifications</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={settings.pushNotifications}
                onChange={() => handleToggle('pushNotifications')}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* Alert Preferences Section */}
        <div className="settings-section">
          <div className="section-header">
            <h2>📧 Alert Preferences</h2>
          </div>

          <div className="settings-item">
            <div className="item-info">
              <h3>Order Updates</h3>
              <p>Notifications about your orders</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={settings.orderUpdates}
                onChange={() => handleToggle('orderUpdates')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="settings-item">
            <div className="item-info">
              <h3>Booking Reminders</h3>
              <p>Reminders before your restaurant bookings</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={settings.bookingReminders}
                onChange={() => handleToggle('bookingReminders')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="settings-item">
            <div className="item-info">
              <h3>Special Offers</h3>
              <p>Receive promotional offers and deals</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={settings.specialOffers}
                onChange={() => handleToggle('specialOffers')}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* Display Settings Section */}
        <div className="settings-section">
          <div className="section-header">
            <h2>🎨 Display</h2>
          </div>

          <div className="settings-item">
            <div className="item-info">
              <h3>Dark Mode</h3>
              <p>Use dark theme for better night viewing</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={settings.darkMode}
                onChange={() => handleToggle('darkMode')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="settings-item">
            <div className="item-info">
              <h3>Language</h3>
              <p>App interface language</p>
            </div>
            <select 
              value={settings.language}
              onChange={(e) => handleSelect('language', e.target.value)}
              className="select-input"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="es">Español (Spanish)</option>
              <option value="fr">Français (French)</option>
            </select>
          </div>

          <div className="settings-item">
            <div className="item-info">
              <h3>Timezone</h3>
              <p>Your timezone for displaying times</p>
            </div>
            <select 
              value={settings.timezone}
              onChange={(e) => handleSelect('timezone', e.target.value)}
              className="select-input"
            >
              <option value="IST">IST (GMT+5:30)</option>
              <option value="EST">EST (GMT-5)</option>
              <option value="PST">PST (GMT-8)</option>
              <option value="GMT">GMT</option>
              <option value="CET">CET (GMT+1)</option>
            </select>
          </div>
        </div>

        {/* Privacy & Security Section */}
        <div className="settings-section">
          <div className="section-header">
            <h2>🔐 Privacy & Security</h2>
          </div>

          <div className="settings-item">
            <div className="item-info">
              <h3>Profile Visibility</h3>
              <p>Control who can see your profile</p>
            </div>
            <select className="select-input">
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
              <option value="public">Public</option>
            </select>
          </div>

          <div className="settings-item">
            <div className="item-info">
              <h3>Data & Privacy</h3>
              <p>Manage your data and privacy settings</p>
            </div>
            <button className="btn-secondary">Configure</button>
          </div>

          <div className="settings-item">
            <div className="item-info">
              <h3>Download Your Data</h3>
              <p>Export your personal data</p>
            </div>
            <button className="btn-secondary">Download</button>
          </div>
        </div>

        {/* Account Section */}
        <div className="settings-section">
          <div className="section-header">
            <h2>👤 Account</h2>
          </div>

          <div className="settings-item">
            <div className="item-info">
              <h3>Account Information</h3>
              <p>View and edit your account details</p>
            </div>
            <button className="btn-secondary" onClick={() => navigate('/profile')}>
              View Profile
            </button>
          </div>

          <div className="settings-item danger">
            <div className="item-info">
              <h3>Delete Account</h3>
              <p>Permanently delete your account and data</p>
            </div>
            <button className="btn-danger">Delete</button>
          </div>
        </div>
      </div>

      <div className="settings-footer">
        <button className="btn-save" onClick={handleSaveAll}>
          ✓ Save All Settings
        </button>
      </div>
    </div>
  );
}
