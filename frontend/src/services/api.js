import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile')
};

export const restaurantService = {
  getAll: () => api.get('/restaurants'),
  getById: (id) => api.get(`/restaurants/${id}`)
};

export const menuService = {
  getMenuItems: (restaurantId) => api.get(`/menu/${restaurantId}`)
};

export const bookingService = {
  createBooking: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  updateBooking: (id, data) => api.put(`/bookings/${id}`, data),
  cancelBooking: (id) => api.delete(`/bookings/${id}`)
};

export const orderService = {
  createOrder: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  cancelOrder: (id) => api.delete(`/orders/${id}`)
};

export const reviewService = {
  addReview: (data) => api.post('/reviews', data),
  getReviews: (restaurantId) => api.get(`/reviews/${restaurantId}`),
  deleteReview: (id) => api.delete(`/reviews/${id}`)
};

export const favoritesService = {
  addFavorite: (restaurantId) => api.post(`/auth/favorites/${restaurantId}`),
  removeFavorite: (restaurantId) => api.delete(`/auth/favorites/${restaurantId}`),
  getFavorites: () => api.get('/auth/favorites')
};

export default api;
