export const SocketEvents = {
  Connect: {
    Init: 'connect',
    Connected: 'connected',
    Setup: 'initial_join',
    Error: 'connect_error',
    Disconnect: 'disconnect',
  },
  Messages: {
    New: 'message:new',
    Received: 'message:received',
  },
  Notification: {
    New: 'notification:new',
    Read: 'notification:read',
    Received: 'notification:received',
  },
  User: {
    IsTyping: 'user:typing',
    IsNotTyping: 'user:not_typing',
    Join: 'user:join',
    Leave: 'user:leave',
    Status: 'user:status',
  },
  Chat: {
    Join: 'chat:join',
    Leave: 'chat:leave',
  },
};
