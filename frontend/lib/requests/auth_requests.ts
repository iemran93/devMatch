/**
 * API utilities for authentication
 */
import axiosClient from '../axiosClient';
import { AUTH_ROUTES } from '../config';
import {LoginCredentials, SignupCredentials, User, AuthResponse, RefreshTokenResponse } from '../types/auth_types';
import {ErrorResponse} from "../types/error_types"

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await axiosClient.post<AuthResponse>(AUTH_ROUTES.LOGIN, credentials);
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
    const response = await axiosClient.post<AuthResponse>(AUTH_ROUTES.SIGNUP, credentials);
    return response.data;
  } catch (error: any) {
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to sign up');
  }
}

export async function refreshToken(): Promise<RefreshTokenResponse> {
  try {
    const response = await axiosClient.post<RefreshTokenResponse>(AUTH_ROUTES.REFRESH_TOKEN);
    return response.data;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw new Error('Failed to refresh token');
  }
}

export async function getCurrentUser(): Promise<User> {
  try {
    const response = await axiosClient.get<User>(AUTH_ROUTES.USER);
    return response.data;
  } catch (error) {
    console.error('Getting user data failed:', error);
    throw new Error('Failed to get user data');
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await axiosClient.post(AUTH_ROUTES.LOGOUT);
  } catch (error) {
    console.error('Logout failed:', error);
    throw new Error('Failed to logout');
  }
} 