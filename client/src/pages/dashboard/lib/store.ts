import { create } from "zustand";

type ProfilePanelState = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const useProfilePanelStore = create<ProfilePanelState>((set) => ({
  isOpen: window.innerWidth > 1024 ? true : false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));
