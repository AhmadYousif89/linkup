import { User } from "@/lib/types";
import { create } from "zustand";

export type Tab = "Connect" | "Messages" | "Rooms" | "Requests" | "More" | "";
type ActiveTabState = {
  activeTab: Tab;
  setActiveTab: (activeTab: Tab) => void;
};

export const useActiveTabStore = create<ActiveTabState>((set) => ({
  activeTab: window.innerWidth > 1280 ? "Connect" : "",
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
