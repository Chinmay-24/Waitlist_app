import axios from 'axios';

// ============================
// API CONFIGURATION
// ============================
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000;
const ENABLE_REQUEST_LOGGING = process.env.REACT_APP_ENABLE_REQUEST_LOGGING === 'true';

// ============================
// SECURE TOKEN STORAGE
// ============================
const TokenStorage = {
  setToken: (token) => {
    if (window.sessionStorage) {
      // Use sessionStorage for better security than localStorage
      sessionStorage.setItem('auth_token', token);
      // Also set expiry to auto-clear after session timeout
      const expiry = new Date().getTime() + (parseInt(process.env.REACT_APP_SESSION_TIMEOUT) || 3600000);
      sessionStorage.setItem('auth_token_expiry', expiry);
    }
  },
  
  getToken: () => {
    if (!window.sessionStorage) return null;
    
    const token = sessionStorage.getItem('auth_token');
    const expiry = sessionStorage.getItem('auth_token_expiry');
    
    // Check if token has expired
    if (token && expiry && new Date().getTime() > parseInt(expiry)) {
      TokenStorage.clearToken();
      return null;
    }
    
    return token;
  },
  
  clearToken: () => {
    if (window.sessionStorage) {
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token_expiry');
    }
  }
};

// ============================
// AXIOS INSTANCE
// ============================
const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest' // CSRF protection
  }
});

// ============================
// REQUEST INTERCEPTOR
// ============================
api.interceptors.request.use(
  (config) => {
    // Add authentication token
    const token = TokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in development
    if (ENABLE_REQUEST_LOGGING && process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error.message);
    return Promise.reject(error);
  }
);

// ============================
// RESPONSE INTERCEPTOR
// ============================
api.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (ENABLE_REQUEST_LOGGING && process.env.NODE_ENV === 'development') {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      TokenStorage.clearToken();
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Handle forbidden access
    if (error.response?.status === 403) {
      console.error('Access denied:', error.response.data?.error || 'Insufficient permissions');
    }
    
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
    }
    
    return Promise.reject(error);
  }
);

// ============================
// AUTHENTICATION SERVICE
// ============================
export const authService = {
  register: (data) => api.post('/auth/register', data),
  
  login: async (data) => {
    const response = await api.post('/auth/login', data);
    // Secure token storage
    if (response.data.token) {
      TokenStorage.setToken(response.data.token);
    }
    return response;
  },
  
  getProfile: () => api.get('/auth/profile'),
  
  logout: () => {
    TokenStorage.clearToken();
  }
};

// ============================
// RESTAURANT SERVICE
// ============================
export const restaurantService = {
  getAll: () => api.get('/restaurants'),
  getById: (id) => api.get(`/restaurants/${id}`),
  create: (data) => api.post('/restaurants', data),
  update: (id, data) => api.put(`/restaurants/${id}`, data),
  delete: (id) => api.delete(`/restaurants/${id}`)
};

// ============================
// MENU SERVICE
// ============================
export const menuService = {
  getMenuItems: (restaurantId) => api.get(`/menu/${restaurantId}`),
  addItem: (restaurantId, data) => api.post(`/menu/${restaurantId}`, data),
  updateItem: (id, data) => api.put(`/menu/${id}`, data),
  deleteItem: (id) => api.delete(`/menu/${id}`)
};

// ============================
// BOOKING SERVICE
// ============================
export const bookingService = {
  createBooking: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  updateBooking: (id, data) => api.put(`/bookings/${id}`, data),
  cancelBooking: (id) => api.delete(`/bookings/${id}`)
};

// ============================
// ORDER SERVICE
// ============================
export const orderService = {
  createOrder: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  cancelOrder: (id) => api.delete(`/orders/${id}`)
};

// ============================
// REVIEW SERVICE
// ============================
export const reviewService = {
  addReview: (data) => api.post('/reviews', data),
  getReviews: (restaurantId) => api.get(`/reviews/${restaurantId}`),
  deleteReview: (id) => api.delete(`/reviews/${id}`)
};

// ============================
// FAVORITES SERVICE
// ============================
export const favoritesService = {
  addFavorite: (restaurantId) => api.post(`/auth/favorites/${restaurantId}`),
  removeFavorite: (restaurantId) => api.delete(`/auth/favorites/${restaurantId}`),
  getFavorites: () => api.get('/auth/favorites')
};

// ============================
// ERROR HANDLING UTILITIES
// ============================
export const getErrorMessage = (error) => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export default api;
