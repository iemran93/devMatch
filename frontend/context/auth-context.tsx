"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { 
  User, 
  LoginCredentials, 
  SignupCredentials,
  loginUser,
  signupUser,
  getCurrentUser,
  logoutUser,
  refreshToken as refreshTokenApi
} from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Function to refresh the access token
  const refreshAccessToken = async (): Promise<boolean> => {
    const currentRefreshToken = localStorage.getItem("refreshToken");
    if (!currentRefreshToken) {
      return false;
    }

    try {
      const response = await refreshTokenApi(currentRefreshToken);
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      return true;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      // Clear tokens on refresh failure
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      return false;
    }
  };

  // Function to initialize auth state
  const initializeAuth = async () => {
    if (typeof window === 'undefined') return; // Skip on server-side

    setIsLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    
    if (accessToken) {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error("Failed to get user with access token:", err);
        
        // Try to refresh the token and retry
        const refreshSuccess = await refreshAccessToken();
        if (refreshSuccess) {
          try {
            const userData = await getCurrentUser();
            setUser(userData);
          } catch (refreshErr) {
            console.error("Failed to get user after token refresh:", refreshErr);
            // Clear tokens on authentication failure
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
          }
        }
      }
    }
    
    setIsLoading(false);
  };

  // Initialize auth on client-side only
  useEffect(() => {
    initializeAuth();
  }, []);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Store both tokens in localStorage
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      
      setUser(data.user);
      setError(null);
      router.push("/"); // Redirect to home/dashboard after login
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      // Store both tokens in localStorage
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      
      setUser(data.user);
      setError(null);
      router.push("/"); // Redirect to home/dashboard after signup
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // Clear both tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      
      setUser(null);
      queryClient.clear(); // Clear all queries in the cache
      router.push("/login");
    },
    onError: (error: Error) => {
      console.error("Logout failed:", error);
      // Still remove tokens and user state on error
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      
      setUser(null);
      router.push("/login");
    },
  });

  const login = async (credentials: LoginCredentials) => {
    await loginMutation.mutateAsync(credentials);
  };

  const signup = async (credentials: SignupCredentials) => {
    await signupMutation.mutateAsync(credentials);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const value = {
    user,
    isLoading: isLoading || loginMutation.isPending || signupMutation.isPending || logoutMutation.isPending,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    refreshAccessToken,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 