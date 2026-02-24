import express from "express";
import { addProduct, deleteProduct, getProducts, updateProduct, getProductQuantity, addToCart, getAllCarts } from "../controller/productController.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();


productRouter.post('/add-product', adminAuth, addProduct);
productRouter.get('/get-products', getProducts);
productRouter.delete('/delete-product/:id', adminAuth, deleteProduct);
productRouter.put('/update-product/:id', adminAuth, updateProduct);
productRouter.get('/product-quantity', adminAuth, getProductQuantity);
productRouter.post('/add-to-cart', addToCart);
productRouter.get('/admin-carts', adminAuth, getAllCarts);

export default productRouter