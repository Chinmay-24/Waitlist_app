import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import '../styles/Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Butter Chicken', quantity: 2, price: 350, restaurant: 'Taj Cuisine' },
    { id: 2, name: 'Biryani Rice', quantity: 1, price: 280, restaurant: 'Taj Cuisine' },
    { id: 3, name: 'Garlic Naan', quantity: 3, price: 80, restaurant: 'Taj Cuisine' },
  ]);

  const [deliveryType, setDeliveryType] = useState('delivery'); // delivery or pickup
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [userDetails, setUserDetails] = useState({
    address: '123 Main Street, Bangalore',
    phone: user?.phone || '',
    instructions: ''
  });
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    const subtotal = calculateSubtotal();
    if (appliedPromo.type === 'percentage') {
      return Math.floor(subtotal * (appliedPromo.value / 100));
    }
    return appliedPromo.value;
  };

  const calculateDeliveryCharge = () => {
    if (deliveryType === 'pickup') return 0;
    const subtotal = calculateSubtotal();
    return subtotal > 500 ? 0 : 50; // Free delivery above 500
  };

  const calculateTax = () => {
    const subtotalAfterDiscount = calculateSubtotal() - calculateDiscount();
    return Math.floor(subtotalAfterDiscount * 0.05); // 5% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateDeliveryCharge() + calculateTax();
  };

  const handleApplyPromo = () => {
    const promoCodes = {
      'SAVE10': { type: 'percentage', value: 10, label: '10% OFF' },
      'SAVE50': { type: 'flat', value: 50, label: '₹50 OFF' },
      'FREE': { type: 'flat', value: 0, label: 'Free Delivery' },
    };

    if (promoCodes[promoCode.toUpperCase()]) {
      setAppliedPromo({
        code: promoCode.toUpperCase(),
        ...promoCodes[promoCode.toUpperCase()]
      });
      setPromoCode('');
    } else {
      alert('Invalid promo code');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
    } else {
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handlePlaceOrder = async () => {
    if (!agreeTerms) {
      alert('Please agree to terms and conditions');
      return;
    }

    setProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setOrderPlaced(true);
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    } catch (error) {
      alert('Failed to place order: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="checkout-success">
        <div className="success-content">
          <div className="success-icon">✓</div>
          <h1>Order Placed Successfully!</h1>
          <p>Your order has been confirmed and will be prepared soon.</p>
          <div className="order-details-summary">
            <p><strong>Order Total:</strong> ₹{calculateTotal()}</p>
            <p><strong>Delivery Type:</strong> {deliveryType === 'delivery' ? 'Home Delivery' : 'Pickup'}</p>
            <p><strong>Estimated Time:</strong> 30-45 minutes</p>
          </div>
          <button className="btn-track" onClick={() => navigate('/orders')}>
            Track Your Order →
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-content">
          <div className="empty-icon">🛒</div>
          <h1>Your Cart is Empty</h1>
          <p>Start adding items to your cart</p>
          <button className="btn-continue-shopping" onClick={() => navigate('/restaurants')}>
            🏪 Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-wrapper">
      <div className="checkout-header">
        <h1>🛒 Checkout</h1>
        <p>Review your order and complete payment</p>
      </div>

      <div className="checkout-content">
        {/* Main Checkout Area */}
        <div className="checkout-main">
          {/* Order Items */}
          <section className="checkout-section">
            <h2>📦 Order Items</h2>
            <div className="order-items">
              {cartItems.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p className="item-restaurant">{item.restaurant}</p>
                  </div>

                  <div className="item-controls">
                    <button 
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <input 
                      type="number" 
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                      className="qty-input"
                    />
                    <button 
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-price">₹{item.price * item.quantity}</div>

                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item.id)}
                    title="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Delivery Type */}
          <section className="checkout-section">
            <h2>🚚 Delivery Type</h2>
            <div className="delivery-options">
              <label className="delivery-option">
                <input 
                  type="radio" 
                  name="delivery"
                  value="delivery"
                  checked={deliveryType === 'delivery'}
                  onChange={(e) => setDeliveryType(e.target.value)}
                />
                <span className="option-label">
                  <span className="option-icon">🚗</span>
                  <span className="option-text">
                    <strong>Home Delivery</strong>
                    <small>Delivered to your address</small>
                  </span>
                </span>
              </label>

              <label className="delivery-option">
                <input 
                  type="radio" 
                  name="delivery"
                  value="pickup"
                  checked={deliveryType === 'pickup'}
                  onChange={(e) => setDeliveryType(e.target.value)}
                />
                <span className="option-label">
                  <span className="option-icon">🏪</span>
                  <span className="option-text">
                    <strong>Pickup</strong>
                    <small>Pick up from restaurant</small>
                  </span>
                </span>
              </label>
            </div>
          </section>

          {/* Delivery Address */}
          {deliveryType === 'delivery' && (
            <section className="checkout-section">
              <h2>📍 Delivery Address</h2>
              <div className="address-form">
                <div className="form-group">
                  <label>Delivery Address</label>
                  <input 
                    type="text"
                    value={userDetails.address}
                    onChange={(e) => setUserDetails({...userDetails, address: e.target.value})}
                    placeholder="Enter delivery address"
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel"
                    value={userDetails.phone}
                    onChange={(e) => setUserDetails({...userDetails, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="form-group">
                  <label>Special Instructions (Optional)</label>
                  <textarea 
                    value={userDetails.instructions}
                    onChange={(e) => setUserDetails({...userDetails, instructions: e.target.value})}
                    placeholder="e.g., Ring bell twice, Use side entrance..."
                    rows="3"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Promo Code */}
          <section className="checkout-section">
            <h2>🎁 Promo Code</h2>
            {appliedPromo ? (
              <div className="promo-applied">
                <div className="promo-info">
                  <span className="promo-label">{appliedPromo.label}</span>
                  <span className="promo-code">{appliedPromo.code}</span>
                </div>
                <button className="remove-promo" onClick={handleRemovePromo}>✕</button>
              </div>
            ) : (
              <div className="promo-input-group">
                <input 
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter promo code (SAVE10, SAVE50, FREE)"
                  className="promo-input"
                />
                <button className="btn-apply-promo" onClick={handleApplyPromo}>
                  Apply
                </button>
              </div>
            )}
            <p className="promo-hint">Available codes: SAVE10, SAVE50, FREE</p>
          </section>

          {/* Payment Method */}
          <section className="checkout-section">
            <h2>💳 Payment Method</h2>
            <div className="payment-options">
              <label className="payment-option">
                <input 
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="option-label">
                  <span className="option-icon">💳</span>
                  <span>Debit/Credit Card</span>
                </span>
              </label>

              <label className="payment-option">
                <input 
                  type="radio"
                  name="payment"
                  value="wallet"
                  checked={paymentMethod === 'wallet'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="option-label">
                  <span className="option-icon">📱</span>
                  <span>Digital Wallet</span>
                </span>
              </label>

              <label className="payment-option">
                <input 
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="option-label">
                  <span className="option-icon">💵</span>
                  <span>Cash on Delivery</span>
                </span>
              </label>

              <label className="payment-option">
                <input 
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="option-label">
                  <span className="option-icon">🔐</span>
                  <span>UPI/NetBanking</span>
                </span>
              </label>
            </div>
          </section>

          {/* Terms & Conditions */}
          <section className="checkout-section">
            <label className="terms-checkbox">
              <input 
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span>I agree to terms and conditions and privacy policy</span>
            </label>
          </section>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="order-summary">
          <h2>Order Summary</h2>

          <div className="summary-items">
            <div className="summary-item">
              <span>Subtotal</span>
              <span>₹{calculateSubtotal()}</span>
            </div>

            {appliedPromo && (
              <div className="summary-item discount">
                <span>Discount ({appliedPromo.label})</span>
                <span>−₹{calculateDiscount()}</span>
              </div>
            )}

            {deliveryType === 'delivery' && calculateDeliveryCharge() > 0 && (
              <div className="summary-item">
                <span>Delivery Charge</span>
                <span>₹{calculateDeliveryCharge()}</span>
              </div>
            )}

            {deliveryType === 'delivery' && calculateDeliveryCharge() === 0 && (
              <div className="summary-item free">
                <span>Delivery Charge</span>
                <span>FREE</span>
              </div>
            )}

            <div className="summary-item">
              <span>Tax (5%)</span>
              <span>₹{calculateTax()}</span>
            </div>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-total">
            <span>Total Amount</span>
            <span className="total-price">₹{calculateTotal()}</span>
          </div>

          <div className="delivery-info">
            {deliveryType === 'delivery' ? (
              <>
                <p>🚚 Estimated delivery in <strong>30-45 minutes</strong></p>
                {calculateDeliveryCharge() === 0 && (
                  <p className="free-delivery">✓ Free delivery on this order</p>
                )}
              </>
            ) : (
              <p>🏪 Pick up in <strong>20-30 minutes</strong></p>
            )}
          </div>

          <button 
            className="btn-place-order"
            onClick={handlePlaceOrder}
            disabled={processing || !agreeTerms}
          >
            {processing ? 'Processing...' : `Place Order • ₹${calculateTotal()}`}
          </button>

          <button 
            className="btn-continue-order"
            onClick={() => navigate('/restaurants')}
          >
            Continue Shopping
          </button>
        </aside>
      </div>
    </div>
  );
}
