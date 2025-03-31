import { useState, FC, PropsWithChildren } from 'react';
import { AuthContext } from './AuthContext';


export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = () => {
    setIsAuthenticated(false);
  };

  const login = () => {
    setIsAuthenticated(true);
  };


  return (
    <AuthContext.Provider value={{ isAuthenticated, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};
