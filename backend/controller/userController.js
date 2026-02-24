// Get cart by userId
import cartModel from '../models/cartModel.js';

const getCartByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await cartModel.findOne({ user: userId }).populate('products.product');
        if (!cart) {
            return res.status(200).json({ cart: { products: [] } });
        }
        return res.status(200).json({ cart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
import bcrypt from 'bcrypt';
import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword
        }
        const newUser = new userModel(userData);

        // await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        newUser.token = token;
        await newUser.save();

        console.log('User registered successfully');
        return res.status(201).json({ message: 'User registered successfully', user: newUser, token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }

}

const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await userModel.findOne({ email });


        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        return res.status(200).json({ message: 'Login successful', user, token });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Verify against admin credentials from environment variables
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        const token = jwt.sign(
            { email: process.env.ADMIN_EMAIL, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.status(200).json({ message: 'Admin login successful', token });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

//export { registerUser, loginUser, adminLogin }

// New: Admin get all users
//import userModel from "../models/userModel.js";

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}, '-password');
        return res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export { registerUser, loginUser, adminLogin, getAllUsers, getCartByUserId };