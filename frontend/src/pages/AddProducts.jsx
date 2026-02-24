import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/userContext';
import { AdminContext } from '../context/AdminContext';

const AddProducts = () => {
  const navigate = useNavigate();
  const { backendUrl, token } = useContext(UserContext);
  const { isAdmin } = useContext(AdminContext);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    price: '',
    description: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`${backendUrl}/api/product/add-product`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage('Product added successfully!');
      setFormData({
        name: '',
        image: '',
        price: '',
        description: '',
        category: ''
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return <div className="flex justify-center items-center h-screen"><div className="text-xl">Access Denied</div></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
          <h1 className="text-3xl font-bold text-white text-center mb-2">Add New Product</h1>
          <p className="text-indigo-100 text-center">Expand your menu with delicious items</p>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
          {message && (
            <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message}
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">
              🍽️ Product Name
            </label>
            <input
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="image">
              🖼️ Image URL
            </label>
            <input
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200"
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Enter image URL"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="price">
              💰 Price (in cents)
            </label>
            <input
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200"
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">
              📝 Description
            </label>
            <textarea
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200 resize-none"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="4"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="category">
              🏷️ Category
            </label>
            <input
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200"
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter product category"
              required
            />
          </div>

          <button
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 font-semibold text-lg shadow-lg"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Adding Product...' : '➕ Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;