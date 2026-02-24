import React, { useState, useEffect, useContext } from 'react';
import '../styles/Cart.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/userContext';

const Cart = () => {
  const navigate = useNavigate();
  const { backendUrl, token } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [token]);

  const fetchCart = async () => {
    try {
      const userId = JSON.parse(atob(token.split('.')[1])).id;
      const res = await axios.get(`${backendUrl}/api/user/cart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(res.data.cart.products.map(p => ({
        ...p.product,
        quantity: p.quantity
      })));
    } catch (err) {
      setCartItems([]);
    }
  };

  // Increase quantity
  const handleIncreaseQuantity = async (id) => {
    await updateCartQuantity(id, 1);
  };

  // Decrease quantity
  const handleDecreaseQuantity = async (id) => {
    await updateCartQuantity(id, -1);
  };

  // Remove item from cart
  const handleRemoveItem = async (id) => {
    await updateCartQuantity(id, 0, true);
  };

  const updateCartQuantity = async (productId, change, remove = false) => {
    try {
      const userId = JSON.parse(atob(token.split('.')[1])).id;
      await axios.post(`${backendUrl}/api/user/update-cart`, {
        userId,
        productId,
        change,
        remove
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
    } catch (err) {
      alert('Failed to update cart');
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calculate subtotal
  const subtotal = calculateTotal();
  const deliveryFee = subtotal > 0 ? 200 : 0; // Free delivery for orders over certain amount
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    // Navigate to payment page
    navigate('/payment', { state: { orderTotal: total, items: cartItems } });
  };

  const handleContinueShopping = () => {
    navigate('/menu');
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>🛒 Your Shopping Cart</h1>
        <p>Review your items before checkout</p>
      </div>

      <div className="cart-content">
        {cartItems.length > 0 ? (
          <>
            <div className="cart-items-section">
              <div className="items-list">
                {cartItems.map((item) => (
                  <div key={item._id || item.id} className="cart-item">
                    <div className="item-image-wrapper">
                      <div className="item-image placeholder">
                        <img src={item.image} alt={item.name} />
                        <span className="placeholder-text">[Image: {item.name}]</span>
                      </div>
                    </div>

                    <div className="item-details">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-category">{item.category}</p>
                      <p className="item-description">{item.description}</p>
                    </div>

                    <div className="item-price-section">
                      <span className="item-unit-price">KES {item.price}</span>
                      <span className="item-subtotal">
                        Subtotal: <strong>KES {(item.price * item.quantity).toLocaleString()}</strong>
                      </span>
                    </div>

                    <div className="quantity-control">
                      <button
                        className="qty-btn minus-btn"
                        onClick={() => handleDecreaseQuantity(item._id || item.id)}
                        disabled={item.quantity === 1}
                      >
                        −
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button
                        className="qty-btn plus-btn"
                        onClick={() => handleIncreaseQuantity(item._id || item.id)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveItem(item._id || item.id)}
                      title="Remove from cart"
                    >
                      🗑️ Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <aside className="cart-summary">
              <div className="summary-card">
                <h2>Order Summary</h2>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>KES {subtotal.toLocaleString()}</span>
                </div>

                <div className="summary-row">
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'free' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `KES ${deliveryFee}`}
                  </span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row total-row">
                  <span>Total Amount</span>
                  <span className="total-amount">KES {total.toLocaleString()}</span>
                </div>

                <div className="summary-info">
                  <p>✓ Items: {cartItems.length}</p>
                  <p>✓ Free delivery on orders above KES 2000</p>
                </div>

                <button className="checkout-btn" onClick={handleCheckout}>
                  💳 Proceed to Checkout
                </button>

                <button className="continue-shopping-btn" onClick={handleContinueShopping}>
                  ← Continue Shopping
                </button>
              </div>
            </aside>
          </>
        ) : (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any dishes yet</p>
            <button className="continue-shopping-btn" onClick={handleContinueShopping}>
              ← Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
