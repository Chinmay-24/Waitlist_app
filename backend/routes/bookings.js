const express = require('express');
const bookingController = require('../controllers/bookingController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// ============================
// PROTECTED ENDPOINTS (Authenticated users only)
// ============================
// Create new booking
router.post('/', authMiddleware, bookingController.createBooking);

// Get user's bookings
router.get('/', authMiddleware, bookingController.getMyBookings);

// Get specific booking
router.get('/:id', authMiddleware, bookingController.getBookingById);

// Update booking
router.put('/:id', authMiddleware, bookingController.updateBooking);

// Cancel booking
router.delete('/:id', authMiddleware, bookingController.cancelBooking);

module.exports = router;
