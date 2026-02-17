import React, { useState, useEffect } from 'react';
import '../styles/ReviewList.css';

const ReviewList = ({ restaurantId, refreshTrigger }) => {
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterRating, setFilterRating] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [helpfulVotes, setHelpfulVotes] = useState({});

    // Mock data for demo purposes
    const mockReviews = [
        {
            _id: '1',
            user: { name: 'Rajesh Kumar', avatar: '👨‍💼' },
            rating: 5,
            title: 'Amazing Food Quality',
            comment: 'The biryani here is absolutely incredible! Perfectly spiced with authentic flavors. The service was also very prompt and courteous. Highly recommend!',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            helpful: 24,
            unhelpful: 1
        },
        {
            _id: '2',
            user: { name: 'Priya Sharma', avatar: '👩‍💼' },
            rating: 4,
            title: 'Good but Slightly Expensive',
            comment: 'Food quality is really good and quantity is decent. However, the pricing is a bit on the higher side compared to nearby restaurants. Worth it for special occasions.',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            helpful: 18,
            unhelpful: 3
        },
        {
            _id: '3',
            user: { name: 'Arun Patel', avatar: '👨🏻' },
            rating: 3,
            title: 'Average Experience',
            comment: 'Food was okay, nothing special. Taste could be better. Service was slow during peak hours. Had to wait for 30 minutes for the main course.',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            helpful: 12,
            unhelpful: 2
        },
        {
            _id: '4',
            user: { name: 'Sneha Singh', avatar: '👩' },
            rating: 5,
            title: 'Best Dining Experience',
            comment: 'Fantastic ambiance, delicious food, and outstanding service! The staff remembered our preferences from the last visit. Will definitely come back soon!',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            helpful: 31,
            unhelpful: 0
        }
    ];

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                // In production, use: const response = await reviewService.getReviews(restaurantId);
                // For now, using mock data
                setReviews(mockReviews);
                
                // Initialize helpful votes
                const votes = {};
                mockReviews.forEach(review => {
                    votes[review._id] = { helpful: review.helpful, unhelpful: review.unhelpful };
                });
                setHelpfulVotes(votes);
            } catch (err) {
                setError('Failed to load reviews');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [restaurantId, refreshTrigger]);

    // Filter and sort reviews
    useEffect(() => {
        let filtered = reviews;

        if (filterRating !== 'all') {
            filtered = filtered.filter(review => review.rating === parseInt(filterRating));
        }

        // Sort reviews
        if (sortBy === 'newest') {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'highest') {
            filtered.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === 'lowest') {
            filtered.sort((a, b) => a.rating - b.rating);
        } else if (sortBy === 'helpful') {
            filtered.sort((a, b) => {
                const aVotes = helpfulVotes[a._id] || { helpful: a.helpful, unhelpful: a.unhelpful };
                const bVotes = helpfulVotes[b._id] || { helpful: b.helpful, unhelpful: b.unhelpful };
                return bVotes.helpful - aVotes.helpful;
            });
        }

        setFilteredReviews(filtered);
    }, [reviews, filterRating, sortBy, helpfulVotes]);

    const getAverageRating = () => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    const getRatingDistribution = () => {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(review => {
            distribution[review.rating]++;
        });
        return distribution;
    };

    const getRelativeTime = (date) => {
        const now = new Date();
        const diffMs = now - new Date(date);
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks}w ago`;
        }
        return new Date(date).toLocaleDateString();
    };

    const handleHelpful = (reviewId, isHelpful) => {
        setHelpfulVotes(prev => ({
            ...prev,
            [reviewId]: {
                ...prev[reviewId],
                helpful: isHelpful ? prev[reviewId].helpful + 1 : prev[reviewId].helpful
            }
        }));
    };

    const ratingDist = getRatingDistribution();
    const avgRating = getAverageRating();

    if (loading) return <div className="review-list-loading">Loading reviews...</div>;
    if (error) return <div className="review-list-error">{error}</div>;

    return (
        <div className="review-list">
            {reviews.length === 0 ? (
                <div className="review-list-empty">
                    <p>No reviews yet. Be the first to review!</p>
                </div>
            ) : (
                <>
                    {/* Rating Summary */}
                    <div className="rating-summary">
                        <div className="rating-average">
                            <div className="rating-number">{avgRating}</div>
                            <div className="rating-stars">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < Math.round(avgRating) ? 'star active' : 'star'}>
                                        ⭐
                                    </span>
                                ))}
                            </div>
                            <div className="rating-count">Based on {reviews.length} reviews</div>
                        </div>

                        <div className="rating-distribution">
                            {[5, 4, 3, 2, 1].map(rating => (
                                <div key={rating} className="distribution-bar">
                                    <span className="bar-label">{rating}★</span>
                                    <div className="bar-container">
                                        <div
                                            className="bar-fill"
                                            style={{
                                                width: `${(ratingDist[rating] / reviews.length) * 100}%`
                                            }}
                                        />
                                    </div>
                                    <span className="bar-count">{ratingDist[rating]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Filter and Sort Controls */}
                    <div className="review-controls">
                        <select
                            className="filter-select"
                            value={filterRating}
                            onChange={(e) => setFilterRating(e.target.value)}
                        >
                            <option value="all">All Ratings</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>

                        <select
                            className="filter-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="newest">Newest First</option>
                            <option value="highest">Highest Rated</option>
                            <option value="lowest">Lowest Rated</option>
                            <option value="helpful">Most Helpful</option>
                        </select>
                    </div>

                    {/* Reviews List */}
                    <div className="reviews-container">
                        {filteredReviews.length === 0 ? (
                            <div className="review-empty-filter">
                                No reviews match the selected filter.
                            </div>
                        ) : (
                            filteredReviews.map((review) => (
                                <div key={review._id} className="review-card">
                                    <div className="review-header">
                                        <div className="reviewer-info">
                                            <span className="reviewer-avatar">{review.user.avatar}</span>
                                            <div>
                                                <div className="reviewer-name">{review.user.name}</div>
                                                <div className="review-date">{getRelativeTime(review.createdAt)}</div>
                                            </div>
                                        </div>
                                        <div className="review-rating">
                                            {[...Array(5)].map((_, i) => (
                                                <span
                                                    key={i}
                                                    className={i < review.rating ? 'star active' : 'star'}
                                                >
                                                    ⭐
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="review-title">{review.title}</div>
                                    <div className="review-comment">{review.comment}</div>

                                    <div className="review-footer">
                                        <div className="helpful-section">
                                            <span className="helpful-label">Helpful?</span>
                                            <button
                                                className="helpful-btn"
                                                onClick={() => handleHelpful(review._id, true)}
                                            >
                                                👍 {helpfulVotes[review._id]?.helpful || review.helpful}
                                            </button>
                                            <button className="helpful-btn">
                                                👎 {helpfulVotes[review._id]?.unhelpful || review.unhelpful}
                                            </button>
                                        </div>
                                        <button className="report-btn">Report</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ReviewList;
