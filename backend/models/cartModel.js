import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
            quantity: { type: Number, required: true, default: 1 }
        }
    ]
});

const cartModel = mongoose.model('cart', cartSchema);
export default cartModel;
