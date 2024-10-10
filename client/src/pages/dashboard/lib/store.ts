import { User } from "@/lib/types";
import { create } from "zustand";

type ProfilePanelState = {
  userProfile: User | null;
  setUserProfile: (userProfile: User) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const useProfilePanelStore = create<ProfilePanelState>((set) => ({
  userProfile: null,
  setUserProfile: (userProfile) => set({ userProfile }),
  isOpen: window.innerWidth > 1024 ? true : false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));

export type Tab = "Connect" | "Messages" | "Rooms" | "Groups" | "More" | "";
type ActiveTabState = {
  activeTab: Tab;
  setActiveTab: (activeTab: Tab) => void;
};

export const useActiveTabStore = create<ActiveTabState>((set) => ({
  activeTab: window.innerWidth > 1280 ? "Messages" : "",
  setActiveTab: (activeTab) => set({ activeTab }),
}));

export type Friend = User & { sent: boolean };
type UserFriendRequestState = {
  friendRequests: Friend[];
  setFriendRequests: (friendData: Friend) => void;
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

type UserDMsState = {
  userDMs: User[];
  setUserDMs: (user: User) => void;
};

export const useUserDMsStore = create<UserDMsState>((set) => ({
  userDMs: [],
  setUserDMs: (user) =>
    set((state) => {
      const updatedUserDMs = state.userDMs.map((userDM) =>
        userDM.id === user.id ? userDM : { ...user },
      );

      if (!updatedUserDMs.some((uDM) => uDM.id === user.id)) {
        updatedUserDMs.push({ ...user });
      }
      console.log(updatedUserDMs);
      return { userDMs: updatedUserDMs };
    }),
}));
