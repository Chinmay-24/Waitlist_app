const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authMiddleware, authController.getProfile);

// Favorites routes
router.post('/favorites/:restaurantId', authMiddleware, authController.addFavorite);
router.delete('/favorites/:restaurantId', authMiddleware, authController.removeFavorite);
router.get('/favorites', authMiddleware, authController.getFavorites);

module.exports = router;
