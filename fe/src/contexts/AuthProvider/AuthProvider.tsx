import { FC, PropsWithChildren, useState } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router';


export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = () => {
    setIsAuthenticated(false);
  };

  const login = () => {
    setIsAuthenticated(true);
    navigate('/');
  };


  return (
    <AuthContext.Provider value={{ isAuthenticated, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};
