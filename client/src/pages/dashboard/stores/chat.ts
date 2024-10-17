import { create } from "zustand";
// import { persist } from "zustand/middleware";

import { Chat, GroupChat, User } from "@/lib/types";

type CurrentChatState = {
  currentChat: Chat | null;
  currentChatUser: User | null;
  setCurrentChat: (data: Chat | null) => void;
};

export const useCurrentChatStore = create<CurrentChatState>()((set) => ({
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

type UserDMsState = {
  userDMs: User[];
  setUserDMs: (users: User[]) => void;
};

export const useUserDMsStore = create<UserDMsState>((set) => ({
  userDMs: [],
  setUserDMs: (users) =>
    set((state) => {
      const updatedUserDMs = state.userDMs.map(
        (user) => users.find((u) => u.id === user.id) || user,
      );

      const newUsers = users.filter(
        (user) => !state.userDMs.some((u) => u.id === user.id),
      );
      return { userDMs: [...updatedUserDMs, ...newUsers] };
    }),
}));

type GroupChatState = {
  groupChats: GroupChat[];
  setGroupChats: (data: GroupChat[]) => void;
};

export const useGroupChatStore = create<GroupChatState>((set) => ({
  groupChats: [],
  setGroupChats: (data) => set(() => ({ groupChats: data })),
}));
