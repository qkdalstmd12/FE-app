import { getToken } from '@/utils/auth';
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://895a-58-237-125-70.ngrok-free.app/',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
