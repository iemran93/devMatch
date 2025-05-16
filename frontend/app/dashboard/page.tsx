"use client";

import { useAuth } from "@/context/auth-context";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { user, logout } = useAuth();

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
                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                <p className="text-lg">{user?.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p className="text-lg">{user?.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">User ID</h3>
                <p className="text-sm text-muted-foreground">{user?.id}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => logout()}>Logout</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <p>Active</p>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Your account is in good standing and fully activated.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
} 