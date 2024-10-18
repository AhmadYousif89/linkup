import { Socket } from 'socket.io';
import { SocketEvents } from './socket_events.js';

/**
 * Create a message handler.
 * @param {Socket} socket
 * @returns
 */
export const handleMessageCreation = (socket) => (message) => {
  if (!message.chat?.users?.length) {
    console.error('Invalid message format: missing chat users');
    return;
  }
  // Send message to all users in the chat except the sender
  message.chat.users.forEach((user) => {
    if (user.id !== message.sender.id) {
      socket.to(message.chat.id).emit(SocketEvents.Messages.Received, message);
    }
  });
  // We don't need to send the message to the sender
  // socket.to(message.chat.id).emit(SocketEvents.Messages.New, message);
};

/**
 * Handles user typing status event.
 * @param {Socket} socket
 * @param {string} chatId
 * @param {string} userId
 * @returns
 */
export const handleUserIsTyping =
  (socket) =>
  ({ userId, chatId }) => {
    console.log('User is typing:', userId);
    socket.to(chatId).emit(SocketEvents.User.IsTyping, { userId, chatId });
  };

/**
 * Handles user not typing status event.
 * @param {Socket} socket
 * @param {string} chatId
 * @param {string} userId
 * @returns
 */
export const handleUserNotTyping =
  (socket) =>
  ({ userId, chatId }) => {
    console.log('User is not typing:', userId);
    socket.to(chatId).emit(SocketEvents.User.IsNotTyping, { userId, chatId });
  };

/**
 * Handles user joining chat event.
 * @param {Socket} socket
 * @param {string} chatId
 * @returns
 */
export const handleUserJoinChat = (socket) => (chatId) => {
  console.log('User joined chat:', {
    userId: socket.data.userId,
    chatId,
  });
  socket.join(chatId);
  socket.to(chatId).emit(SocketEvents.User.Join, {
    userId: socket.data.userId,
    chatId,
  });
};

/**
 * Handles user leaving chat event.
 * @param {Socket} socket
 * @param {string} chatId
 * @returns
 */
export const handleUserLeaveChat = (socket) => (chatId) => {
  console.log('User left chat:', {
    userId: socket.data.userId,
    chatId,
  });
  socket.leave(chatId);
  socket.to(chatId).emit(SocketEvents.User.Leave, {
    userId: socket.data.userId,
    chatId,
  });
};
