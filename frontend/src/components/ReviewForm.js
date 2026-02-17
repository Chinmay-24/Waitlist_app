import React, { useState } from 'react';
import { reviewService } from '../services/api';
import '../styles/ReviewForm.css';

const ReviewForm = ({ restaurantId, onReviewAdded }) => {
    const [rating, setRating] = useState(5);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!title.trim()) {
            setError('Please enter a review title');
            setLoading(false);
            return;
        }

        if (!comment.trim()) {
            setError('Please enter your review');
            setLoading(false);
            return;
        }

        try {
            await reviewService.addReview({ 
                restaurantId, 
                rating, 
                title: title.trim(),
                comment: comment.trim()
            });
            setSuccess(true);
            setComment('');
            setTitle('');
            setRating(5);
            setTimeout(() => setSuccess(false), 2000);
            if (onReviewAdded) onReviewAdded();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="review-form-wrapper">
            <div className="review-form-container">
                <h2>Share Your Experience</h2>
                <p>Help others by sharing your honest review</p>

                {error && <div className="form-error">{error}</div>}
                {success && <div className="form-success">✓ Review submitted successfully!</div>}

                <form className="review-form" onSubmit={handleSubmit}>
                    {/* Rating Section */}
                    <div className="form-group">
                        <label>Your Rating</label>
                        <div className="rating-input">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    className={`star ${star <= (hoveredRating || rating) ? 'active' : ''}`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    title={`${star} star${star > 1 ? 's' : ''}`}
                                >
                                    ⭐
                                </button>
                            ))}
                            <span className="rating-text">
                                {hoveredRating || rating} out of 5 stars
                            </span>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="form-group">
                        <label>Review Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Amazing food and great service!"
                            className="form-input"
                            maxLength={100}
                        />
                        <small className="char-count">{title.length}/100</small>
                    </div>

                    {/* Comment */}
                    <div className="form-group">
                        <label>Your Review</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience... What did you like? What could be improved?"
                            className="form-textarea"
                            maxLength={500}
                            rows={4}
                        />
                        <small className="char-count">{comment.length}/500</small>
                    </div>

                    {/* Buttons */}
                    <div className="form-buttons">
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : '✓ Submit Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewForm;
