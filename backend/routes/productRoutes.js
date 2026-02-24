import express from "express";
import { addProduct, deleteProduct, getProducts } from "../controller/productController.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

productRouter.post('/add-product', adminAuth, addProduct);
productRouter.get('/get-products', getProducts);
productRouter.delete('/delete-product/:id', adminAuth, deleteProduct);

export default productRouter