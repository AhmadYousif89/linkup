import { User } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Message = { id: string; message: string; username: string };

type CurrentChatState = {
  currentChatUser: User | null;
  setCurrentChatUser: (user: User | null) => void;
  currentChatData: Message[];
  setCurrentChatData: (data: Message[]) => void;
};

export const useCurrentChatStore = create<CurrentChatState>()(
  persist(
    (set) => ({
      currentChatUser: null,
      setCurrentChatUser: (user) => set({ currentChatUser: user }),

      currentChatData: [],
      setCurrentChatData: (data) => set({ currentChatData: data }),
    }),
    {
      name: "current-chat",
    },
  ),
);
