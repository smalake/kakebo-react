import axios from "axios";
import { useRecoilValue } from "recoil";
import { tokenAtom } from "../recoil/TokenAtom";

export const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});
const getToken = () => localStorage.getItem("token");

// APIを叩く前に前処理を行う
axiosClient.interceptors.request.use(async (config: any) => {
  // const token = useRecoilValue(tokenAtom);
  return config;
  //   return {
  //     ...config,
  //     headers: {
  //       "Content-Type": "application/json",
  //       authorization: `Bearer ${getToken()}`, //リクエストヘッダーにJWTを付けてサーバに渡す
  //     },
  //   };
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    throw err.response;
  }
);
