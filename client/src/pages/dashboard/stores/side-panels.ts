import { User } from "@/lib/types";
import { create } from "zustand";

export type Tab = "Connect" | "Messages" | "Groups" | "Requests" | "More" | "";
type ActiveTabState = {
  activeTab: Tab;
  setActiveTab: (activeTab: Tab) => void;
};

export const useActiveTabStore = create<ActiveTabState>((set) => ({
  activeTab: window.innerWidth > 1280 ? "Connect" : "",
  setActiveTab: (activeTab) => set({ activeTab }),
}));

type UserFriendRequestState = {
  friendRequests: User[];
  setFriendRequests: (friendData: User) => void;
};

export const useFriendRequestStore = create<UserFriendRequestState>((set) => ({
  friendRequests: [],
  setFriendRequests: (friendData) =>
    set((state) => {
      const updatedFriendRequests = state.friendRequests.map((friendRequest) =>
        friendRequest.id === friendData.id
          ? { ...friendRequest, sent: true }
          : friendRequest,
      );

      if (!updatedFriendRequests.some((fr) => fr.id === friendData.id)) {
        updatedFriendRequests.push({ ...friendData, sent: true });
      }
      return { friendRequests: updatedFriendRequests };
    }),
}));

type ProfilePanelState = {
  userProfile: User | null;
  setUserProfile: (userProfile: User | null) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const useProfilePanelStore = create<ProfilePanelState>((set) => ({
  userProfile: null,
  setUserProfile: (userProfile) => set({ userProfile }),
  isOpen: window.innerWidth > 1024 ? true : false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));
