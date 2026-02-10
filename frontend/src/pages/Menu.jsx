import React, { useState, useEffect } from 'react';
import '../styles/Menu.css';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Kenyan Seafood Dishes Data
  const dishes = [
    // Starters/Appetizers
    {
      id: 1,
      name: 'Calamari Rings',
      category: 'Starters',
      price: 450,
      image: 'placeholder-calamari.jpg',
      description: 'Crispy golden fried squid rings'
    },
    {
      id: 2,
      name: 'Fish Cakes',
      category: 'Starters',
      price: 380,
      image: 'placeholder-fishcakes.jpg',
      description: 'Homemade fish and potato cakes'
    },
    {
      id: 3,
      name: 'Grilled Prawns',
      category: 'Starters',
      price: 520,
      image: 'placeholder-prawns.jpg',
      description: 'Butter garlic grilled prawns'
    },
    {
      id: 4,
      name: 'Octopus Salad',
      category: 'Starters',
      price: 480,
      image: 'placeholder-octopus.jpg',
      description: 'Fresh octopus with lemon dressing'
    },
    {
      id: 5,
      name: 'Shrimp Skewers',
      category: 'Starters',
      price: 550,
      image: 'placeholder-shrimp-skewers.jpg',
      description: 'Marinated shrimp on wooden sticks'
    },

    // Main Course
    {
      id: 6,
      name: 'Grilled Tilapia',
      category: 'Main Course',
      price: 850,
      image: 'placeholder-tilapia.jpg',
      description: 'Whole grilled tilapia with salad'
    },
    {
      id: 7,
      name: 'Mombasa Seafood Platter',
      category: 'Main Course',
      price: 1200,
      image: 'placeholder-platter.jpg',
      description: 'Mix of fish, prawns, octopus and squid'
    },
    {
      id: 8,
      name: 'Pan-Seared Snapper',
      category: 'Main Course',
      price: 920,
      image: 'placeholder-snapper.jpg',
      description: 'Red snapper with garlic butter sauce'
    },
    {
      id: 9,
      name: 'Prawns in Coconut Sauce',
      category: 'Main Course',
      price: 1050,
      image: 'placeholder-prawn-coconut.jpg',
      description: 'Succulent prawns in creamy coconut milk'
    },
    {
      id: 10,
      name: 'Whole Grilled Mackerel',
      category: 'Main Course',
      price: 780,
      image: 'placeholder-mackerel.jpg',
      description: 'Fresh mackerel with lemon herbs'
    },

    // Desserts
    {
      id: 11,
      name: 'Chocolate Mousse',
      category: 'Dessert',
      price: 320,
      image: 'placeholder-mousse.jpg',
      description: 'Rich dark chocolate mousse'
    },
    {
      id: 12,
      name: 'Coconut Cake',
      category: 'Dessert',
      price: 280,
      image: 'placeholder-coconut-cake.jpg',
      description: 'Moist coconut cake with frosting'
    },
    {
      id: 13,
      name: 'Fresh Fruit Salad',
      category: 'Dessert',
      price: 250,
      image: 'placeholder-fruit.jpg',
      description: 'Seasonal fresh tropical fruits'
    },
    {
      id: 14,
      name: 'Mango Cheesecake',
      category: 'Dessert',
      price: 400,
      image: 'placeholder-cheesecake.jpg',
      description: 'Creamy mango cheesecake slice'
    },
    {
      id: 15,
      name: 'Tiramisu',
      category: 'Dessert',
      price: 350,
      image: 'placeholder-tiramisu.jpg',
      description: 'Classic Italian tiramisu'
    },

    // Drinks
    {
      id: 16,
      name: 'Fresh Mango Juice',
      category: 'Drinks',
      price: 150,
      image: 'placeholder-mango-juice.jpg',
      description: 'Freshly squeezed mango juice'
    },
    {
      id: 17,
      name: 'Coconut Water',
      category: 'Drinks',
      price: 120,
      image: 'placeholder-coconut-water.jpg',
      description: 'Fresh coconut water from the shell'
    },
    {
      id: 18,
      name: 'Passion Fruit Smoothie',
      category: 'Drinks',
      price: 180,
      image: 'placeholder-smoothie.jpg',
      description: 'Creamy passion fruit smoothie'
    },
    {
      id: 19,
      name: 'Tamarind Drink',
      category: 'Drinks',
      price: 140,
      image: 'placeholder-tamarind.jpg',
      description: 'Traditional tangy tamarind drink'
    },
    {
      id: 20,
      name: 'Watermelon Juice',
      category: 'Drinks',
      price: 130,
      image: 'placeholder-watermelon.jpg',
      description: 'Refreshing watermelon juice'
    },
    {
      id: 21,
      name: 'Apple Juice',
      category: 'Drinks',
      price: 140,
      image: 'placeholder-watermelon.jpg',
      description: 'Refreshing watermelon juice'
    }
  ];

  // Filter and search dishes
  const getFilteredDishes = () => {
    let filtered = dishes;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(dish => dish.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(dish =>
        dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort alphabetically
    filtered.sort((a, b) => a.name.localeCompare(b.name));

    return filtered;
  };

  // Get initial 2 dishes from each category
  const getInitialDishes = () => {
    if (selectedCategory !== 'All') {
      return getFilteredDishes();
    }

    const categories = ['Starters', 'Main Course', 'Dessert', 'Drinks'];
    let initial = [];

    categories.forEach(category => {
      const categoryDishes = dishes
        .filter(d => d.category === category)
        .sort((a, b) => a.name.localeCompare(b.name))
        .slice(0, 2);
      initial = [...initial, ...categoryDishes];
    });

    return initial;
  };

  const displayedDishes = selectedCategory === 'All' && !searchTerm 
    ? getInitialDishes() 
    : getFilteredDishes();

  // Add to cart function
  const handleAddToCart = (dish) => {
    const existingItem = cart.find(item => item.id === dish.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === dish.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...dish, quantity: 1 }]);
    }
  };

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Category list
  const categories = ['All', 'Starters', 'Main Course', 'Dessert', 'Drinks'];

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
                  {category === 'Starters' ? '🦐 Starters' : 
                   category === 'Main Course' ? '🐟 Main Course' :
                   category === 'Dessert' ? '🍰 Desserts' :
                   category === 'Drinks' ? '🥤 Drinks' :
                   '🍽️ All Dishes'}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Dishes Display */}
        <main className="dishes-section">
          {displayedDishes.length > 0 ? (
            <>
              <div className="dishes-grid">
                {displayedDishes.map((dish) => (
                  <div key={dish.id} className="dish-card">
                    <div className="dish-image-wrapper">
                      <div className="dish-image placeholder">
                        <img src={dish.image} alt={dish.name} />
                        <span className="placeholder-text">[Image: {dish.name}]</span>
                      </div>
                      <span className="category-badge">{dish.category}</span>
                    </div>
                    <div className="dish-info">
                      <h3 className="dish-name">{dish.name}</h3>
                      <p className="dish-description">{dish.description}</p>
                      <div className="dish-footer">
                        <span className="dish-price">KES {dish.price}</span>
                        <button
                          className="add-to-cart-btn"
                          onClick={() => handleAddToCart(dish)}
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
                  🛒 Go to Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
                </button>
              </div>
            </>
          ) : (
            <div className="no-results">
              <p>No dishes found matching your search.</p>
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
