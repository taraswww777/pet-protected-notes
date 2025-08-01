import { axiosInstance } from './asiosInstanse.ts';

export class AuthServiceApi {
  static login(body: { login: string, password: string }) {
    return axiosInstance.post(`/api/auth/login`, body)
  }
  static register(body: { login: string, password: string }){
    return axiosInstance.post(`/api/auth/register`, body)
  }
}
