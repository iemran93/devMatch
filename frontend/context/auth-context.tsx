"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { 
  loginUser,
  signupUser,
  getCurrentUser,
  logoutUser,
} from "@/lib/requests/auth_requests";
import {  User, 
  LoginCredentials, 
  SignupCredentials} from '../lib/types/auth_types'
import { APP_ROUTES } from "@/lib/config";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Function to initialize auth state
  const initializeAuth = async () => {
    if (typeof window === 'undefined') return; // Skip on server-side

    setIsLoading(true);
    
    try {
      // Simply try to get the current user
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (err) {
      // If unsuccessful, user is not authenticated
      console.error("Failed to get user:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize auth on client-side only
  useEffect(() => {
    initializeAuth();
  }, []);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setUser(data.user);
      setError(null);
      router.push(APP_ROUTES.HOME); // Redirect to home/dashboard after login
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      setUser(data.user);
      setError(null);
      router.push(APP_ROUTES.HOME); // Redirect to home/dashboard after signup
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      setUser(null);
      queryClient.clear(); // Clear all queries in the cache
      router.push(APP_ROUTES.LOGIN);
    },
    onError: (error: Error) => {
      console.error("Logout failed:", error);
      // Still remove user state on error
      setUser(null);
      router.push(APP_ROUTES.LOGIN);
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