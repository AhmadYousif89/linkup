import { create } from "zustand";
import { User } from "@/lib/types";

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
