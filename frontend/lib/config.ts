export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
  TIMEOUT: 10000, // 10 seconds
  CONTENT_TYPE: 'application/json',
}

export const AUTH_ROUTES = {
  LOGIN: '/login',
  GOOGLELOGIN: '/google/login',
  SIGNUP: '/signup',
  LOGOUT: '/logout',
  REFRESH_TOKEN: '/refresh_token',
  USER: '/user',
}

export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  GOOGLELOGIN: '/google/login',
  SIGNUP: '/signup',
  PROFILE: '/profile',
  DASHBOARD: '/dashboard',
}
