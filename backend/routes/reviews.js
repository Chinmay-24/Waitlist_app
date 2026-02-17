const express = require('express');
const reviewController = require('../controllers/reviewController');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/auth');

const router = express.Router();

// ============================
// PUBLIC ENDPOINTS
// ============================
// Get reviews for restaurant (public)
router.get('/:restaurantId', optionalAuthMiddleware, reviewController.getReviewsByRestaurant);

// ============================
// PROTECTED ENDPOINTS (Authenticated users only)
// ============================
// Add review
router.post('/', authMiddleware, reviewController.addReview);

// Delete review (only own reviews or admin)
router.delete('/:id', authMiddleware, reviewController.deleteReview);

module.exports = router;
