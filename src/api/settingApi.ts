import { axiosClient } from "./axiosClient";

export const settingApi = {
  getName: () => axiosClient.get("/display-name"),
  updateName: (params: any) => axiosClient.put("display-name", params),
  invite: () => axiosClient.get("/invite"),
  isParent: () => axiosClient.get("/is-parent"),
};
