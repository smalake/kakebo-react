import axios from "axios";

export const axiosAuthClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

// APIを叩く前に前処理を行う
axiosAuthClient.interceptors.request.use(async (config) => {
  return config;
});

axiosAuthClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    throw err.response;
  }
);
