import { axiosAuthedClient } from './axiosAuthedClient';

export const patternApi = {
  get: () => axiosAuthedClient.get('/pattern'),
  save: (id: number, params: object) => axiosAuthedClient.put(`/pattern/${id}`, params),
  register: (params: object) => axiosAuthedClient.post('/pattern', params),
  delete: (id: number) => axiosAuthedClient.delete(`/pattern/${id}`),
};
