import { createContext } from 'react';

export interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
  login: (credentials: { login: string, password: string }) => void;
  register: (credentials: { login: string, password: string }) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
