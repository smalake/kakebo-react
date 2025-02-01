import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { auth } from '../components/util/firebase';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const axiosAuthedClient = axios.create({
  baseURL: process.env.REACT_APP_AUTHED_API_URL,
  withCredentials: true,
});
const getToken = async () => localStorage.getItem('token') ?? '';

async function refreshToken(): Promise<string | null> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('ユーザーが見つかりません');
    }
    const newToken = await currentUser.getIdToken(true);
    localStorage.setItem('token', newToken);
    return newToken;
  } catch (err) {
    console.error('トークンの更新に失敗しました:', err);
    alert('トークンの更新に失敗しました');
    return null;
  }
}

// APIを叩く前に前処理を行う
axiosAuthedClient.interceptors.request.use(async (config: any) => {
  return {
    ...config,
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${await getToken()}`, //リクエストヘッダーにJWTを付けてサーバに渡す
    },
  };
});

// レスポンス処理
axiosAuthedClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // 401エラーかつ、リトライフラグが立っていない場合
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      // トークンをリフレッシュ
      const newToken = await refreshToken();
      if (newToken) {
        // 新しいトークンでリクエストを再試行
        originalRequest.headers.authorization = `Bearer ${newToken}`;
        return axiosAuthedClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);
