"use client";

import { Button } from "@/components/ui/button";
import { initiateGoogleLogin } from "@/lib/requests/auth_requests";
import { FaGoogle } from "react-icons/fa";
import { useState } from "react";

interface GoogleLoginButtonProps {
  className?: string;
}

export function GoogleLoginButton({ className = "" }: GoogleLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    try {
      setIsLoading(true);
      // Call the simplified Google login function
      initiateGoogleLogin();
      // Loading state will remain true as we're redirecting away
    } catch (error) {
      setIsLoading(false);
      console.error("Google login failed:", error);
    }
  };

  return (
    <Button
      variant="outline"
      type="button"
      disabled={isLoading}
      className={`w-full flex items-center justify-center gap-2 ${className}`}
      onClick={handleGoogleLogin}
    >
      {isLoading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-current" />
      ) : (
        <FaGoogle size={16} />
      )}
      Continue with Google
    </Button>
  );
} 