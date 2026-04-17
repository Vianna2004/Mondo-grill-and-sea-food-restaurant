import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/mongoDb.js';
import userRouter from './routes/userRoute.js';
import cors from 'cors';
import productRouter from './routes/productRoutes.js';
import adminRouter from './routes/adminRoute.js';
import orderRouter from './routes/orderRoutes.js';
import http from 'http';
import { Server as IOServer } from 'socket.io';

dotenv.config();

const app = express()
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/admin', adminRouter)
app.use('/api/order', orderRouter)

const server = http.createServer(app);
const io = new IOServer(server, {
    cors: { origin: 'http://localhost:5173' }
});

// expose socket instance to controllers via global
global.io = io;

io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
    });
});

server.listen(PORT, async () => {
    try {
        await connectDb();
        console.log(`Server running at http://localhost:${PORT}`)
    } catch (error) {
        console.error('Failed to connect to DB:', error);
    }
});