import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  name: string;
  username: string;
  token: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void; // logout
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),              
      clearUser: () => set({ user: null }),         
    }),
    {
      name: "auth-storage", 
    }
  )
);
