import { createContext } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
  login: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
