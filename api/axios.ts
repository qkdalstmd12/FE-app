import axios from 'axios';

const token =
  'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiaHlvamVvbmcwMzA0MDVAZ21haWwuY29tIiwibmFtZSI6Implb25nIiwic3ViIjoiNCIsImlhdCI6MTc1MDU5NjU5NCwiZXhwIjoxODM2OTk2NTk0fQ.m2DyuNJsSyFoWzKJ8l8ALU0jpLPoRQzeSdjrBgMd3gc';

const instance = axios.create({
  baseURL: 'https://8344-58-237-125-70.ngrok-free.app/',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default instance;
