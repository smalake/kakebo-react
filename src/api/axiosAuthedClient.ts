import axios from 'axios';

export const axiosAuthedClient = axios.create({
  baseURL: process.env.REACT_APP_AUTHED_API_URL,
  withCredentials: true,
});
const getToken = () => localStorage.getItem('token') ?? '';

// APIを叩く前に前処理を行う
axiosAuthedClient.interceptors.request.use(async (config: any) => {
  return {
    ...config,
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${getToken()}`, //リクエストヘッダーにJWTを付けてサーバに渡す
    },
  };
});

axiosAuthedClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    return err.response;
  }
);
