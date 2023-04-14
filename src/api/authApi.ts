import { axiosClient } from "./axiosClient";

export const authApi = {
  register: (params: string) => axiosClient.post("/register", params),
  login: (params: string) => axiosClient.post("/login", params),
};
