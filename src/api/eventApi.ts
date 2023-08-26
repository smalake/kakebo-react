import { EventID } from "../types";
import { axiosClient } from "./axiosClient";

export const eventApi = {
  getAll: () => axiosClient.get("/event"),
  getOne: (id: number) => axiosClient.get(`/event/${id}`),
  create: (params: any) => axiosClient.post("/event", params),
  update: (params: any) => axiosClient.put("/event", params),
  delete: (param: EventID) => axiosClient.delete("/event", { data: param }),
};
