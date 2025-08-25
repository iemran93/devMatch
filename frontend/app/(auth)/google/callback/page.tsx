'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { APP_ROUTES } from '@/lib/config'
import { useAuth } from '@/context/auth-context'

export default function GoogleCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  )
  const [errorMessage, setErrorMessage] = useState<string>('')
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    // The page will receive the OAuth code from Google in the URL
    // No need to do anything here as the backend handles the code exchange
    // The cookies should be set automatically by the backend

    const checkAuthStatus = async () => {
      try {
        // If we're already authenticated (meaning our cookies are valid)
        // we can redirect to the home page
        if (isAuthenticated) {
          setStatus('success')
          // Small delay to show success message
          setTimeout(() => {
            router.push(APP_ROUTES.HOME)
          }, 1500)
        } else {
          // Poll authentication status a few times
          let attempts = 0
          const maxAttempts = 5
          const interval = setInterval(async () => {
            attempts++

            // If we become authenticated during polling
            if (isAuthenticated) {
              clearInterval(interval)
              setStatus('success')
              setTimeout(() => {
                router.push(APP_ROUTES.HOME)
              }, 1500)
              return
            }

            // If we've reached max attempts, show error
            if (attempts >= maxAttempts) {
              clearInterval(interval)
              setStatus('error')
              setErrorMessage('Authentication timed out. Please try again.')
            }
          }, 1000)
        }
      } catch (error) {
        console.error('Error during Google sign-in:', error)
        setStatus('error')
        setErrorMessage('An error occurred during sign-in. Please try again.')
      }
    }

    checkAuthStatus()
  }, [router, isAuthenticated])

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            {status === 'loading' && (
              <>
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mb-4"></div>
                <h2 className="text-xl font-medium">
                  Authenticating with Google
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Please wait...
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-medium">Sign-in Successful!</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Redirecting you to the home page...
                </p>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-medium">Authentication Failed</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  {errorMessage}
                </p>
                <button
                  onClick={() => router.push(APP_ROUTES.LOGIN)}
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Return to Login
                </button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
