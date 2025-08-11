import { axiosInstance } from './asiosInstanse.ts';
import { schema } from 'protected-notes-be/src/db';

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

  static getCurrentUserInfoDetail() {
    return axiosInstance.get(`/api/user-info`);
  }

  static updateUserInfo(body: Partial<schema.UserInfoSelect>) {
    return axiosInstance.put(`/api/user-info`, body);
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
