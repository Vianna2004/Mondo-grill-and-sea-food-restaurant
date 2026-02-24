import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/mongoDb.js';
import userRouter from './routes/userRoute.js';
import cors from 'cors';
import productRouter from './routes/productRoutes.js';
import adminRouter from './routes/adminRoute.js';

dotenv.config();

const app = express()

const PORT = process.env.PORT;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/admin', adminRouter)



app.listen(PORT, async () => {
    try {
        await connectDb();
        console.log(`Server running at http://localhost:${PORT}`)
    } catch (error) {
        console.error('Failed to connect to DB:', error);
    }
    
})