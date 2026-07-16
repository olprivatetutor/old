import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/features/auth/types/auth.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setAuthenticated: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      setAuthenticated: () => set({ isAuthenticated: true }),
      clearAuth: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' },
  ),
);
