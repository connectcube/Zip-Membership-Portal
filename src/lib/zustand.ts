import { create } from 'zustand';

interface UserProfile {
  isAdmin?: boolean;
  uid: string;
  email: string;
  rememberMe?: boolean;
  profile: Record<string, any>;
}

interface UserStore {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>(set => ({
  user: null,
  setUser: user => set({ user }),
  clearUser: () => set({ user: null }),
}));
