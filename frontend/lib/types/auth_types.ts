export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  name: string
  username: string
  email: string
  password: string
}

export interface User {
  id: string
  name: string
  username: string
  email: string
  profilePicture?: string
  googleId?: string
}

export interface AuthResponse {
  user: User
  accessToken?: string
  refreshToken?: string
  message?: string
}

export interface RefreshTokenResponse {
  accessToken?: string
  refreshToken?: string
  message?: string
}

export interface GoogleAuthURLResponse {
  url: string
}

export interface ErrorResponse {
  message: string
}
