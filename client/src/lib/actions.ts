import { formatApiData } from "./utils";

export const VITE_SERVER_API = import.meta.env.VITE_SERVER_API;

export const getAllUsers = async (searchTerm: string) => {
  const tokenItem = localStorage.getItem("token");
  const token = tokenItem ? JSON.parse(tokenItem) : null;
  const res = await fetch(`${VITE_SERVER_API}/user?search=${searchTerm}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const users = await res.json();
  const data = formatApiData(users, "USER", "Array");
  return data;
};

export const createUserDM = async (userId: string) => {
  const tokenItem = localStorage.getItem("token");
  const token = tokenItem ? JSON.parse(tokenItem) : null;
  const res = await fetch(`${VITE_SERVER_API}/chat`, {
    method: "POST",
    body: JSON.stringify({ userId }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  const chat = formatApiData(data, "CHAT", "Object");
  return chat;
};

export const getMessagesFromDB = async (chatId: string) => {
  const tokenItem = localStorage.getItem("token");
  const token = tokenItem ? JSON.parse(tokenItem) : null;
  if (!chatId) {
    console.error("Chat ID is required for fetching messages");
    return [];
  }
  const res = await fetch(`${VITE_SERVER_API}/message/${chatId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  const messages = formatApiData(data, "MESSAGE", "Array");
  return messages;
};

export const sendMessage = async (content: string, chatId: string) => {
  const tokenItem = localStorage.getItem("token");
  const token = tokenItem ? JSON.parse(tokenItem) : null;
  const res = await fetch(`${VITE_SERVER_API}/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content, chatId }),
  });
  const data = await res.json();
  const message = formatApiData(data, "MESSAGE", "Object");
  return message;
};

export const createGroupChat = async (body: {
  name: string;
  users: string[];
}) => {
  const tokenItem = localStorage.getItem("token");
  const token = tokenItem ? JSON.parse(tokenItem) : null;
  console.log("creating group chat", body);
  const response = await fetch(`${VITE_SERVER_API}/chat/group`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  console.log("fetched group chat", data);
  const groupChat = formatApiData(data, "GROUP_CHAT", "Object");
  console.log("group Chat", groupChat);
  return groupChat;
};

export const fetchGroupChats = async () => {
  const tokenItem = localStorage.getItem("token");
  const token = tokenItem ? JSON.parse(tokenItem) : null;
  const res = await fetch(`${VITE_SERVER_API}/chat/group`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  const chats = formatApiData(data, "GROUP_CHAT", "Array");
  console.log("fetched group chats", chats);
  return chats;
};
