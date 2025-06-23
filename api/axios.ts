import { getToken } from '@/utils/auth';
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://5f23-165-229-148-177.ngrok-free.app/',
  headers: { 'Content-Type': 'application/json' },
});

// 인터셉터로 요청마다 토큰 주입
instance.interceptors.request.use(
  async (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default instance;
