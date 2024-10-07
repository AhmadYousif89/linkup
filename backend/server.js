import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { clerkMiddleware } from '@clerk/express';
import userRouter from './routes/userRoutes.js';
import chatRouter from './routes/chatRoutes.js';

// Setup the environment, server, and database
dotenv.config();
const app = express();
connectDB();
app.use(clerkMiddleware());

// get port from env, or use 5000 as default
const port = process.env.PORT || 5000;

// Main page to be changed
app.get('/api', (req, res) => {
  res.send('Server is running');
});

// User routes API
app.use('/api/user/', userRouter);
app.use('/api/chat/', chatRouter);

// Confirm start to the console
app.listen(port, console.log(`Server listening on port ${port}`));
