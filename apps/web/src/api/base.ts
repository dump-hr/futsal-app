import axios from 'axios';
import type { ErrorResponseType } from '../types/index';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const tokenItem = localStorage.getItem('jwt');
  if (tokenItem) {
    const token = tokenItem;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error: ErrorResponseType) => {
    if (error.response)
      return Promise.reject(error.response.data.message || error.message);

    return Promise.reject('Network error');
  },
);
