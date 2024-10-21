import { toast } from "sonner";
import { formatApiData } from "./utils";

export const SERVER_API_URL = import.meta.env.VITE_SERVER_API;
export type ClerkUser = {
  id: string | null;
  email: string | null;
  fullName: string | null;
  image: string | null;
};

export const postUser = async (user: ClerkUser) => {
  const res = await fetch(`${SERVER_API_URL}/user/clerk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...user, fullName: user.fullName ?? "N/A" }),
  });
  const data = await res.json();
  const storeToken = JSON.stringify(data.token);
  localStorage.removeItem("token");
  localStorage.setItem("token", storeToken);
  localStorage.setItem("userId", data.id);
};

export const getAllUsers = async (searchTerm: string) => {
  const tokenItem = localStorage.getItem("token");
  const token = tokenItem ? JSON.parse(tokenItem) : null;
  const res = await fetch(`${SERVER_API_URL}/user?search=${searchTerm}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  const users = formatApiData(data, "USER", "Array");
  return users;
};

export const createUserDM = async (userId: string) => {
  const tokenItem = localStorage.getItem("token");
  const token = tokenItem ? JSON.parse(tokenItem) : null;
  const res = await fetch(`${SERVER_API_URL}/chat`, {
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
  const res = await fetch(`${SERVER_API_URL}/message/${chatId}`, {
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
  const res = await fetch(`${SERVER_API_URL}/message`, {
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

export const getUserDMs = async () => {
  const tokenItem = localStorage.getItem("token");
  const token = tokenItem ? JSON.parse(tokenItem) : null;
  const res = await fetch(`${SERVER_API_URL}/chat`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  const chats = formatApiData(data, "CHAT", "Array");
  return chats;
};

type GroupChatBody = { name: string; users: string[] };
export const createGroupChat = async (body: GroupChatBody) => {
  const tokenItem = localStorage.getItem("token");
  const token = tokenItem ? JSON.parse(tokenItem) : null;
  console.log("creating group chat", body);
  const response = await fetch(`${SERVER_API_URL}/chat/group`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  const groupChat = formatApiData(data, "GROUP_CHAT", "Object");
  return groupChat;
};

export const fetchGroupChats = async () => {
  const tokenItem = localStorage.getItem("token");
  const token = tokenItem ? JSON.parse(tokenItem) : null;
  const res = await fetch(`${SERVER_API_URL}/chat/group`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  const chats = formatApiData(data, "GROUP_CHAT", "Array");
  return chats;
};

export const closeChat = async (chatId: string) => {
  const tokenItem = localStorage.getItem("token");
  const token = tokenItem ? JSON.parse(tokenItem) : null;
  console.log("closing chat", chatId);
  const res = await fetch(`${SERVER_API_URL}/chat/close`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ chatId }),
  });
  const data = await res.json();
  if (res.status === 200) {
    toast.success(data.message);
  } else {
    console.error("Error closing chat:", data.message);
  }
};
