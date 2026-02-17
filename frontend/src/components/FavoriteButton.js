import React, { useState } from 'react';
import { favoritesService } from '../services/api';

const FavoriteButton = ({ restaurantId, initialIsFavorite, onToggle }) => {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
    const [loading, setLoading] = useState(false);

    const toggleFavorite = async (e) => {
        e.stopPropagation(); // Prevent parent click handlers
        setLoading(true);
        try {
            if (isFavorite) {
                await favoritesService.removeFavorite(restaurantId);
            } else {
                await favoritesService.addFavorite(restaurantId);
            }
            setIsFavorite(!isFavorite);
            if (onToggle) onToggle(!isFavorite);
        } catch (error) {
            console.error('Failed to toggle favorite', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={toggleFavorite}
            className={`btn-favorite ${isFavorite ? 'active' : ''}`}
            disabled={loading}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            style={{
                border: 'none',
                background: 'transparent',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0 10px',
                transition: 'transform 0.2s'
            }}
        >
            {isFavorite ? '❤️' : '🤍'}
        </button>
    );
};

export default FavoriteButton;
