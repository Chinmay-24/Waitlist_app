const express = require('express');
const menuController = require('../controllers/menuController');
const { optionalAuthMiddleware, ownerMiddleware } = require('../middleware/auth');

const router = express.Router();

// ============================
// PUBLIC ENDPOINTS
// ============================
// Get menu items for restaurant (public)
router.get('/:restaurantId', optionalAuthMiddleware, menuController.getMenuItems);

// ============================
// PROTECTED ENDPOINTS (Owner/Admin only)
// ============================
// Add menu item
router.post('/:restaurantId', ownerMiddleware, menuController.addMenuItem);

// Update menu item
router.put('/:id', ownerMiddleware, menuController.updateMenuItem);

// Delete menu item
router.delete('/:id', ownerMiddleware, menuController.deleteMenuItem);

module.exports = router;
