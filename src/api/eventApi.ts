import { axiosClient } from "./axiosClient";

export const eventApi = {
  getAll: () => axiosClient.get("/event"),
  getOne: (id: number) => axiosClient.get(`/event/${id}`),
  create: (params: any) => axiosClient.post("/event", params),
  update: (id: number, params: any) => axiosClient.put(`/event/${id}`, params),
  delete: (id: number) => axiosClient.delete(`/event/${id}`),
};
