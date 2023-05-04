import { axiosClient } from "./axiosClient";

export const setupApi = {
  get: () => axiosClient.get("/setup"),
  create: () => axiosClient.post("/setup"),
};
