import { create } from "zustand";
// import { persist } from "zustand/middleware";

import { Chat, GroupChat, User } from "@/lib/types";

type CurrentChatState = {
  currentChat: Chat | null;
  currentChatUser: User | null;
  setCurrentChat: (data: Chat | null) => void;
};

export const useCurrentChatStore = create<CurrentChatState>((set) => ({
  currentChat: null,
  currentChatUser: null,
  setCurrentChat: (data) =>
    set(() => {
      if (data) {
        return {
          currentChat: data,
          currentChatUser: data.users[0],
        };
      }
      return {
        currentChat: data,
        currentChatUser: null,
      };
    }),
}));

type GroupChatState = {
  groupChats: GroupChat[];
  setGroupChats: (data: GroupChat[]) => void;
  currentGroupChat: GroupChat | null;
  setCurrentGroupChat: (chatId: string) => void;
};

export const useGroupChatStore = create<GroupChatState>((set) => ({
  groupChats: [],
  setGroupChats: (data) => set(() => ({ groupChats: data })),

  currentGroupChat: null,
  setCurrentGroupChat: (chatId) =>
    set((state) => {
      return {
        currentGroupChat:
          state.groupChats.find((chat) => chat.id === chatId) || null,
      };
    }),
}));
