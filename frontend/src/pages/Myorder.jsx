import React, { useState, useEffect, useContext } from 'react';
import '../styles/MyOrder.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { UserContext } from '../context/userContext';

const MyOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const { backendUrl } = useContext(UserContext);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userEmail = user.email || '';

  useEffect(() => {
    let socket;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        if (!userEmail) {
          setOrders([]);
          setLoading(false);
          return;
        }
        const res = await axios.get(`${backendUrl}/api/order/user/${encodeURIComponent(userEmail)}`);
        setOrders(res.data.orders || []);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load orders', err);
        setLoading(false);
      }
    };

    fetchOrders();

    try {
      socket = io(backendUrl);
      socket.on('newOrder', (order) => {
        if (order.customerEmail === userEmail) {
          setOrders(prev => [order, ...prev]);
        }
      });
      socket.on('orderUpdated', (order) => {
        if (order.customerEmail === userEmail) {
          setOrders(prev => prev.map(o => (o._id === order._id ? order : o)));
        }
      });
    } catch (e) {
      console.warn('Socket connection failed', e);
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [backendUrl, userEmail]);

  // Mark order as delivered (customer action)
  const handleMarkDelivered = async (orderId) => {
    try {
      await axios.put(`${backendUrl}/api/order/${orderId}/status`, { status: 'Delivered' });
    } catch (err) {
      console.error('Failed to mark delivered', err);
    }
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
              <div key={order._id} className="order-card">
                {/* Order Header */}
                <div className="order-header-row">
                  <div className="order-meta">
                    <h3 className="order-id">{order._id}</h3>
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
                    {order.status === 'Out for Delivery' ? (
                      <button
                        className="deliver-btn"
                        onClick={() => handleMarkDelivered(order._id)}
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
