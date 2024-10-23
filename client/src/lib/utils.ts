import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import emojiRegex from "emoji-regex";
import { Chat, GroupChat, LatestMessage, Message, Sender, User } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isOnlyEmojis(text: string) {
  // Remove all emoji characters
  const withoutEmoji = text.replace(emojiRegex(), "").trim();
  // If nothing is left (except whitespace), it was only emojis
  return withoutEmoji.length === 0;
}

export function formatDate(
  date: string | undefined,
  options?: Intl.DateTimeFormatOptions,
) {
  if (!date) return;
  return new Intl.DateTimeFormat("default", {
    hour: "numeric",
    minute: "numeric",
    ...options,
  }).format(new Date(date));
}

type FormatFunction<T> = (data: any) => T;
type FormatFunctions = {
  USER: FormatFunction<User>;
  CHAT: FormatFunction<Chat>;
  MESSAGE: FormatFunction<Message>;
  GROUP_CHAT: FormatFunction<GroupChat>;
};
type FormatTypes = keyof FormatFunctions;
type FormatReturnType<T extends FormatTypes> = ReturnType<FormatFunctions[T]>;

const formatFunctions = {
  USER: formatUser,
  CHAT: formatChat,
  MESSAGE: formatMessage,
  GROUP_CHAT: formatGroupChat,
};

// Discriminated overloads for the formatApiData function
export function formatApiData<T extends FormatTypes>(
  data: any[],
  type: T,
  format: "Array",
): FormatReturnType<T>[];
export function formatApiData<T extends FormatTypes>(
  data: any,
  type: T,
  format: "Object",
): FormatReturnType<T>;
export function formatApiData<T extends FormatTypes>(
  data: any[] | any,
  type: T,
  format: "Array" | "Object",
) {
  const formatFunction = formatFunctions[type];
  return format === "Array"
    ? (data as any[]).map((i) => formatFunction(i))
    : formatFunction(data);
}

function formatUser(user: any): User {
  return {
    id: user._id,
    clerkId: user.clerkId,
    name: user.name,
    email: user.email,
    image: user.pic,
    createdAt: user.createdAt,
    updatedAt: user.createdAt,
  };
}

function formatUsers(users: any[]): User[] {
  return users.length ? users.map(formatUser) : [];
}

function formatSender(sender: any): Sender {
  return {
    id: sender._id,
    name: sender.name,
    email: sender.email,
    image: sender.pic,
  };
}

function formatLatestMessage(
  latestMessage: any,
): LatestMessage | string | null {
  if (!latestMessage) return null;
  if (typeof latestMessage === "string") return latestMessage;

  return {
    id: latestMessage._id,
    content: latestMessage.content,
    sender: formatSender(latestMessage.sender),
    chatId: latestMessage.chat,
    readBy: latestMessage.readBy,
    createdAt: latestMessage.createdAt,
    updatedAt: latestMessage.updatedAt,
  };
}

function formatMessage(message: any): Message {
  return {
    id: message._id,
    content: message.content,
    sender: formatSender(message.sender),
    chat: formatChat(message.chat),
    files: message.files || [],
    readBy: message.readBy,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  };
}

function formatChat(chat: any): Chat {
  return {
    id: chat._id,
    chatName: chat.chatName,
    closedUsers: chat.closedUsers || [],
    isGroupChat: chat.isGroupChat,
    users: formatUsers(chat.users),
    latestMessage:
      typeof chat.latestMessage === "string"
        ? chat.latestMessage
        : formatLatestMessage(chat.latestMessage),
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
  };
}

function formatGroupChat(groupChat: any): GroupChat | null {
  if (!groupChat || groupChat.error) return null;

  return {
    id: groupChat._id,
    chatName: groupChat.chatName,
    isGroupChat: groupChat.isGroupChat,
    users: groupChat.users ? formatUsers(groupChat.users) : [],
    groupAdmin: groupChat.groupAdmin ? formatUser(groupChat.groupAdmin) : null,
    closedUsers: groupChat.closedUsers || [],
    createdAt: groupChat.createdAt,
    updatedAt: groupChat.updatedAt,
  };
}

type GenerateIdOptions = {
  length?: number;
  lowercase?: boolean;
  uppercase?: boolean;
  numbers?: boolean;
  special?: boolean;
  prefix?: string;
};
export function generateId({
  length = 21,
  lowercase = true,
  uppercase = true,
  numbers = true,
  special = false,
  prefix = "",
}: GenerateIdOptions = {}) {
  // Character sets
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const specialChars = "!@#$%^&*()-_+=[]{}|;:,.<>?";
  const numberChars = "0123456789";

  // Build character pool based on options
  let chars = "";
  if (lowercase) chars += lowercaseChars;
  if (uppercase) chars += uppercaseChars;
  if (numbers) chars += numberChars;
  if (special) chars += specialChars;

  // Ensure at least one character set is selected
  if (!chars) {
    chars = lowercaseChars + numberChars;
  }

  // Generate random ID
  let id = prefix;
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return id;
}

export function dataURLtoBlob(dataUrl: string) {
  const arr = dataUrl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
}
