import axios from 'axios';
import type { ErrorResponseType } from '../types/index';
import { routes } from '@routes/routes';

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
    if (error.response) {
      if (
        error.response.status === 401 &&
        window.location.pathname !== routes.LOGIN
      ) {
        localStorage.removeItem('jwt');
        window.location.href = routes.LOGIN;
      }
      return Promise.reject(
        new Error(error.response.data.message || error.message),
      );
    }

    return Promise.reject(
      new Error('Greška pri povezivanju s poslužiteljem'),
    );
  },
);
