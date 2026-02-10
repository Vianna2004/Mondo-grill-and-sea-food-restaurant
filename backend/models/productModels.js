import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: {type: String, required: true },
    Image: {type: String, default:'https://cdn-icons-png.flaticon.com/512/1077/1077114.png'},
    price: {type: Number, required: true},
    description: {type: String, required: true },
    category: {type: String, required: true }
})

const productModel = mongoose.model('product', productSchema);
export default productModel