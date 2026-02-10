import React, { useState, useEffect } from 'react';
import '../styles/MyOrder.css';
import { useNavigate } from 'react-router-dom';

const MyOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('orders');
      const savedDelivered = localStorage.getItem('deliveredOrders');

      if (savedDelivered) {
        setDeliveredOrders(JSON.parse(savedDelivered));
      }

      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        // Mock orders data
        const mockOrders = [
          {
            id: 'ORD-001',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            status: 'Out for Delivery',
            items: [
              { name: 'Grilled Tilapia', quantity: 2, price: 850 },
              { name: 'Mango Juice', quantity: 1, price: 150 }
            ],
            total: 1850,
            estimatedTime: '14:30 - 15:00'
          },
          {
            id: 'ORD-002',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            status: 'Delivered',
            items: [
              { name: 'Calamari Rings', quantity: 1, price: 450 },
              { name: 'Prawn Skewers', quantity: 1, price: 550 }
            ],
            total: 1000,
            estimatedTime: 'Delivered'
          },
          {
            id: 'ORD-003',
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            status: 'Preparing',
            items: [
              { name: 'Mombasa Seafood Platter', quantity: 1, price: 1200 },
              { name: 'Coconut Water', quantity: 2, price: 120 }
            ],
            total: 1440,
            estimatedTime: '18:00 - 18:30'
          },
          {
            id: 'ORD-004',
            date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            status: 'Delivered',
            items: [
              { name: 'Pan-Seared Snapper', quantity: 1, price: 920 },
              { name: 'Fresh Fruit Salad', quantity: 1, price: 250 }
            ],
            total: 1170,
            estimatedTime: 'Delivered'
          }
        ];

        setOrders(mockOrders);
        localStorage.setItem('orders', JSON.stringify(mockOrders));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading orders:', error);
      setLoading(false);
    }
  }, []);

  // Save delivered orders to localStorage
  useEffect(() => {
    localStorage.setItem('deliveredOrders', JSON.stringify(deliveredOrders));
  }, [deliveredOrders]);

  // Mark order as delivered
  const handleMarkDelivered = (orderId) => {
    // Add to delivered list
    if (!deliveredOrders.includes(orderId)) {
      setDeliveredOrders([...deliveredOrders, orderId]);
    }

    // Update order status
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: 'Delivered', estimatedTime: 'Delivered' }
        : order
    ));
  };

  // Filter orders based on active tab
  const getFilteredOrders = () => {
    let filtered = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (activeTab === 'active') {
      filtered = filtered.filter(order => order.status !== 'Delivered');
    } else if (activeTab === 'history') {
      filtered = filtered.filter(order => order.status === 'Delivered');
    }

    return filtered;
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Preparing':
        return 'status-preparing';
      case 'Out for Delivery':
        return 'status-delivery';
      case 'Delivered':
        return 'status-delivered';
      default:
        return 'status-pending';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Preparing':
        return '👨‍🍳';
      case 'Out for Delivery':
        return '🚚';
      case 'Delivered':
        return '✓';
      default:
        return '⏱️';
    }
  };

  const filteredOrders = getFilteredOrders();

  if (loading) {
    return (
      <div className="myorder-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="myorder-container">
      <div className="myorder-header">
        <h1>📦 My Orders</h1>
        <p>Track your orders and manage deliveries</p>
      </div>

      {/* Tabs */}
      <div className="order-tabs">
        <button
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Orders ({orders.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active ({orders.filter(o => o.status !== 'Delivered').length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Delivered ({orders.filter(o => o.status === 'Delivered').length})
        </button>
      </div>

      {/* Orders List */}
      <div className="orders-container">
        {filteredOrders.length > 0 ? (
          <>
            {filteredOrders.map((order) => (
              <div key={order.id} className="order-card">
                {/* Order Header */}
                <div className="order-header-row">
                  <div className="order-meta">
                    <h3 className="order-id">{order.id}</h3>
                    <span className="order-date">
                      {new Date(order.date).toLocaleDateString('en-KE', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })} at {new Date(order.date).toLocaleTimeString('en-KE', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <span className={`status-badge ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)} {order.status}
                  </span>
                </div>

                {/* Timeline/Progress */}
                {order.status !== 'Delivered' && (
                  <div className="order-timeline">
                    <div className="timeline-item completed">
                      <div className="timeline-dot">✓</div>
                      <span>Order Placed</span>
                    </div>
                    <div className={`timeline-item ${order.status === 'Preparing' ? 'active' : 'completed'}`}>
                      <div className="timeline-dot">👨‍🍳</div>
                      <span>Preparing</span>
                    </div>
                    <div className={`timeline-item ${order.status === 'Out for Delivery' ? 'active' : ''}`}>
                      <div className="timeline-dot">🚚</div>
                      <span>Out for Delivery</span>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-dot">📦</div>
                      <span>Delivered</span>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="order-items">
                  <h4>Order Items</h4>
                  <div className="items-list">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="item-row">
                        <span className="item-name">
                          {item.name} <span className="item-qty">× {item.quantity}</span>
                        </span>
                        <span className="item-price">KES {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="order-footer">
                  <div className="order-total">
                    <span>Total Amount:</span>
                    <span className="total-price">KES {order.total.toLocaleString()}</span>
                  </div>

                  <div className="delivery-info">
                    <span className="estimated-time">
                      ⏱️ {order.estimatedTime}
                    </span>
                  </div>

                  {/* Delivery Confirmation Button */}
                  <div className="order-actions">
                    {order.status === 'Out for Delivery' && !deliveredOrders.includes(order.id) ? (
                      <button
                        className="deliver-btn"
                        onClick={() => handleMarkDelivered(order.id)}
                      >
                        ✓ Mark as Delivered
                      </button>
                    ) : order.status === 'Delivered' ? (
                      <div className="delivered-badge">
                        <span>✓ Delivered</span>
                        <span className="delivered-date">
                          {new Date(order.date).toLocaleDateString('en-KE', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })} at {new Date(order.date).toLocaleTimeString('en-KE', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping Button */}
            <div className="continue-shopping-section">
              <button
                className="continue-shopping-btn"
                onClick={() => navigate('/menu')}
              >
                🍽️ Continue Shopping
              </button>
            </div>
          </>
        ) : (
          <div className="empty-orders">
            <div className="empty-icon">📦</div>
            <h2>No {activeTab === 'active' ? 'active ' : activeTab === 'history' ? 'delivered ' : ''}orders yet</h2>
            <p>Start ordering your favorite seafood dishes</p>
            <button
              className="start-ordering-btn"
              onClick={() => navigate('/menu')}
            >
              🛒 Start Ordering
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrder;
