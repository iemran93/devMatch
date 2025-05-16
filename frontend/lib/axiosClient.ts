import axios from 'axios';
import { API_CONFIG, APP_ROUTES, AUTH_ROUTES } from './config';

// Create axios instance with default config
const axiosClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': API_CONFIG.CONTENT_TYPE,
  },
  withCredentials: true, // Enable cookies to be sent with requests
});

// Flag to track if a refresh is already in progress
let isRefreshing = false;

// Simple response interceptor to handle unauthorized errors with refresh attempt
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Only attempt refresh if:
    // 1. It's a 401 error
    // 2. We haven't tried to refresh for this request already
    // 3. We're not already in the process of refreshing
    // 4. We're not on the login or signup page
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !isRefreshing &&
      typeof window !== 'undefined' && 
      !window.location.pathname.includes(APP_ROUTES.LOGIN) && 
      !window.location.pathname.includes(APP_ROUTES.SIGNUP)
    ) {
      // Mark that we're attempting a refresh
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        await axiosClient.post(AUTH_ROUTES.REFRESH_TOKEN);
        
        // If successful, retry the original request
        isRefreshing = false;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        isRefreshing = false;
        if (typeof window !== 'undefined') {
          window.location.href = APP_ROUTES.LOGIN;
        }
        return Promise.reject(refreshError);
      }
    }

    // For any other errors, just pass them through
    return Promise.reject(error);
  }
);

export default axiosClient; 