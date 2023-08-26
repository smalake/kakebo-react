import { axiosClient } from "./axiosClient";

export const authApi = {
  login: () => axiosClient.post("/login"),
  join: (group: number) => axiosClient.post("/join", { group }),
};
