"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProjectsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Link href="/projects/create">
          <Button>Create Project</Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* TODO: Replace with actual projects from API */}
        <Card>
          <CardHeader>
            <CardTitle>Example Project</CardTitle>
            <CardDescription>This is an example project card</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Project details will be displayed here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 