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
  notificationCount: number;
  setNotificationCount: (count: number) => void;
  eventsCount: number;
  setEventsCount: (count: number) => void;
}

export const useUserStore = create<UserStore>(set => ({
  user: null,
  setUser: user => set({ user }),
  clearUser: () => set({ user: null }),
  notificationCount: 0,
  setNotificationCount: count => set({ notificationCount: count }),
  eventsCount: 0,
  setEventsCount: count => set({ eventsCount: count }),
}));
