export type User = {
  id: string;
  name: string;
  clerkId: string;
  email: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

export type Sender = {
  id: string;
  name: string;
  email: string;
  image: string;
};

export type LatestMessage = {
  id: string;
  content: string;
  sender: Sender;
  chatId: string;
  readBy: any[];
  createdAt: string;
  updatedAt: string;
} | null;

export type Chat = {
  id: string;
  chatName: string;
  closedUsers: string[];
  isGroupChat: boolean;
  users: User[];
  createdAt: string;
  updatedAt: string;
  latestMessage: LatestMessage;
};

export type Message = {
  id: string;
  content: string;
  sender: Sender;
  chat: Chat;
  readBy: string[];
  createdAt: string;
  updatedAt: string;
};

type GroupAdmin = User | null;

export type GroupChat = {
  id: string;
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  groupAdmin: GroupAdmin;
  closedUsers: string[];
  createdAt: string;
  updatedAt: string;
};
