const express = require('express');
const orderController = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// ============================
// PROTECTED ENDPOINTS (Authenticated users only)
// ============================
// Create new order
router.post('/', authMiddleware, orderController.createOrder);

// Get user's orders
router.get('/', authMiddleware, orderController.getMyOrders);

// Get specific order
router.get('/:id', authMiddleware, orderController.getOrderById);

// Update order status (admin only)
router.put('/:id/status', adminMiddleware, orderController.updateOrderStatus);

// Cancel order
router.delete('/:id', authMiddleware, orderController.cancelOrder);

module.exports = router;
