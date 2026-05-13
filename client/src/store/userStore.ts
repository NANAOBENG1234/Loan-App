import { create } from "zustand";

interface UserSettings {
  id: string;
  userId: string;
  notificationsEnabled: boolean;
  preferredLanguage: string;
}

interface UserState {
  settings: UserSettings | null;
  isUpdating: boolean;
  setSettings: (settings: UserSettings) => void;
  setUpdating: (updating: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  settings: null,
  isUpdating: false,
  setSettings: (settings) => set({ settings }),
  setUpdating: (isUpdating) => set({ isUpdating }),
}));
