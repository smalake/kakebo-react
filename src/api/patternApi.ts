import { axiosClient } from "./axiosClient";

export const patternApi = {
  get: () => axiosClient.get("/pattern"),
};
