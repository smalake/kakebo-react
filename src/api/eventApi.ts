import { axiosAuthedClient } from './axiosAuthedClient';

export const eventApi = {
  getAll: () => axiosAuthedClient.get('/event'),
  getOne: (id: number) => axiosAuthedClient.get(`/event/${id}`),
  create: (params: any) => axiosAuthedClient.post('/event', params),
  update: (id: number, params: any) => axiosAuthedClient.put(`/event/${id}`, params),
  delete: (id: number) => axiosAuthedClient.delete(`/event/${id}`),
  revision: () => axiosAuthedClient.get('/revision'),
};
