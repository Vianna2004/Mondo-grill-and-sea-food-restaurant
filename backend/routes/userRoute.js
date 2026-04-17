
import express from 'express'
import { loginUser, registerUser, adminLogin, getAllUsers, getCartByUserId, updateCart, toggleUserStatus } from '../controller/userController.js';
import adminAuth from '../middleware/adminAuth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin-login', adminLogin);

userRouter.get('/all-users', adminAuth, getAllUsers);
userRouter.put('/toggle-user/:id', adminAuth, toggleUserStatus);

userRouter.get('/cart/:userId', getCartByUserId);
userRouter.post('/update-cart', updateCart);

export default userRouter;