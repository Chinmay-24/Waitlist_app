const express = require('express');
const authController = require('../controllers/authController');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/auth');

const router = express.Router();

// ============================
// PUBLIC ENDPOINTS
// ============================
// User registration
router.post('/register', authController.register);

// User login
router.post('/login', authController.login);

// ============================
// PROTECTED ENDPOINTS
// ============================
// Get user profile
router.get('/profile', authMiddleware, authController.getProfile);

// ============================
// FAVORITES ENDPOINTS (PROTECTED)
// ============================
router.post('/favorites/:restaurantId', authMiddleware, authController.addFavorite);
router.delete('/favorites/:restaurantId', authMiddleware, authController.removeFavorite);
router.get('/favorites', authMiddleware, authController.getFavorites);

module.exports = router;
