export type User = {
  id: string;
  chatId: string;
  name: string;
  email: string;
  image: string;
  timestamp: string;
};

type UserDM = Partial<User>;
type Chat = {
  id: string;
  name: string;
  isGroup: boolean;
  users: UserDM[];
  latestMessage: string;
};

export type Message = {
  id: string;
  chat: Chat;
  text: string;
  sender: UserDM;
  readBy: UserDM[];
  timestamp: string;
};
