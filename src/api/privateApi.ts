import { axiosClient } from "./axiosClient";

export const privateApi = {
  getAll: () => axiosClient.get("/private"),
  getOne: (id: number) => axiosClient.get(`/private/${id}`),
  create: (params: any) => axiosClient.post("/private", params),
  update: (id: number, params: any) => axiosClient.put(`/private/${id}`, params),
  delete: (id: number) => axiosClient.delete(`/private/${id}`),
};
