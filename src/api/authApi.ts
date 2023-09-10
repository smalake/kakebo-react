import { axiosClient } from "./axiosClient";

export const authApi = {
  login: (params: object) => axiosClient.post("/login", params),
  logout: () => axiosClient.post("/logout"),
  register: (params: object) => axiosClient.post("/register", params),
  join: (group: number) => axiosClient.post("/join", { group }),
};
