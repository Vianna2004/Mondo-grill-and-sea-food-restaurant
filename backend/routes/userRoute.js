
import express from 'express'
import { loginUser, registerUser, adminLogin, getAllUsers } from '../controller/userController.js';


import adminAuth from '../middleware/adminAuth.js';
const userRouter = express.Router();



userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin-login', adminLogin);

import { getCartByUserId } from '../controller/userController.js';
userRouter.get('/all-users', adminAuth, getAllUsers);
userRouter.get('/cart/:userId', getCartByUserId);

export default userRouter;