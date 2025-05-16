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
    profilePicture?: string;
    googleId?: string;
    // Add other user properties as needed
  }
  
  export interface AuthResponse {
    user: User;
    // These will now be set as cookies by the server
    accessToken?: string;
    refreshToken?: string;
    message?: string;
  }
  
  export interface RefreshTokenResponse {
    // These will now be set as cookies by the server
    accessToken?: string;
    refreshToken?: string;
    message?: string;
  }

  export interface GoogleAuthURLResponse {
    url: string;
  }

  export interface ErrorResponse {
    message: string;
  }