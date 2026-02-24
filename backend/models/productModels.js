import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: {type: String, required: true },
    image: {type: String, default:'https://www.pexels.com/photo/deep-fried-shrimp-and-squid-with-slice-of-lemon-on-ceramic-plate-921367/'},
    price: {type: Number, required: true},
    description: {type: String, required: true },
    category: {type: String, required: true }
})

const productModel = mongoose.model('product', productSchema);
export default productModel