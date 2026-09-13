import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  plazaId: string | null;
  login: (token: string, user: User, plazaId?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      plazaId: null,
      login: (token, user, plazaId) => set({ token, user, isAuthenticated: true, plazaId: plazaId || null }),
      logout: () => set({ token: null, user: null, isAuthenticated: false, plazaId: null }),
    }),
    { name: 'plaza-auth-storage' }
  )
);
