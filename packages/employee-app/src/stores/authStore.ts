import { create } from 'zustand';

interface EmployeeUser {
  id: string; email: string; name: string; role: string;
  employeeId?: string; firstName?: string; lastName?: string;
}

interface AuthState {
  user: EmployeeUser | null;
  token: string | null;
  login: (token: string, user: EmployeeUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('emp-user') || 'null'),
  token: localStorage.getItem('emp-token'),
  get isAuthenticated() { return !!localStorage.getItem('emp-token'); },
  login: (token, user) => {
    localStorage.setItem('emp-token', token);
    localStorage.setItem('emp-user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('emp-token');
    localStorage.removeItem('emp-user');
    set({ token: null, user: null });
  },
}));
