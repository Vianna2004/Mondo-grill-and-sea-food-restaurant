import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

  const { id: editId } = useParams();

  // If editing, fetch product
  useEffect(() => {
    if (!editId) return;
    const loadProduct = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/product/get-product/${editId}`);
        const p = res.data.product;
        setFormData({
          name: p.name || '',
          image: p.image || '',
          price: p.price || '',
          description: p.description || '',
          category: p.category || ''
        });
      } catch (err) {
        console.error('Failed to load product for edit', err);
      }
    };
    loadProduct();
  }, [editId]);

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
      if (editId) {
        await axios.put(`${backendUrl}/api/product/update-product/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Product updated successfully!');
      } else {
        await axios.post(`${backendUrl}/api/product/add-product`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Product added successfully!');
      }
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

  const handleDelete = async () => {
    if (!editId) return;
    if (!window.confirm('Delete this product? This action cannot be undone.')) return;
    try {
      await axios.delete(`${backendUrl}/api/product/delete-product/${editId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/admin-dashboard');
    } catch (err) {
      console.error('Failed to delete product', err);
      setMessage('Failed to delete product');
    }
  };

  if (!isAdmin) {
    return <div className="flex justify-center items-center h-screen"><div className="text-xl">Access Denied</div></div>;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(180deg, #FFF8F5 0%, #FFFFFF 100%)' }}>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="p-8 text-white flex flex-col justify-center" style={{ background: 'linear-gradient(180deg,#FF7A59 0%, #23C4A2 100%)' }}>
          <h1 className="text-4xl font-extrabold mb-2">{editId ? 'Edit Product' : 'Add Product'}</h1>
          <p className="opacity-90">Create attractive menu items that customers will love. Add clear images, price and a short description.</p>
          {formData.image && (
            <div className="mt-6">
              <img src={formData.image} alt="preview" className="rounded-lg shadow-lg w-full object-cover max-h-60" />
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
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
            {formData.image && (
              <div className="mt-2">
                <img src={formData.image} alt="preview" className="w-40 h-28 object-cover rounded-md shadow" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="price">
              💰 Price (in KSH)
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
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            >
              <option value="">Select category</option>
              <option value="Seafood">Main Course</option>
              <option value="Drinks">Drinks</option>
              <option value="Sides">Starters</option>
              <option value="Desserts">Desserts</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              className="flex-1 text-white py-3 px-4 rounded-lg focus:outline-none transition duration-200 font-semibold text-lg shadow"
              type="submit"
              style={{ background: 'linear-gradient(90deg,#FFB677,#23C4A2)' }}
              disabled={loading}
            >
              {loading ? (editId ? 'Updating...' : 'Adding...') : (editId ? 'Save Changes' : '➕ Add Product')}
            </button>
            {editId && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-100 text-red-700 py-3 px-4 rounded-lg font-semibold hover:bg-red-200"
              >
                🗑️ Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;