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
  notifications: Message[];
  isTyping: boolean;

  setIsConnected: (isConnected: boolean) => void;
  setIsTyping: (isTyping: boolean) => void;
  setNewMessage: (message: Message) => void;
  setMessagesFromDB: (messages: Message[]) => void;
};

export const useSocketStore = create<SocketState>((set) => ({
  isConnected: false,
  messages: [],
  notifications: [],
  isTyping: false,

  setIsConnected: (isConnected) => {
    set({ isConnected });
  },

  setIsTyping: (isTyping) => {
    set({ isTyping });
  },

  setMessagesFromDB: (messages) => {
    set({ messages });
  },

  setNewMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },
}));
