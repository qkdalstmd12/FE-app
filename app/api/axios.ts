import axios from 'axios';

const api = axios.create({
  baseURL: 'https://b159-1-251-113-151.ngrok-free.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
