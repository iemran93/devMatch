"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCurrentUser } from '@/lib/requests/auth_requests';
import { APP_ROUTES } from '@/lib/config';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get('success');

  useEffect(() => {
    const handleAuthRedirect = async () => {
      if (success === 'true') {
        try {
          // Try to get the current user to verify authentication worked
          await getCurrentUser();
          
          // Redirect to dashboard on success
          router.push(APP_ROUTES.DASHBOARD);
        } catch (error) {
          console.error('Failed to verify authentication:', error);
          router.push(APP_ROUTES.LOGIN);
        }
      } else {
        // If not successful, redirect to login
        router.push(APP_ROUTES.LOGIN);
      }
    };

    handleAuthRedirect();
  }, [success, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Authenticating...</h1>
        <div className="h-8 w-8 mx-auto animate-spin rounded-full border-b-2 border-current"></div>
      </div>
    </div>
  );
} 