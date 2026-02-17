import React, { useEffect, useState } from 'react';
import { favoritesService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const response = await favoritesService.getFavorites();
                setFavorites(response.data);
            } catch (error) {
                console.error('Failed to load favorites', error);
            } finally {
                setLoading(false);
            }
        };
        loadFavorites();
    }, []);

    if (loading) return <div className="container mt-5">Loading favorites...</div>;

    return (
        <div className="container mt-4">
            <h2>My Favorites ❤️</h2>
            {favorites.length === 0 ? (
                <div className="alert alert-info mt-3">
                    No favorites yet. Go explore restaurants and mark them as favorites!
                    <button className="btn btn-primary d-block mt-2" onClick={() => navigate('/restaurants')}>
                        Browse Restaurants
                    </button>
                </div>
            ) : (
                <div className="row mt-4">
                    {favorites.map(rest => (
                        <div key={rest._id} className="col-md-4 mb-4">
                            <div className="card h-100" onClick={() => navigate(`/restaurant/${rest._id}`)} style={{ cursor: 'pointer' }}>
                                <div className="card-body">
                                    <h5 className="card-title">{rest.name}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">{rest.cuisine.join(', ')}</h6>
                                    <p className="card-text">{rest.description}</p>
                                    <p className="card-text"><small className="text-muted">{rest.address}</small></p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;
