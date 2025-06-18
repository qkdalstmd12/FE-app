import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.6:3658/m1/943861-927263-default',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
