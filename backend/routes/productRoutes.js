import express from "express";
import { addProduct, deleteProduct, getProducts } from "../controller/productController.js";

const productRouter = express.Router();

productRouter.post('/add-product', addProduct);
productRouter.get('/get-products', getProducts);
productRouter.delete('/delete-product/:id', deleteProduct);

export default productRouter