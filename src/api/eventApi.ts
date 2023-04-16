import { axiosClient } from "./axiosClient";

export const eventApi = {
  getAll: () => axiosClient.get("/events"),
  getOne: (id: number) => axiosClient.get(`/events/${id}`),
  create: (params: any) => axiosClient.post("/events", params),
  update: (id: number, params: string) => axiosClient.put(`/events/${id}`, params),
  delete: (id: number) => axiosClient.delete(`/events/${id}`),
};
