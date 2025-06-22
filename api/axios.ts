import { getToken } from '@/utils/auth';
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://mock.apidog.com/m1/971345-956259-default/',
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
  (error) => Promise.reject(error)
);

export default instance;