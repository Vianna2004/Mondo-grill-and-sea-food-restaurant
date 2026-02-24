
import productModel from "../models/productModels.js";
import mongoose from 'mongoose';
import userModel from '../models/userModel.js';

const addProduct = async (req, res) => {
    try {
        const { name, price, description, category } = req.body;

        if (!name || !price || !description || !category) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        const productData = {
            name,
            price,
            description,
            category
        }
        const newProduct = new productModel(productData);
        await newProduct.save();
        console.log('Product added successfully');
        return res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const getProducts = async (req, res) => {
    try {
        const products = await productModel.find();
        return res.status(200).json({ products });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await productModel.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        console.log('Product deleted successfully');
        return res.status(200).json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

//export { addProduct, getProducts, deleteProduct }

// New: Update product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedProduct = await productModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// New: Get product quantity
const getProductQuantity = async (req, res) => {
    try {
        const products = await productModel.find({}, 'name quantity');
        return res.status(200).json({ products });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// New: Add to cart (user)
import cartModel from '../models/cartModel.js';

const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        console.log('addToCart called with:', { userId, productId, quantity });

        if (!userId || !productId) {
            return res.status(400).json({ message: 'userId and productId are required' });
        }

        if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ message: 'Invalid userId or productId format' });
        }

        // verify user exists
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // verify product exists
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const qty = Number(quantity) && Number(quantity) > 0 ? Number(quantity) : 1;

        let cart = await cartModel.findOne({ user: userId });
        if (!cart) {
            cart = new cartModel({ user: userId, products: [] });
        }
        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += qty;
        } else {
            cart.products.push({ product: productId, quantity: qty });
        }
        await cart.save();
        return res.status(200).json({ message: 'Product added to cart', cart });
    } catch (error) {
        console.error('addToCart error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// New: Admin get all carts
const getAllCarts = async (req, res) => {
    try {
        const carts = await cartModel.find().populate('user').populate('products.product');
        return res.status(200).json({ carts });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export { addProduct, getProducts, deleteProduct, updateProduct, getProductQuantity, addToCart, getAllCarts };
