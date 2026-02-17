const Review = require('../models/Review');
const mongoose = require('mongoose');

exports.addReview = async (req, res) => {
    try {
        const { restaurantId, rating, comment } = req.body;

        // Check if user already reviewed this restaurant? Optional but good practice.
        // For now allow multiple reviews.

        const review = new Review({
            restaurant: restaurantId,
            user: req.userId,
            rating,
            comment
        });

        await review.save();

        // Populate user info to return
        await review.populate('user', 'name');

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getReviewsByRestaurant = async (req, res) => {
    try {
        const reviews = await Review.find({ restaurant: req.params.restaurantId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!review) return res.status(404).json({ error: 'Review not found or unauthorized' });
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
