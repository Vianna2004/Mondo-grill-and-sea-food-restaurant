import React, { useState, useEffect } from 'react';
import '../styles/Payment.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderTotal = 0, items = [] } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  // M-Pesa Form State
  const [mpesaForm, setMpesaForm] = useState({
    phoneNumber: '',
    fullName: '',
    email: '',
  });

  // Bank Form State
  const [bankForm, setBankForm] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    email: '',
  });

  // Handle M-Pesa input changes
  const handleMpesaChange = (e) => {
    const { name, value } = e.target;
    setMpesaForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Bank input changes
  const handleBankChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cardNumber') {
      // Format card number with spaces
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setBankForm(prev => ({
        ...prev,
        [name]: formatted.slice(0, 19)
      }));
    } else if (name === 'expiryDate') {
      // Format expiry date MM/YY
      const formatted = value.replace(/\D/g, '').slice(0, 4);
      if (formatted.length >= 2) {
        setBankForm(prev => ({
          ...prev,
          [name]: `${formatted.slice(0, 2)}/${formatted.slice(2)}`
        }));
      } else {
        setBankForm(prev => ({
          ...prev,
          [name]: formatted
        }));
      }
    } else if (name === 'cvv') {
      setBankForm(prev => ({
        ...prev,
        [name]: value.slice(0, 3)
      }));
    } else {
      setBankForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Validate M-Pesa Form
  const validateMpesaForm = () => {
    if (!mpesaForm.phoneNumber) return 'Phone number is required';
    if (!/^(254|\+254|0)(7|1)\d{8}$/.test(mpesaForm.phoneNumber.replace(/\s/g, ''))) {
      return 'Enter a valid Kenyan phone number';
    }
    if (!mpesaForm.fullName) return 'Full name is required';
    if (!mpesaForm.email) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(mpesaForm.email)) return 'Enter a valid email';
    return '';
  };

  // Validate Bank Form
  const validateBankForm = () => {
    const cardNum = bankForm.cardNumber.replace(/\s/g, '');
    if (!cardNum || cardNum.length !== 16) return 'Enter a valid 16-digit card number';
    if (!bankForm.cardholderName) return 'Cardholder name is required';
    if (!bankForm.expiryDate || bankForm.expiryDate.length !== 5) return 'Enter a valid expiry date (MM/YY)';
    if (!bankForm.cvv || bankForm.cvv.length !== 3) return 'Enter a valid 3-digit CVV';
    if (!bankForm.email) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(bankForm.email)) return 'Enter a valid email';
    return '';
  };

  // Handle Payment Submission
  const handlePayment = async () => {
    let error = '';

    if (paymentMethod === 'mpesa') {
      error = validateMpesaForm();
    } else {
      error = validateBankForm();
    }

    if (error) {
      alert(error);
      return;
    }

    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      // Generate transaction ID
      const txnId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
      setTransactionId(txnId);
      setPaymentSuccess(true);
      setLoading(false);
    }, 2000);
  };

  // Handle Success - Continue or Back to Menu
  const handleContinue = () => {
    // Clear cart from localStorage
    localStorage.removeItem('cart');
    navigate('/menu');
  };

  const handleBackToCart = () => {
    navigate('/cart');
  };

  if (paymentSuccess) {
    return (
      <div className="payment-container">
        <div className="success-screen">
          <div className="success-animation">
            <div className="checkmark-circle">
              <svg className="checkmark" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="25" fill="none" />
                <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <h1 className="success-title">Payment Successful! 🎉</h1>
          <p className="success-subtitle">Your order has been confirmed</p>

          <div className="confirmation-details">
            <div className="detail-row">
              <span className="detail-label">Transaction ID:</span>
              <span className="detail-value">{transactionId}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Payment Method:</span>
              <span className="detail-value">
                {paymentMethod === 'mpesa' ? 'M-Pesa' : 'Bank Card'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Amount Paid:</span>
              <span className="detail-value highlight">KES {orderTotal.toLocaleString()}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Items:</span>
              <span className="detail-value">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
            </div>
          </div>

          <div className="confirmation-message">
            <p>A confirmation email has been sent to you. Your order will be delivered shortly.</p>
          </div>

          <div className="success-actions">
            <button className="continue-btn" onClick={handleContinue}>
              ← Back to Menu
            </button>
            <button 
              className="myorder-btn"
              onClick={() => navigate('/my-order')}
            >
              📦 View My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>💳 Payment</h1>
        <p>Complete your order securely</p>
      </div>

      <div className="payment-content">
        {/* Payment Summary */}
        <aside className="payment-summary">
          <div className="summary-card">
            <h2>Order Summary</h2>
            <div className="items-preview">
              {items.length > 0 ? (
                <>
                  {items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="item-preview-row">
                      <span>{item.name} × {item.quantity}</span>
                      <span>KES {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <div className="item-preview-row muted">
                      <span>+{items.length - 3} more items</span>
                    </div>
                  )}
                </>
              ) : (
                <p className="no-items">No items in order</p>
              )}
            </div>
            <div className="summary-divider"></div>
            <div className="summary-total">
              <span>Total Amount:</span>
              <span className="total-amount">KES {orderTotal.toLocaleString()}</span>
            </div>
          </div>
        </aside>

        {/* Payment Form */}
        <main className="payment-form-section">
          {/* Payment Method Selection */}
          <div className="payment-methods">
            <h2>Select Payment Method</h2>
            <div className="method-cards">
              <div
                className={`method-card ${paymentMethod === 'mpesa' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('mpesa')}
              >
                <input
                  type="radio"
                  name="payment-method"
                  value="mpesa"
                  checked={paymentMethod === 'mpesa'}
                  onChange={() => setPaymentMethod('mpesa')}
                />
                <div className="method-content">
                  <div className="method-icon">📱</div>
                  <div className="method-info">
                    <h3>M-Pesa</h3>
                    <p>Pay via M-Pesa mobile payment</p>
                  </div>
                </div>
              </div>

              <div
                className={`method-card ${paymentMethod === 'bank' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('bank')}
              >
                <input
                  type="radio"
                  name="payment-method"
                  value="bank"
                  checked={paymentMethod === 'bank'}
                  onChange={() => setPaymentMethod('bank')}
                />
                <div className="method-content">
                  <div className="method-icon">🏦</div>
                  <div className="method-info">
                    <h3>Bank Card</h3>
                    <p>Pay via Debit or Credit Card</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* M-Pesa Form */}
          {paymentMethod === 'mpesa' && (
            <div className="payment-form mpesa-form">
              <h3>M-Pesa Payment Details</h3>
              <form>
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number *</label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    name="phoneNumber"
                    placeholder="e.g., 0712345678 or +254712345678"
                    value={mpesaForm.phoneNumber}
                    onChange={handleMpesaChange}
                    required
                  />
                  <small>Valid Kenyan mobile number</small>
                </div>

                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    placeholder="Your full name"
                    value={mpesaForm.fullName}
                    onChange={handleMpesaChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={mpesaForm.email}
                    onChange={handleMpesaChange}
                    required
                  />
                </div>

                <div className="form-info">
                  <p>ℹ️ After clicking "Pay Now", you'll receive an M-Pesa prompt on your phone to complete the payment.</p>
                </div>
              </form>
            </div>
          )}

          {/* Bank Card Form */}
          {paymentMethod === 'bank' && (
            <div className="payment-form bank-form">
              <h3>Bank Card Details</h3>
              <form>
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number *</label>
                  <input
                    id="cardNumber"
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={bankForm.cardNumber}
                    onChange={handleBankChange}
                    maxLength="19"
                    required
                  />
                  <small>16-digit card number</small>
                </div>

                <div className="form-group">
                  <label htmlFor="cardholderName">Cardholder Name *</label>
                  <input
                    id="cardholderName"
                    type="text"
                    name="cardholderName"
                    placeholder="Name on card"
                    value={bankForm.cardholderName}
                    onChange={handleBankChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date *</label>
                    <input
                      id="expiryDate"
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={bankForm.expiryDate}
                      onChange={handleBankChange}
                      required
                    />
                    <small>MM/YY format</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="cvv">CVV *</label>
                    <input
                      id="cvv"
                      type="text"
                      name="cvv"
                      placeholder="123"
                      value={bankForm.cvv}
                      onChange={handleBankChange}
                      maxLength="3"
                      required
                    />
                    <small>3-digit code</small>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="bankEmail">Email Address *</label>
                  <input
                    id="bankEmail"
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={bankForm.email}
                    onChange={handleBankChange}
                    required
                  />
                </div>

                <div className="form-info">
                  <p>ℹ️ This is a simulated payment for demonstration purposes. Your card details are safe.</p>
                </div>
              </form>
            </div>
          )}

          {/* Action Buttons */}
          <div className="payment-actions">
            <button
              className="pay-btn"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Processing...
                </>
              ) : (
                `💳 Pay Now - KES ${orderTotal.toLocaleString()}`
              )}
            </button>
            <button
              className="cancel-btn"
              onClick={handleBackToCart}
              disabled={loading}
            >
              ← Back to Cart
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Payment;
