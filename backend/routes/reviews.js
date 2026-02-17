const express = require('express');
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, reviewController.addReview);
// Get reviews by restaurant ID
router.get('/:restaurantId', reviewController.getReviewsByRestaurant);
router.delete('/:id', authMiddleware, reviewController.deleteReview);

module.exports = router;
