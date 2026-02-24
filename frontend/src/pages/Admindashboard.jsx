import React, { useState, useEffect } from 'react';
import '../styles/AdminDashboard.css';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    preparingOrders: 0,
    deliveryOrders: 0,
    deliveredOrders: 0,
    totalUsers: 0
  });

  // Initialize data from localStorage
  useEffect(() => {
    loadOrders();
    loadUsers();
  }, []);

  const loadOrders = () => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const ordersList = JSON.parse(savedOrders);
      setOrders(ordersList);
      calculateStats(ordersList, users);
    } else {
      // Create mock orders if none exist
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
          estimatedTime: '14:30 - 15:00',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerPhone: '0712345678'
        },
        {
          id: 'ORD-002',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          status: 'Preparing',
          items: [
            { name: 'Mombasa Seafood Platter', quantity: 1, price: 1200 }
          ],
          total: 1200,
          estimatedTime: '18:00 - 18:30',
          customerName: 'Jane Smith',
          customerEmail: 'jane@example.com',
          customerPhone: '0723456789'
        },
        {
          id: 'ORD-003',
          date: new Date(Date.now() - 30 * 60 * 1000),
          status: 'Pending',
          items: [
            { name: 'Calamari Rings', quantity: 1, price: 450 },
            { name: 'Fresh Mango Juice', quantity: 2, price: 150 }
          ],
          total: 750,
          estimatedTime: '15:30 - 16:00',
          customerName: 'Mike Johnson',
          customerEmail: 'mike@example.com',
          customerPhone: '0734567890'
        },
        {
          id: 'ORD-004',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          status: 'Delivered',
          items: [
            { name: 'Pan-Seared Snapper', quantity: 1, price: 920 }
          ],
          total: 920,
          estimatedTime: 'Delivered',
          customerName: 'Sarah Williams',
          customerEmail: 'sarah@example.com',
          customerPhone: '0745678901'
        }
      ];
      setOrders(mockOrders);
      localStorage.setItem('orders', JSON.stringify(mockOrders));
      calculateStats(mockOrders, users);
    }
  };

  const loadUsers = () => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      const usersList = JSON.parse(savedUsers);
      setUsers(usersList);
    } else {
      // Create mock users
      const mockUsers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '0712345678',
          registeredDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          status: 'active',
          totalOrders: 5,
          totalSpent: 8500
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '0723456789',
          registeredDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          status: 'active',
          totalOrders: 3,
          totalSpent: 4200
        },
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike@example.com',
          phone: '0734567890',
          registeredDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          status: 'active',
          totalOrders: 1,
          totalSpent: 750
        },
        {
          id: 4,
          name: 'Sarah Williams',
          email: 'sarah@example.com',
          phone: '0745678901',
          registeredDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          status: 'suspended',
          totalOrders: 8,
          totalSpent: 12300
        }
      ];
      setUsers(mockUsers);
      localStorage.setItem('users', JSON.stringify(mockUsers));
    }
  };

  const calculateStats = (ordersList, usersList) => {
    const stats = {
      totalOrders: ordersList.length,
      pendingOrders: ordersList.filter(o => o.status === 'Pending').length,
      preparingOrders: ordersList.filter(o => o.status === 'Preparing').length,
      deliveryOrders: ordersList.filter(o => o.status === 'Out for Delivery').length,
      deliveredOrders: ordersList.filter(o => o.status === 'Delivered').length,
      totalUsers: usersList.length
    };
    setStats(stats);
  };

  // Update order status
  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    calculateStats(updatedOrders, users);
  };

  // Toggle user suspension
  const toggleUserStatus = (userId) => {
    const updatedUsers = users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' }
        : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'status-pending';
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return '⏳';
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

  return (
    <div className="admin-container">
      {/* Admin Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>👨‍💼 Admin Dashboard</h1>
          {/* <button onClick={() => navigate('/add-products')} className="p-10 rounded full bg-blue-800 text-white font-semibold hover:scale-105 cursor-pointer">Add Product</button> */}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <span className="stat-label">Total Orders</span>
            <span className="stat-value">{stats.totalOrders}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{stats.pendingOrders}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍🍳</div>
          <div className="stat-info">
            <span className="stat-label">Preparing</span>
            <span className="stat-value">{stats.preparingOrders}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚚</div>
          <div className="stat-info">
            <span className="stat-label">Out for Delivery</span>
            <span className="stat-value">{stats.deliveryOrders}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-info">
            <span className="stat-label">Delivered</span>
            <span className="stat-value">{stats.deliveredOrders}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-label">Total Users</span>
            <span className="stat-value">{stats.totalUsers}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📋 Order Management
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 User Management
        </button>
        <button
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          🍽️ Product Management
        </button>
      </div>

      {/* Tab Content */}
      <div className="admin-content">
        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="orders-management">
            <h2>Order Management</h2>
            <div className="orders-grid">
              {orders.length > 0 ? (
                orders.map(order => (
                  <div key={order.id} className="order-card-admin">
                    <div className="order-header-admin">
                      <span className="order-id-admin">{order.id}</span>
                      <span className={`status-badge ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)} {order.status}
                      </span>
                    </div>

                    <div className="order-customer-info">
                      <p><strong>Customer:</strong> {order.customerName}</p>
                      <p><strong>Email:</strong> {order.customerEmail}</p>
                      <p><strong>Phone:</strong> {order.customerPhone}</p>
                    </div>

                    <div className="order-items-admin">
                      <strong>Items:</strong>
                      {order.items.map((item, idx) => (
                        <p key={idx}>
                          {item.name} × {item.quantity} - KES {(item.price * item.quantity).toLocaleString()}
                        </p>
                      ))}
                    </div>

                    <div className="order-total-admin">
                      <strong>Total: KES {order.total.toLocaleString()}</strong>
                    </div>

                    <div className="order-actions-admin">
                      {order.status !== 'Delivered' && (
                        <>
                          {order.status === 'Pending' && (
                            <button
                              className="action-btn preparing"
                              onClick={() => updateOrderStatus(order.id, 'Preparing')}
                            >
                              👨‍🍳 Start Preparing
                            </button>
                          )}
                          {order.status === 'Preparing' && (
                            <button
                              className="action-btn delivery"
                              onClick={() => updateOrderStatus(order.id, 'Out for Delivery')}
                            >
                              🚚 Send to Delivery
                            </button>
                          )}
                          {order.status === 'Out for Delivery' && (
                            <button
                              className="action-btn delivered"
                              onClick={() => updateOrderStatus(order.id, 'Delivered')}
                            >
                              ✓ Mark Delivered
                            </button>
                          )}
                        </>
                      )}
                      {order.status === 'Delivered' && (
                        <span className="status-static">✓ Order Delivered</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">No orders found</p>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="users-management">
            <h2>User Management</h2>
            <div className="users-table">
              <div className="table-header">
                <div className="col">Name</div>
                <div className="col">Email</div>
                <div className="col">Phone</div>
                <div className="col">Orders</div>
                <div className="col">Spent</div>
                <div className="col">Status</div>
                <div className="col">Action</div>
              </div>
              {users.length > 0 ? (
                users.map(user => (
                  <div key={user.id} className="table-row">
                    <div className="col">{user.name}</div>
                    <div className="col">{user.email}</div>
                    <div className="col">{user.phone}</div>
                    <div className="col">{user.totalOrders}</div>
                    <div className="col">KES {user.totalSpent.toLocaleString()}</div>
                    <div className="col">
                      <span className={`user-status ${user.status}`}>
                        {user.status === 'active' ? '✓ Active' : '⛔ Suspended'}
                      </span>
                    </div>
                    <div className="col action-col">
                      <button
                        className={`toggle-btn ${user.status}`}
                        onClick={() => toggleUserStatus(user.id)}
                      >
                        {user.status === 'active' ? 'Suspend' : 'Reactivate'}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">No users found</div>
              )}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="products-management">
            <h2>Product Management</h2>
            <div className="product-actions">
              <button
                className="add-product-btn"
                onClick={() => navigate('/add-products')}
              >
                ➕ Add New Product
              </button>
            </div>
            <div className="products-list">
              {/* Here you can list existing products, but for now, just the add button */}
              <p>Manage your products here. Click "Add New Product" to add items to your menu.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
