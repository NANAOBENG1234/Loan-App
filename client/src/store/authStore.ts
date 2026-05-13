import { create } from "zustand";
import { User } from "@/types/auth.types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),
  setToken: (token) => set({ token }),
  setLoading: (loading) => set({ isLoading: loading }),
  logout: () => {
    if (typeof window !== "undefined") {
      document.cookie = "token=; Max-Age=0; path=/";
    }
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },
}));
