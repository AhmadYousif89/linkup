import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import userRouter from './routes/userRoutes.js';
import chatRouter from './routes/chatRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import AppHandlers from './middleware/errorMiddleware.js';

// Setup the environment, server, and database
dotenv.config();
const app = express();
app.use(express.json());

// get port from env, or use 5000 as default
const PORT = process.env.PORT || 5000;
const allowedOrigins = ['http://127.0.0.1:5173', 'http://localhost:5173'];
const PRODUCTION_ORIGIN = process.env.PRODUCTION_ORIGIN || false;
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? PRODUCTION_ORIGIN : allowedOrigins,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true, // credentials: true is a must for cookies
};

// Enable CORS
app.use(cors(corsOptions));

// Main page to be changed
app.get('/api', (req, res) => {
  res.json('Server is running');
});

// Testing errors
// eslint-disable-next-line no-unused-vars
app.get('/error-route', (req, res, next) => {
  throw new Error('Intentional error');
});

// User routes API
app.use('/api/user/', userRouter);
app.use('/api/chat/', chatRouter);
app.use('/api/message/', messageRouter);

// Error handler
app.use(AppHandlers.urlNotFound);
app.use(AppHandlers.errorHandler);

connectDB();
const server = app.listen(PORT, console.log(`Server listening on port ${PORT}`));

// Setup up socket.io
const io = new Server(server, {
  pingTimeout: 60000,
  cors: corsOptions,
});

io.on('connection', (socket) => {
  console.log('Connected to socket.io');
  socket.on('setup', (userId) => {
    socket.join(userId);
    socket.emit('connected');
  });

  // I don't know how is this useful, maybe for group
  socket.on('join chat', (chat) => {
    socket.join(chat);
    console.log('User joined chat: ' + chat);
  });

  socket.on('typing', (chat) => {
    socket.in(chat).emit('typing');
  });

  socket.on('stop typing', (chat) => {
    socket.in(chat).emit('stop typing');
  });

  socket.on('message', (newMessageRecieved) => {
    console.log('Message recieved', newMessageRecieved);
    let chat = newMessageRecieved.chatId;

    if (!chat.users) return console.log('chat.users not defined');

    chat.users.forEach((user) => {
      // if (user._id == newMessageRecieved.sender._id) return;
      console.log('User', user._id);
      socket.in(user._id).emit('message', newMessageRecieved);
    });
  });

  socket.off('setup', (userData) => {
    console.log('USER DISCONNECTED');
    socket.leave(userData._id);
  });
});
