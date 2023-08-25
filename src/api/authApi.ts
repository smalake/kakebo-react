import { axiosClient } from "./axiosClient";

export const authApi = {
  login: () => axiosClient.post("/login"),
};
