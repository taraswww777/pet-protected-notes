import { FC, PropsWithChildren, useState } from 'react';
import { AuthContext, AuthContextType } from './AuthContext';
import { useNavigate } from 'react-router';
import { AuthServiceApi } from '../../api/AuthServiceApi.ts';
import { axiosInstance } from '../../api/asiosInstanse.ts';

const JWT_TOKEN_NAME = 'JWT_TOKEN';

const removeJwtToken = () => {
  return window.localStorage.removeItem(JWT_TOKEN_NAME);
};
const getJwtToken = () => {
  return window.localStorage.getItem(JWT_TOKEN_NAME);
};

const setJwtToken = (tokenValue: string) => {
  return window.localStorage.setItem(JWT_TOKEN_NAME, tokenValue);
};

const setTokenAxiosInstanse = (token?: string | null) => {
  if (!token) {
    return;
  }

  // Добавляем интерцептор запроса
  axiosInstance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    });
};

setTokenAxiosInstanse(getJwtToken());

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getJwtToken()));

  const logout = () => {
    removeJwtToken();
    setIsAuthenticated(false);
  };

  const login: AuthContextType['login'] = ({ login, password }) => {
    AuthServiceApi.login({
      login,
      password,
    }).then(({ data: { token } }) => {

      setTokenAxiosInstanse(token);

      setJwtToken(token);
      setIsAuthenticated(true);
      navigate('/');
    });
  };

  const register: AuthContextType['login'] = (credentials) => {
    AuthServiceApi.register(credentials).then(() => {
      login(credentials);
    }).catch((e) => {
      if (e.name === 'AxiosError') {
        const message = e.response.data.error || e.message;

        alert(message);
      }
    });
  };


  return (
    <AuthContext.Provider value={{ isAuthenticated, logout, login, register }}>
      {children}
    </AuthContext.Provider>
  );
};
