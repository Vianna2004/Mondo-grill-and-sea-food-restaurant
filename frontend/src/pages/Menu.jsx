import React, { useState, useEffect, useContext } from 'react';
import '../styles/Menu.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/userContext';

const Menu = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const { backendUrl, token } = useContext(UserContext);


  // Products from backend
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await axios.get(`${backendUrl}/api/product/get-products`);
        setProducts(res.data.products);
        setErrorProducts('');
      } catch (err) {
        setErrorProducts('Failed to load products');
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [backendUrl]);


  // Filter and search products
  const getFilteredProducts = () => {
    let filtered = products;
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    filtered.sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  };

  const displayedProducts = getFilteredProducts();

  // Add to cart function
  const handleAddToCart = async (dish) => {
    // fallback to localStorage token if context token not set
    const currentToken = token || localStorage.getItem('token');
    if (!currentToken) {
      alert('Please login to add to cart.');
      navigate('/login');
      return;
    }

    let userId;
    try {
      userId = JSON.parse(atob(currentToken.split('.')[1])).id;
    } catch (e) {
      console.error('Invalid token payload', e);
    }

    if (!userId) {
      alert('Unable to determine user. Please login again.');
      navigate('/login');
      return;
    }

    try {
      await axios.post(`${backendUrl}/api/product/add-to-cart`, {
        userId,
        productId: dish._id, // always use backend _id
        quantity: 1
      }, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      alert('Added to cart!');
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to add to cart';
      alert('Failed to add to cart: ' + msg);
    }
  };

  // Optionally, fetch cart from backend if you want to display cart count

  // Category list (dynamic from backend products, only non-empty categories)
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  return (
    <div className="menu-container">
      {/* Search Bar */}
      <div className="search-section">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="🔍 Search dishes by name or description..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="menu-content">
        {/* Sidebar Filter */}
        <aside className="filter-sidebar">
          <h3 className="filter-title">Categories</h3>
          <ul className="category-list">
            {categories.map((category) => (
              <li key={category}>
                <button
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSearchTerm('');
                  }}
                >
                  {category === 'All' ? '🍽️ All Dishes' : category}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Products Display */}
        <main className="dishes-section">
          {loadingProducts ? (
            <div>Loading products...</div>
          ) : errorProducts ? (
            <div className="error-message">{errorProducts}</div>
          ) : displayedProducts.length > 0 ? (
            <>
              <div className="dishes-grid">
                {displayedProducts.map((product) => (
                  <div key={product._id} className="dish-card">
                    <div className="dish-image-wrapper">
                      <div className="dish-image placeholder">
                        <img src={product.image || 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png'} alt={product.name} />
                        <span className="placeholder-text">[Image: {product.name}]</span>
                      </div>
                      <span className="category-badge">{product.category}</span>
                    </div>
                    <div className="dish-info">
                      <h3 className="dish-name">{product.name}</h3>
                      <p className="dish-description">{product.description}</p>
                      <div className="dish-footer">
                        <span className="dish-price">KES {product.price}</span>
                        <button
                          className="add-to-cart-btn"
                          onClick={() => handleAddToCart(product)}
                        >
                          🛒 Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Go to Cart Button */}
              <div className="cart-action">
                <button
                  className="go-to-cart-btn"
                  onClick={() => navigate('/cart')}
                >
                  🛒 Go to Cart
                </button>
              </div>
            </>
          ) : (
            <div className="no-results">
              <p>No products found matching your search.</p>
              <button
                className="reset-btn"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Menu;
