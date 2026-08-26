import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  plan: 'free' | 'home' | 'pro' | 'commercial';
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setPlan: (plan: 'free' | 'home' | 'pro' | 'commercial') => void;
  setInitialized: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  plan: 'free',
  isInitialized: false,
  setUser: (user) => set({ user }),
  setPlan: (plan) => set({ plan }),
  setInitialized: (val) => set({ isInitialized: val }),
}));