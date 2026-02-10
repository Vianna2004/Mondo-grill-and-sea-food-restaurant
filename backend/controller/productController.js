
import productModel from "../models/productModels.js";

const addProduct = async (req, res) => {
    try {
        const { name, price, description, category } = req.body;

        if (!name || !price || !description || !category) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        const productData = {
            name,
            price,
            description,
            category
        }
        const newProduct = new productModel(productData);
        await newProduct.save();
        console.log('Product added successfully');
        return res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const getProducts = async (req, res) => {
    try {
        const products = await productModel.find();
        return res.status(200).json({ products });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await productModel.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        console.log('Product deleted successfully');
        return res.status(200).json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

export { addProduct, getProducts, deleteProduct }
