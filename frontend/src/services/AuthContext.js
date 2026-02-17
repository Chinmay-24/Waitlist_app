import React, { useState, createContext, useContext, useEffect, useCallback } from 'react';

const AuthContext = createContext();

// ============================
// SESSION STORAGE HELPERS
// ============================
const getStoredToken = () => {
  try {
    const token = sessionStorage.getItem('auth_token');
    const expiry = sessionStorage.getItem('auth_token_expiry');
    
    // Check if token has expired
    if (token && expiry && new Date().getTime() > parseInt(expiry)) {
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token_expiry');
      return null;
    }
    
    return token;
  } catch (error) {
    console.error('Error accessing session storage:', error);
    return null;
  }
};

const getStoredUser = () => {
  try {
    const userJson = sessionStorage.getItem('auth_user');
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    return null;
  }
};

const setStoredToken = (token) => {
  try {
    sessionStorage.setItem('auth_token', token);
    const expiry = new Date().getTime() + (parseInt(process.env.REACT_APP_SESSION_TIMEOUT) || 3600000);
    sessionStorage.setItem('auth_token_expiry', expiry);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

const setStoredUser = (user) => {
  try {
    sessionStorage.setItem('auth_user', JSON.stringify(user));
  } catch (error) {
    console.error('Error storing user:', error);
  }
};

const clearStoredAuth = () => {
  try {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token_expiry');
    sessionStorage.removeItem('auth_user');
  } catch (error) {
    console.error('Error clearing auth:', error);
  }
};

// ============================
// AUTH PROVIDER COMPONENT
// ============================
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getStoredToken());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Login handler
  const login = useCallback((userData, authToken) => {
    try {
      setUser(userData);
      setToken(authToken);
      setStoredToken(authToken);
      setStoredUser(userData);
      setError(null);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    }
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    try {
      setUser(null);
      setToken(null);
      clearStoredAuth();
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
    }
  }, []);

  // Check token expiry periodically
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      const currentToken = getStoredToken();
      if (!currentToken && token) {
        // Token expired
        logout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [token, logout]);

  // Auto-logout on window close
  useEffect(() => {
    const handleBeforeUnload = () => {
      // In development, we might want to keep the token
      // In production, you might want to clear it here
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const isAuthenticated = !!token;

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    loading,
    error,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================
// useAuth HOOK
// ============================
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
