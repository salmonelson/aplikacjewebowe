import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../models/Auth";
import { useCarUiStore } from "./useCarUiStore";

interface AuthStore {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => {
        set({ user });
        useCarUiStore.getState().setUser(user.id);
      },
      logout: () => {
        set({ user: null });
        useCarUiStore.getState().setUser(null);
      },
    }),
    { name: "cars-auth-store" },
  ),
);
