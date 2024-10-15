import { create } from "zustand";
import { io } from "socket.io-client";
import { Message } from "./types";

const SOCKET_PORT = 5000 || import.meta.env.VITE_SOCKET_SERVER_PORT;
const SOCKET_SERVER_URL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_SOCKET_SERVER_API
    : `http://localhost:${SOCKET_PORT}`;

export const socket = io(SOCKET_SERVER_URL);
export const SocketEvent = {
  Connect: {
    Init: "connect",
    Connected: "connected",
    Setup: "intial join",
    Error: "connect_error",
  },
  Disconnect: "disconnect",
  Messages: {
    New: "new",
    Greet: "greet",
    Recieved: "recieved",
  },
  User: {
    IsTyping: "user typing",
    IsNotTyping: "user not typing",
    Join: "user join",
    Leave: "user leave",
  },
  Chat: {
    Join: "join chat",
    Leave: "leave chat",
  },
} as const;

type SocketState = {
  isConnected: boolean;
  messages: Message[];

  setNewMessage: (message: Message) => void;
  setMessagesFromDB: (messages: Message[]) => void;
  initSocket: () => void;
  sendSocketMessage: (data: Message) => void;
  disconnect: () => void;
};

export const useSocketStore = create<SocketState>((set) => ({
  isConnected: false,
  messages: [],

  initSocket: () => {
    socket.on(SocketEvent.Connect.Error, (error: Error) => {
      console.error("Connection failed:", error);
    });

    socket.on(SocketEvent.Connect.Init, () => {
      set({ isConnected: true });
    });

    socket.on(SocketEvent.Disconnect, () => {
      set({ isConnected: false });
    });
  },

  sendSocketMessage: (messageData: Message) => {
    console.log("Sending message", messageData);
    socket.emit(SocketEvent.Messages.New, messageData);
  },

  setMessagesFromDB: (messages) => {
    set({ messages });
  },

  setNewMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },

  disconnect: () => {
    socket.off(SocketEvent.Connect.Init);
    socket.off(SocketEvent.Disconnect);
    socket.disconnect();
    set({ isConnected: false });
  },
}));
