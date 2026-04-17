import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  items: [
    {
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  total: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  estimatedTime: { type: String, default: 'TBD' },
  date: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
