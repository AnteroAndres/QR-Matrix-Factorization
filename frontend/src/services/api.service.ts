import axios, { AxiosInstance, AxiosError } from 'axios';
import { GO_API_URL, TOKEN_KEY } from '../utils/constants';
import { QRFactorizationResponse } from '../types/matrix.types';
import toast from 'react-hot-toast';

const api: AxiosInstance = axios.create({
  baseURL: GO_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      toast.error('Session expired. Please login again.');
      window.location.href = '/';
    } else if (error.response?.status === 400) {
      const message =
        (error.response.data as any)?.error || 'Invalid request';
      toast.error(message);
    } else {
      toast.error('An error occurred. Please try again.');
    }
    return Promise.reject(error);
  }
);

export const matrixService = {
  calculateQR: async (
    matrix: number[][]
  ): Promise<QRFactorizationResponse> => {
    const response = await api.post<QRFactorizationResponse>(
      '/api/v1/matrix/qr',
      { matrix }
    );
    return response.data;
  },

  login: async (username: string, password: string): Promise<string> => {
    const response = await api.post<{ token: string }>('/api/v1/login', {
      username,
      password,
    });
    return response.data.token;
  },
};

