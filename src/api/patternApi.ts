import { axiosClient } from "./axiosClient";

export const patternApi = {
  get: () => axiosClient.get("/pattern"),
  save: (id: number, params: object) => axiosClient.put(`/pattern/${id}`, params),
  register: (params: object) => axiosClient.post("/pattern", params),
  delete: (id: number) => axiosClient.delete(`/pattern/${id}`),
};
