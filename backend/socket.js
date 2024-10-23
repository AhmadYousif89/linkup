import {
  handleMessageCreation,
  handleUserIsTyping,
  handleUserNotTyping,
  handleUserJoinChat,
  handleUserLeaveChat,
} from './socket_handlers.js';
import { SocketEvents } from './socket_events.js';

export const setupSocketServer = (io) => {
  const activeUsers = new Map();

  io.on(SocketEvents.Connect.Init, (socket) => {
    console.log('Socket connected:', socket.id);
    const handlers = {
      message: handleMessageCreation(socket),
      typing: handleUserIsTyping(socket),
      notTyping: handleUserNotTyping(socket),
      joinChat: handleUserJoinChat(socket),
      leaveChat: handleUserLeaveChat(socket),
    };

    socket.on(SocketEvents.Connect.Setup, (userId) => {
      activeUsers.set(userId, socket);
      socket.data.userId = userId;
      socket.join(userId);
      socket.emit(SocketEvents.Connect.Connected, userId);
      // Notify others that user is online
      io.emit(SocketEvents.User.Status, {
        userId,
        status: 'online',
      });
    });

    socket.on(SocketEvents.Messages.New, handlers.message);
    socket.on(SocketEvents.User.IsTyping, handlers.typing);
    socket.on(SocketEvents.User.IsNotTyping, handlers.notTyping);
    socket.on(SocketEvents.Chat.Join, handlers.joinChat);
    socket.on(SocketEvents.Chat.Leave, handlers.leaveChat);

    socket.on(SocketEvents.Connect.Disconnect, () => {
      const userId = socket.data.userId;
      if (userId) {
        activeUsers.delete(userId);
        io.emit(SocketEvents.User.Status, {
          userId,
          status: 'offline',
        });
      }
    });
  });

  return {
    getActiveUsers: () => activeUsers,
  };
};
