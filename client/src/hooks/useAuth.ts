// src/hooks/useAuth.ts

import { useState, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import { storeToken, storeUser, clearAuthData, getStoredUser } from '../utils/storage';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

/**
 * Custom hook for authentication management
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const signup = useCallback(
    async (email: string, password: string, name: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.post('/auth/signup', {
          email,
          password,
          name,
        });

        const { token, user: userData } = response.data.data;
        storeToken(token);
        storeUser(userData);
        setUser(userData);
      } catch (err: any) {
        const message =
          err.response?.data?.error ||
          err.message ||
          'Signup failed. Please try again.';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.post('/auth/login', {
          email,
          password,
        });

        const { token, user: userData } = response.data.data;
        storeToken(token);
        storeUser(userData);
        setUser(userData);
      } catch (err: any) {
        const message =
          err.response?.data?.error ||
          err.message ||
          'Login failed. Please try again.';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    clearAuthData();
    setUser(null);
    setError(null);
  }, []);

  return {
    user,
    isLoading,
    error,
    signup,
    login,
    logout,
    clearError,
  };
}
