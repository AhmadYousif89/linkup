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

const SocketEvent = {
  Connect: {
    Init: 'connection',
    Connected: 'connected',
    Setup: 'intial join',
  },
  Disconnect: 'disconnect',
  Messages: {
    New: 'new',
    Greet: 'greet',
    Recieved: 'recieved',
  },
  Notification: {
    New: 'new',
    Read: 'read',
    Recieved: 'recieved',
  },
  User: {
    IsTyping: 'user typing',
    IsNotTyping: 'user not typing',
    Join: 'user join',
    Leave: 'user leave',
  },
  Chat: {
    Join: 'join chat',
    Leave: 'leave chat',
  },
};

io.on(SocketEvent.Connect.Init, (socket) => {
  socket.on(SocketEvent.Connect.Setup, (userId) => {
    socket.join(userId);
    console.log('User connected', userId);
    socket.emit(SocketEvent.Connect.Connected, userId);
  });

  socket.on(SocketEvent.Chat.Join, (chat) => {
    console.log('User joined chat: ' + chat);
    socket.join(chat);
  });

  socket.on(SocketEvent.Chat.Leave, (chat) => {
    console.log('User leaved chat: ' + chat);
    socket.leave(chat);
  });

  socket.on(SocketEvent.User.IsTyping, (chat) => {
    socket.in(chat).emit(SocketEvent.User.IsTyping);
  });

  socket.on(SocketEvent.User.IsNotTyping, (chat) => {
    socket.in(chat).emit(SocketEvent.User.IsNotTyping);
  });

  socket.on(SocketEvent.Messages.New, (message) => {
    if (!message.chat.users) return console.log('chat.users not defined');
    message.chat.users.forEach((user) => {
      if (user.id === message.sender.id) {
        console.log('Message sent to self');
        return;
      }
      socket.in(user.id).emit(SocketEvent.Messages.Recieved, message);
      console.log('Message sent to: ' + user.id);
    });
  });

  socket.off(SocketEvent.Connect.Setup, (userData) => {
    console.log('USER DISCONNECTED');
    socket.leave(userData.id);
  });
});
