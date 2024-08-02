import { axiosAuthedClient } from './axiosAuthedClient';

export const privateApi = {
  getAll: () => axiosAuthedClient.get('/private'),
  getOne: (id: number) => axiosAuthedClient.get(`/private/${id}`),
  create: (params: any) => axiosAuthedClient.post('/private', params),
  update: (id: number, params: any) => axiosAuthedClient.put(`/private/${id}`, params),
  delete: (id: number) => axiosAuthedClient.delete(`/private/${id}`),
  revision: () => axiosAuthedClient.get('/revision-private'),
};
