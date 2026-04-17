import React, { useState, useEffect, useContext } from 'react';
import '../styles/AdminDashboard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { UserContext } from '../context/userContext';
import { AdminContext } from '../context/AdminContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [carts, setCarts] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    preparingOrders: 0,
    deliveryOrders: 0,
    deliveredOrders: 0,
    totalUsers: 0,
    totalProducts: 0
  });
  const { backendUrl, token } = useContext(UserContext);
  const { isAdmin } = useContext(AdminContext);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }
    fetchAll();
  }, [isAdmin]);

  // Socket for realtime orders
  useEffect(() => {
    if (!isAdmin) return;
    let socket;
    try {
      socket = io(backendUrl);
      socket.on('newOrder', (order) => {
        // refresh order list
        fetchOrders();
      });
      socket.on('orderUpdated', (order) => {
        fetchOrders();
      });
    } catch (e) {
      console.warn('Admin socket failed', e);
    }
    return () => {
      if (socket) socket.disconnect();
    };
  }, [isAdmin, backendUrl]);

  const fetchAll = async () => {
    await Promise.all([
      fetchProducts(),
      fetchUsers(),
      fetchCarts(),
      fetchOrders()
    ]);
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/get-products`);
      setProducts(res.data.products);
      setStats(s => ({ ...s, totalProducts: res.data.products.length }));
    } catch (err) {
      setProducts([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/user/all-users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.users);
      setStats(s => ({ ...s, totalUsers: res.data.users.length }));
    } catch (err) {
      setUsers([]);
    }
  };

  const fetchCarts = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/admin-carts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCarts(res.data.carts);
      setStats(s => ({ ...s, totalOrders: res.data.carts.length }));
    } catch (err) {
      setCarts([]);
    }
  };

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/order/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.orders || []);
      calculateStats(res.data.orders || [], users);
    } catch (err) {
      console.error('Failed to fetch orders', err);
      setOrders([]);
    }
  };

  // Product actions
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`${backendUrl}/api/product/delete-product/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleEditProduct = (id) => {
    navigate(`/edit-product/${id}`);
  };

  const loadOrders = () => {
    // fetch from backend
    fetchOrders();
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
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${backendUrl}/api/order/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // optimistic update will be reconciled by socket event
    } catch (err) {
      console.error('Failed to update order status', err);
    }
  };

  // Toggle user suspension (call backend)
  const toggleUserStatus = async (userId) => {
    try {
      await axios.put(`${backendUrl}/api/user/toggle-user/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // refresh users list
      fetchUsers();
    } catch (err) {
      console.error('Failed to toggle user status', err);
    }
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
                  <div key={order._id} className="order-card-admin">
                    <div className="order-header-admin">
                      <span className="order-id-admin">{order._id}</span>
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
                              onClick={() => updateOrderStatus(order._id, 'Preparing')}
                            >
                              👨‍🍳 Start Preparing
                            </button>
                          )}
                          {order.status === 'Preparing' && (
                            <button
                              className="action-btn delivery"
                              onClick={() => updateOrderStatus(order._id, 'Out for Delivery')}
                            >
                              🚚 Send to Delivery
                            </button>
                          )}
                          {order.status === 'Out for Delivery' && (
                            <button
                              className="action-btn delivered"
                              onClick={() => updateOrderStatus(order._id, 'Delivered')}
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
                  <div key={user._id || user.id} className="table-row">
                    <div className="col">{user.name}</div>
                    <div className="col">{user.email}</div>
                    <div className="col">{user.phone || '-'}</div>
                    <div className="col">{user.totalOrders || '-'}</div>
                    <div className="col">{user.totalSpent ? `KES ${user.totalSpent.toLocaleString()}` : '-'}</div>
                    <div className="col">
                      <span className={`user-status ${user.status}`}>
                        {user.status === 'active' ? '✓ Active' : '⛔ Suspended'}
                      </span>
                    </div>
                    <div className="col action-col">
                      <button
                        className={`toggle-btn ${user.status}`}
                        onClick={() => toggleUserStatus(user._id || user.id)}
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
              {products.length > 0 ? (
                <table className="admin-products-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>KES {product.price}</td>
                        <td>{product.description}</td>
                        <td>
                          <button onClick={() => handleEditProduct(product._id)} className="edit-btn">✏️ Edit</button>
                          <button onClick={() => handleDeleteProduct(product._id)} className="delete-btn">🗑️ Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No products found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
