import { axiosAuthClient } from "./axiosAuthClient";

export const authApi = {
  register: (params: string) => axiosAuthClient.post("/register", params),
  login: (params: string) => axiosAuthClient.post("/login", params),
};
