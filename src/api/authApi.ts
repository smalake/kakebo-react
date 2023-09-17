import { axiosClient } from "./axiosClient";

export const authApi = {
  login: (params: object) => axiosClient.post("/login", params),
  logout: () => axiosClient.post("/logout"),
  register: (params: object) => axiosClient.post("/register", params),
  googleLogin: (params: object) => axiosClient.post("/google-login", params),
  join: (params: object) => axiosClient.post("/join", params),
  getName: (group: string) => axiosClient.get(`/get-name/${group}`),
};
