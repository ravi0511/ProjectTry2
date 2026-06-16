// src/types/index.ts

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Item {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthPayload {
  email: string;
  password: string;
}

export interface SignupPayload extends AuthPayload {
  name: string;
}

export interface CreateItemPayload {
  title: string;
  description: string;
  dueDate?: Date;
}

export interface UpdateItemPayload {
  title?: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  dueDate?: Date;
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
