import jwt from 'jsonwebtoken';

const adminLogin = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // if (user.role !== 'admin') {
        //     return res.status(403).json({ message: 'Access denied: Not an admin' });
        // }

        const token = jwt.sign(
            { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.status(200).json({ message: 'Admin login successful', token });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const addProducts = async(req, res) => {
    try {
        
        const {name, image, price, description, category} = req.body
        const product = await productModel.create({
            name,
            image,
            price,
            description,
            category
        })
        res.status(201).json({ message: 'Product added successfully', product });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

export { adminLogin, addProducts }