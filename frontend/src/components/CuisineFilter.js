import React, { useState, useEffect } from 'react';
import '../styles/CuisineFilter.css';

const CuisineFilter = ({ onFilter, restaurants = [] }) => {
    const [selectedCuisines, setSelectedCuisines] = useState([]);
    const [availableCuisines, setAvailableCuisines] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);

    // Extract unique cuisines from restaurants
    useEffect(() => {
        const cuisineSet = new Set();
        const defaultCuisines = [
            'Italian',
            'Chinese',
            'Indian',
            'Mexican',
            'Japanese',
            'Thai',
            'American',
            'Mediterranean',
            'Korean',
            'Vietnamese',
            'Lebanese',
            'Turkish'
        ];

        // Use restaurants data if available, otherwise use default list
        if (restaurants && restaurants.length > 0) {
            restaurants.forEach(restaurant => {
                if (restaurant.cuisines) {
                    if (Array.isArray(restaurant.cuisines)) {
                        restaurant.cuisines.forEach(c => cuisineSet.add(c));
                    } else {
                        cuisineSet.add(restaurant.cuisines);
                    }
                }
            });
        }

        const cuisines = cuisineSet.size > 0 
            ? Array.from(cuisineSet).sort()
            : defaultCuisines;

        setAvailableCuisines(cuisines);
    }, [restaurants]);

    const handleCuisineChange = (cuisine) => {
        let updated;
        if (selectedCuisines.includes(cuisine)) {
            updated = selectedCuisines.filter(c => c !== cuisine);
        } else {
            updated = [...selectedCuisines, cuisine];
        }
        setSelectedCuisines(updated);
        onFilter(updated);
    };

    const handleClearAll = () => {
        setSelectedCuisines([]);
        onFilter([]);
    };

    const handleRemove = (cuisine) => {
        const updated = selectedCuisines.filter(c => c !== cuisine);
        setSelectedCuisines(updated);
        onFilter(updated);
    };

    return (
        <div className="cuisine-filter">
            {/* Selected Cuisines Display */}
            {selectedCuisines.length > 0 && (
                <div className="selected-cuisines">
                    <div className="selected-label">
                        Filters ({selectedCuisines.length}):
                    </div>
                    <div className="selected-tags">
                        {selectedCuisines.map(cuisine => (
                            <div key={cuisine} className="cuisine-tag">
                                <span>{cuisine}</span>
                                <button
                                    className="tag-remove"
                                    onClick={() => handleRemove(cuisine)}
                                    aria-label={`Remove ${cuisine} filter`}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button
                            className="clear-filters-btn"
                            onClick={handleClearAll}
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            )}

            {/* Filter Controls */}
            <div className="filter-controls">
                <button
                    className="filter-toggle"
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-expanded={isExpanded}
                >
                    <span className="filter-icon">🍽️</span>
                    <span className="filter-text">Cuisine Filters</span>
                    <span className={`expand-arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>
                </button>

                {isExpanded && (
                    <div className="filter-options">
                        {/* Popular Cuisines */}
                        <div className="filter-section">
                            <h4 className="section-title">Popular</h4>
                            <div className="checkbox-group">
                                {availableCuisines.slice(0, 4).map(cuisine => (
                                    <label key={cuisine} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={selectedCuisines.includes(cuisine)}
                                            onChange={() => handleCuisineChange(cuisine)}
                                            className="checkbox-input"
                                        />
                                        <span className="checkbox-text">{cuisine}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* All Cuisines */}
                        {availableCuisines.length > 4 && (
                            <div className="filter-section">
                                <h4 className="section-title">All Cuisines</h4>
                                <div className="checkbox-group">
                                    {availableCuisines.slice(4).map(cuisine => (
                                        <label key={cuisine} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={selectedCuisines.includes(cuisine)}
                                                onChange={() => handleCuisineChange(cuisine)}
                                                className="checkbox-input"
                                            />
                                            <span className="checkbox-text">{cuisine}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Select All / Clear */}
                        <div className="filter-actions">
                            <button
                                className="action-btn select-all-btn"
                                onClick={() => {
                                    setSelectedCuisines(availableCuisines);
                                    onFilter(availableCuisines);
                                }}
                            >
                                Select All
                            </button>
                            {selectedCuisines.length > 0 && (
                                <button
                                    className="action-btn clear-btn"
                                    onClick={handleClearAll}
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CuisineFilter;
