import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import userRouter from './routes/userRoutes.js';
import chatRouter from './routes/chatRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import AppHandlers from './middleware/errorMiddleware.js';

dotenv.config(); // load environment variables from .env file
connectDB(); // connect to the MongoDB database

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const allowedOrigins = ['http://127.0.0.1:5173', 'http://localhost:5173'];
const PRODUCTION_ORIGIN = process.env.PRODUCTION_ORIGIN || false;
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? PRODUCTION_ORIGIN : allowedOrigins,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true, // credentials: true is a must for cookies
};

app.use(cors(corsOptions));
const server = app.listen(PORT, console.log(`Server listening on port ${PORT}`));
const io = new Server(server, { cors: corsOptions });

import { setupSocketServer } from './socket.js';
const socketServer = setupSocketServer(io);

// Main route @Public
app.get('/api', (req, res) => {
  res.json('Server is running');
});

// Access Socket active users @Public
app.get('/api/socket/users', (req, res) => {
  const users = socketServer.getActiveUsers();
  res.json([...users.keys()]);
});

// API routes @Protected
app.use('/api/user/', userRouter);
app.use('/api/chat/', chatRouter);
app.use('/api/message/', messageRouter);

// Error handler
app.use(AppHandlers.urlNotFound);
app.use(AppHandlers.errorHandler);
