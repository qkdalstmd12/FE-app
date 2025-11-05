import { getToken } from '@/utils/auth';
import axios from 'axios';
import Constants from 'expo-constants';

let instance = null;

if (Constants.expoConfig) {
  // @ts-ignore
  instance = axios.create({
    baseURL: Constants.expoConfig.extra.apiUrl,
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
}

if (instance == null) throw new Error('서버 주소가 존재하지 않습니다.');

export default instance;
