import Order from '../models/orderModel.js';

export const createOrder = async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, items, total } = req.body;
    const order = await Order.create({ customerName, customerEmail, customerPhone, items, total });

    // emit socket event for new order if socket server exists
    if (global.io) global.io.emit('newOrder', order);

    return res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({ success: false, error: 'Failed to create order' });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const { userEmail } = req.params;
    const orders = await Order.find({ customerEmail: userEmail }).sort({ date: -1 });
    return res.json({ success: true, orders });
  } catch (error) {
    console.error('Get user orders error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ date: 1 }); // oldest first for admin queue
    return res.json({ success: true, orders });
  } catch (error) {
    console.error('Get all orders error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (global.io) global.io.emit('orderUpdated', order);

    return res.json({ success: true, order });
  } catch (error) {
    console.error('Update order status error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update order' });
  }
};
