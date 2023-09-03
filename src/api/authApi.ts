import { axiosClient } from "./axiosClient";

export const authApi = {
  register: (params: object) => axiosClient.post("/api/register", params),
  join: (group: number) => axiosClient.post("/join", { group }),
};
