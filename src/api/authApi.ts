import { RegisterData } from '../types';
import { axiosAuthedClient } from './axiosAuthedClient';
import { axiosClient } from './axiosClient';

export const authApi = {
  login: (params: object) => axiosClient.post('/login', params),
  logout: () => axiosClient.post('/logout'),
  register: (params: RegisterData) => axiosClient.post('/register', params),
  join: (params: RegisterData) => axiosClient.post('/join', params),
  isLogin: () => axiosAuthedClient.get('/login-check'),
};
