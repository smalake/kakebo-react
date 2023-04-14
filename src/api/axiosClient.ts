import axios from "axios";

const BASE_URL = "http://localhost:8088";

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// APIを叩く前に前処理を行う
axiosClient.interceptors.request.use(async (config) => {
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    throw err.response;
  }
);
