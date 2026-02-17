// Simple in-memory fallback for development when MongoDB is unavailable
// Provides promise-based CRUD functions matching controllers' needs.

const { randomUUID } = require('crypto');

const db = {
  users: [],
  restaurants: [],
  menuitems: [],
  bookings: [],
  orders: []
};

// Users
exports.createUser = async ({ name, email, password, phone }) => {
  const user = { _id: randomUUID(), name, email, password, phone, createdAt: new Date() };
  db.users.push(user);
  return user;
};

exports.findUserByEmail = async (email) => {
  return db.users.find(u => u.email === email) || null;
};

exports.findUserById = async (id) => {
  return db.users.find(u => u._id === id) || null;
};

// Restaurants
exports.getAllRestaurants = async () => db.restaurants.slice();
exports.getRestaurantById = async (id) => db.restaurants.find(r => r._id === id) || null;
exports.createRestaurant = async (data) => {
  const r = { _id: randomUUID(), ...data, createdAt: new Date() };
  db.restaurants.push(r);
  return r;
};

// MenuItems
exports.getMenuItems = async (restaurantId) => db.menuitems.filter(m => m.restaurantId === restaurantId);
exports.addMenuItem = async (restaurantId, data) => {
  const item = { _id: randomUUID(), restaurantId, ...data, createdAt: new Date() };
  db.menuitems.push(item);
  return item;
};
exports.updateMenuItem = async (id, data) => {
  const idx = db.menuitems.findIndex(m => m._id === id);
  if (idx === -1) return null;
  db.menuitems[idx] = { ...db.menuitems[idx], ...data };
  return db.menuitems[idx];
};
exports.deleteMenuItem = async (id) => {
  const idx = db.menuitems.findIndex(m => m._id === id);
  if (idx === -1) return null;
  const [deleted] = db.menuitems.splice(idx, 1);
  return deleted;
};

// Bookings
exports.createBooking = async (data) => {
  const b = { _id: randomUUID(), ...data, status: data.status || 'pending', createdAt: new Date() };
  db.bookings.push(b);
  return b;
};
exports.findBookingsByUser = async (userId) => db.bookings.filter(b => b.userId === userId);
exports.findBookingById = async (id) => db.bookings.find(b => b._id === id) || null;
exports.updateBooking = async (id, data) => {
  const idx = db.bookings.findIndex(b => b._id === id);
  if (idx === -1) return null;
  db.bookings[idx] = { ...db.bookings[idx], ...data };
  return db.bookings[idx];
};
exports.cancelBooking = async (id) => {
  return exports.updateBooking(id, { status: 'cancelled' });
};

// Orders
exports.createOrder = async (data) => {
  const totalAmount = (data.items || []).reduce((s, it) => s + (it.price * it.quantity), 0);
  const o = { _id: randomUUID(), ...data, totalAmount, status: data.status || 'pending', orderDate: new Date(), createdAt: new Date() };
  db.orders.push(o);
  return o;
};
exports.findOrdersByUser = async (userId) => db.orders.filter(o => o.userId === userId);
exports.findOrderById = async (id) => db.orders.find(o => o._id === id) || null;
exports.updateOrderStatus = async (id, status) => {
  const idx = db.orders.findIndex(o => o._id === id);
  if (idx === -1) return null;
  db.orders[idx].status = status;
  return db.orders[idx];
};
exports.cancelOrder = async (id) => exports.updateOrderStatus(id, 'cancelled');

// Expose internal for debugging
exports._db = db;
