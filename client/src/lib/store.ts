import { create } from "zustand";
import { Socket, io } from "socket.io-client";
import { Message } from "./types";

const SOCKET_PORT = 5000 || import.meta.env.VITE_SOCKET_SERVER_PORT;
const SOCKET_SERVER_URL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_SOCKET_SERVER_API
    : `http://localhost:${SOCKET_PORT}`;

const SocketEvents = {
  Connect: {
    Init: "connect",
    Connected: "connected",
    Setup: "initial_join",
    Error: "connect_error",
    Disconnect: "disconnect",
  },
  Messages: {
    New: "message:new",
    Received: "message:received",
  },
  Notification: {
    New: "notification:new",
    Read: "notification:read",
    Received: "notification:received",
  },
  User: {
    IsTyping: "user:typing",
    IsNotTyping: "user:not_typing",
    Join: "user:join",
    Leave: "user:leave",
    Status: "user:status",
  },
  Chat: {
    Join: "chat:join",
    Leave: "chat:leave",
  },
} as const;

type Status = "online" | "offline" | "away";
type UserStatus = Record<string, Status>;
type SocketState = {
  socket: Socket | null;
  isConnected: boolean;
  messages: Message[];
  notifications: Message[];
  isTyping: boolean;
  userStatus: UserStatus;

  // Socket Connection Methods
  initSocket: () => void;
  disconnect: () => void;
  cleanup: () => void;

  // State Setters
  setIsConnected: (isConnected: boolean) => void;
  setNewMessage: (message: Message) => void;
  setMessagesFromDB: (messages: Message[]) => void;

  // Socket Event Emitters
  emitMessage: (message: Message) => void;
  emitJoinChat: (chatId: string) => void;
  emitLeaveChat: (chatId: string) => void;
  emitTyping: (chatId: string, isTyping: boolean) => void;
};

export const useSocketStore = create<SocketState>()((set, get) => ({
  socket: null,
  isConnected: false,
  messages: [],
  notifications: [],
  isTyping: false,
  userStatus: {},

  // Initialize socket connection
  initSocket: () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("No user ID found in localStorage");
      return;
    }

    const socket = io(SOCKET_SERVER_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      autoConnect: false,
    });

    // Set up socket event listeners
    socket.on(SocketEvents.Connect.Init, () => {
      set({ isConnected: true });
      socket.emit(SocketEvents.Connect.Setup, userId);
    });

    socket.on(SocketEvents.Connect.Connected, (data: string) => {
      console.log("Socket Connected:", data);
      socket.emit(SocketEvents.User.Status, { userId, status: "online" });
    });

    socket.on(SocketEvents.Connect.Error, (error) => {
      set({ isConnected: false });
      console.error("Socket error:", error);
    });

    socket.on(SocketEvents.Connect.Disconnect, () => {
      set({ isConnected: false });
      console.log("Socket disconnected");
    });

    socket.on(SocketEvents.Messages.Received, (message: Message) => {
      set((state) => ({
        messages: [...state.messages, message],
      }));
    });

    socket.on(SocketEvents.User.IsTyping, () => {
      set({ isTyping: true });
    });

    socket.on(SocketEvents.User.IsNotTyping, () => {
      set({ isTyping: false });
    });

    socket.on(SocketEvents.User.Status, (data: UserStatus) => {
      if (data && data.userId)
        set((state) => ({
          userStatus: {
            ...state.userStatus,
            [data.userId as string]: data.status.toLowerCase() as Status,
          },
        }));
    });

    // Connect socket and store it in state
    socket.connect();
    set({ socket });
  },

  // Disconnect socket
  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  // Clean up event listeners
  cleanup: () => {
    const { socket } = get();
    if (socket) {
      console.log("Cleaning up socket events");
      socket.off(SocketEvents.Connect.Init);
      socket.off(SocketEvents.Connect.Error);
      socket.off(SocketEvents.Connect.Connected);
      socket.off(SocketEvents.Connect.Disconnect);
    }
  },

  // State setters
  setIsConnected: (isConnected) => set({ isConnected }),
  setMessagesFromDB: (messages) => set({ messages }),
  setNewMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  // Socket event emitters
  emitMessage: (message) => {
    const { socket } = get();
    socket?.emit(SocketEvents.Messages.New, message);
  },
  emitJoinChat: (chatId) => {
    const { socket } = get();
    socket?.emit(SocketEvents.Chat.Join, chatId);
  },
  emitLeaveChat: (chatId) => {
    const { socket } = get();
    socket?.emit(SocketEvents.Chat.Leave, chatId);
  },
  emitTyping: (chatId, isTyping) => {
    const { socket } = get();
    const userId = localStorage.getItem("userId");
    const event = isTyping
      ? SocketEvents.User.IsTyping
      : SocketEvents.User.IsNotTyping;
    socket?.emit(event, { userId, chatId });
  },
}));
