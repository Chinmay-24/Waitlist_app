import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantService, menuService, bookingService, orderService } from '../services/api';
import { useAuth } from '../services/AuthContext';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import FavoriteButton from '../components/FavoriteButton';
import ShareButton from '../components/ShareButton';
import Button from '../components/Button';
import { favoritesService } from '../services/api';
import '../styles/RestaurantDetail.css';

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [refreshReviews, setRefreshReviews] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const restResponse = await restaurantService.getById(id);
        setRestaurant(restResponse.data);

        const menuResponse = await menuService.getMenuItems(id);
        setMenuItems(menuResponse.data);

        try {
          const favResponse = await favoritesService.getFavorites();
          setIsFavorite(favResponse.data.some(fav => fav._id === id));
        } catch (e) {
          console.error("Error fetching favorites", e);
        }
      } catch (err) {
        setError('Failed to fetch restaurant details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isAuthenticated, navigate]);

  const addToCart = (item) => {
    const existingItem = cart.find(c => c._id === item._id);
    if (existingItem) {
      setCart(cart.map(c =>
        c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(c => c._id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(c =>
        c._id === itemId ? { ...c, quantity } : c
      ));
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const bookingResponse = await bookingService.createBooking({
        restaurantId: id,
        bookingDate,
        numberOfGuests,
        specialRequests
      });

      if (cart.length > 0) {
        const items = cart.map(item => ({
          menuItemId: item._id,
          quantity: item.quantity,
          price: item.price
        }));

        await orderService.createOrder({
          restaurantId: id,
          bookingId: bookingResponse.data._id,
          items
        });

        setCart([]);
      }

      navigate('/bookings');
    } catch (err) {
      setError('Failed to create booking');
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container error-message">{error}</div>;
  if (!restaurant) return <div className="container">Restaurant not found</div>;

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="container restaurant-detail">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>{restaurant.name}</h1>
        <div className="action-buttons d-flex gap-2">
          <ShareButton url={window.location.href} />
          <FavoriteButton
            restaurantId={id}
            initialIsFavorite={isFavorite}
            onToggle={setIsFavorite}
          />
        </div>
      </div>
      <p>{restaurant.description}</p>
      <div className="restaurant-info">
        <p><strong>Address:</strong> {restaurant.address}</p>
        <p><strong>Phone:</strong> {restaurant.phone}</p>
        <p><strong>Cuisine:</strong> {restaurant.cuisine?.join(', ')}</p>
      </div>

      <div className="detail-content">
        <div className="menu-section">
          <h2>Menu</h2>
          <div className="menu-items">
            {menuItems.map((item) => (
              <div key={item._id} className="menu-item">
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <p><strong>Category:</strong> {item.category}</p>
                  <p className="price">Rs. {item.price}</p>
                </div>
                <Button
                  onClick={() => addToCart(item)}
                  disabled={!item.available}
                  variant={item.available ? 'primary' : 'secondary'}
                  size="small"
                >
                  {item.available ? 'Add to Cart' : 'Unavailable'}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="booking-section">
          <h2>Order & Booking</h2>
          {cart.length > 0 && (
            <div className="cart">
              <h3>Your Order</h3>
              {cart.map((item) => (
                <div key={item._id} className="cart-item">
                  <span>{item.name}</span>
                  <div className="quantity-control">
                    <Button variant="ghost" size="small" onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</Button>
                    <span>{item.quantity}</span>
                    <Button variant="ghost" size="small" onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</Button>
                  </div>
                  <span>Rs. {item.price * item.quantity}</span>
                  <Button variant="danger" size="small" onClick={() => removeFromCart(item._id)}>Remove</Button>
                </div>
              ))}
              <div className="cart-total">
                <strong>Total: Rs. {cartTotal}</strong>
              </div>
            </div>
          )}

          <Button
            onClick={() => setShowBooking(!showBooking)}
            variant="primary"
            className="w-100 mb-3"
          >
            {showBooking ? 'Hide Booking' : 'Book a Table'}
          </Button>

          {showBooking && (
            <form onSubmit={handleBooking} className="booking-form">
              <input
                type="datetime-local"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                required
              />
              <input
                type="number"
                min="1"
                value={numberOfGuests}
                onChange={(e) => setNumberOfGuests(Number(e.target.value))}
                placeholder="Number of guests"
                required
              />
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Special requests (optional)"
              />
              <Button type="submit" variant="success" className="w-100">
                Confirm Booking {cart.length > 0 && '& Order'}
              </Button>
            </form>
          )}
        </div>
      </div>

      <div className="reviews-section mt-5">
        <ReviewForm restaurantId={id} onReviewAdded={() => setRefreshReviews(c => c + 1)} />
        <ReviewList restaurantId={id} refreshTrigger={refreshReviews} />
      </div>
    </div>
  );
}
