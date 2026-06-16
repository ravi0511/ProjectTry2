// src/api/axiosInstance.ts

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { getStoredToken, removeStoredToken } from '../utils/storage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * Automatically attaches JWT token to all requests 
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handles errors and token expiration
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized (token expired or invalid)
    if (error.response?.status === 401) {
      removeStoredToken();
      // Optionally redirect to login page
      window.location.href = '/login';
    }

    // Handle other errors
    const errorMessage =
      (error.response?.data as any)?.error ||
      error.message ||
      'An error occurred';

    console.error('API Error:', errorMessage);

    return Promise.reject(error);
  }
);

export default axiosInstance;
