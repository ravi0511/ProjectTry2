// src/utils/storage.ts

const TOKEN_KEY = 'authToken';
const USER_KEY = 'user';

export interface StoredUser {
  id: string;
  email: string;
  name: string;
}

/**
 * Store JWT token in localStorage
 */
export function storeToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Retrieve JWT token from localStorage
 */
export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Remove JWT token from localStorage
 */
export function removeStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Store user data in localStorage
 */
export function storeUser(user: StoredUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Retrieve user data from localStorage
 */
export function getStoredUser(): StoredUser | null {
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;

  try {
    return JSON.parse(userJson) as StoredUser;
  } catch {
    return null;
  }
}

/**
 * Remove user data from localStorage
 */
export function removeStoredUser(): void {
  localStorage.removeItem(USER_KEY);
}

/**
 * Clear all authentication data
 */
export function clearAuthData(): void {
  removeStoredToken();
  removeStoredUser();
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getStoredToken();
}
