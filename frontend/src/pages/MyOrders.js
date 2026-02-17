import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/api';
import '../styles/Orders.css';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getMyOrders();
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderService.cancelOrder(orderId);
        setOrders(orders.map(o =>
          o._id === orderId ? { ...o, status: 'cancelled' } : o
        ));
      } catch (err) {
        setError('Failed to cancel order');
      }
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h1>My Orders</h1>
      {error && <div className="error-message">{error}</div>}
      {orders.length === 0 ? (
        <p>No orders yet. <Link to="/restaurants">Order from a restaurant</Link></p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className={`order-card status-${order.status}`}>
              <h2>{order.restaurantId.name}</h2>
              <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <div className="order-items">
                <strong>Items:</strong>
                <ul>
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.menuItemId?.name || 'Item'} x{item.quantity} - Rs. {item.price * item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="order-total"><strong>Total: Rs. {order.totalAmount}</strong></p>
              {order.status !== 'cancelled' && order.status !== 'completed' && (
                <button
                  onClick={() => handleCancel(order._id)}
                  className="btn btn-danger"
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
