const express = require('express');
const restaurantController = require('../controllers/restaurantController');
const { optionalAuthMiddleware, ownerMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// ============================
// PUBLIC ENDPOINTS
// ============================
// Get all restaurants (public)
router.get('/', optionalAuthMiddleware, restaurantController.getAllRestaurants);

// Get restaurant by ID (public)
router.get('/:id', optionalAuthMiddleware, restaurantController.getRestaurantById);

// ============================
// PROTECTED ENDPOINTS (Owner/Admin only)
// ============================
// Create restaurant (owner/admin only)
router.post('/', ownerMiddleware, restaurantController.createRestaurant);

module.exports = router;
