import { axiosInstance } from './asiosInstanse.ts';

export class AuthServiceApi {
  static login(body: { login: string, password: string }) {
    return axiosInstance.post(`/api/auth/login`, body);
  }

  static register(body: { login: string, password: string }) {
    return axiosInstance.post(`/api/auth/register`, body);
  }

  static getCurrentUserInfo() {
    return axiosInstance.get(`/api/auth/current-user-info`);
  }

  static changePassword(body: { oldPassword: string; newPassword: string }) {
    return axiosInstance.put(`/api/auth/change-password`, body);
  }

  static recoverPassword(body: { login: string }) {
    return axiosInstance.post('/api/auth/forgot-password', body);
  }

  static resetPassword(body: {
    login: string;
    resetCode: string;
    newPassword: string;
  }) {
    return axiosInstance.post('/api/auth/reset-password', body);
  }
}
