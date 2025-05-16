/**
 * API utilities for authentication
 */
import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  message?: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ErrorResponse {
  message: string;
}

// Add a request interceptor to automatically add the token to requests
api.interceptors.request.use(
  (config) => {
    // For endpoints that need authentication
    if (
      !config.url?.includes('/login') && 
      !config.url?.includes('/signup') && 
      !config.url?.includes('/refresh-token')
    ) {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>('/login', credentials);
    return response.data;
  } catch (error: any) {
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to login');
  }
}

export async function signupUser(credentials: SignupCredentials): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>('/signup', credentials);
    return response.data;
  } catch (error: any) {
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to sign up');
  }
}

export async function refreshToken(refreshTokenValue: string): Promise<RefreshTokenResponse> {
  try {
    const response = await api.post<RefreshTokenResponse>('/refresh-token', {
      refreshToken: refreshTokenValue,
    });
    return response.data;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw new Error('Failed to refresh token');
  }
}

export async function getCurrentUser(): Promise<User> {
  try {
    const response = await api.get<User>('/user');
    return response.data;
  } catch (error) {
    console.error('Getting user data failed:', error);
    throw new Error('Failed to get user data');
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await api.post('/logout');
  } catch (error) {
    console.error('Logout failed:', error);
    throw new Error('Failed to logout');
  }
} 