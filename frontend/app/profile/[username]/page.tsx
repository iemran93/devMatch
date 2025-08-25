'use client'

import { useAuth } from '@/context/auth-context'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useParams } from 'next/navigation'
import { useGetUserByUsername } from '@/lib/requests/user_requests'
import { Loading } from '@/components/layout/loading'
import { User } from '@/lib/types/auth_types'
import { Route } from 'lucide-react'

export default function ProfilePage() {
  const params = useParams()
  const { user, logout } = useAuth()

  const username = params.username as string

  // query
  const {
    data: userData,
    isLoading: userDataLoading,
    isError,
  } = useGetUserByUsername(username)

  let profileData = {} as User
  if (userData?.id == user?.id) {
    profileData = user!
  } else {
    profileData = {
      id: userData?.id as string,
      name: userData?.name as string,
      username: userData?.username as string,
      profilePicture: userData?.profilePicture,
      availability: userData?.availability as boolean,
    }
  }
  if (userDataLoading) {
    return <Loading />
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Name
                </h3>
                <p className="text-lg">{profileData?.name}</p>
              </div>
              {profileData.email && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Email
                  </h3>
                  <p className="text-lg">{user?.email}</p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  User ID
                </h3>
                <p className="text-sm text-muted-foreground">
                  {profileData?.id}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => logout()}>
                Logout
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${profileData.availability ? 'bg-green-500' : 'bg-red-500'}`}
                ></div>
                {profileData.availability ? (
                  <p>Available</p>
                ) : (
                  <p>Not available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
