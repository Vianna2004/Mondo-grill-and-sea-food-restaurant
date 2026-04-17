import express from 'express';
import { createOrder, getOrdersByUser, getAllOrders, updateOrderStatus } from '../controller/orderController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/create', createOrder);
router.get('/user/:userEmail', getOrdersByUser);
router.get('/all', adminAuth, getAllOrders);
router.put('/:id/status', adminAuth, updateOrderStatus);

export default router;
