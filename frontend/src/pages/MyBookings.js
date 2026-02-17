import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/api';
import '../styles/Bookings.css';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingService.getMyBookings();
        setBookings(response.data);
      } catch (err) {
        setError('Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancelBooking(bookingId);
        setBookings(bookings.map(b =>
          b._id === bookingId ? { ...b, status: 'cancelled' } : b
        ));
      } catch (err) {
        setError('Failed to cancel booking');
      }
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h1>My Bookings</h1>
      {error && <div className="error-message">{error}</div>}
      {bookings.length === 0 ? (
        <p>No bookings yet. <Link to="/restaurants">Browse restaurants</Link></p>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking._id} className={`booking-card status-${booking.status}`}>
              <h2>{booking.restaurantId.name}</h2>
              <p><strong>Date & Time:</strong> {new Date(booking.bookingDate).toLocaleString()}</p>
              <p><strong>Number of Guests:</strong> {booking.numberOfGuests}</p>
              <p><strong>Status:</strong> {booking.status}</p>
              {booking.specialRequests && (
                <p><strong>Special Requests:</strong> {booking.specialRequests}</p>
              )}
              {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                <button
                  onClick={() => handleCancel(booking._id)}
                  className="btn btn-danger"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
