import { getToken } from '@/utils/auth';
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://f26b-58-237-125-70.ngrok-free.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    console.log('axios', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default instance;
