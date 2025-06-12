"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { useToast } from "@/components/ui/use-toast";

const projectStages = ["Idea", "In Progress", "Completed"];

interface FormData {
  title: string;
  description: string;
  goals: string;
  categoryId: string;
  projectTypeId: string;
  stage: string;
  technologies: number[];
  languages: number[];
}

export default function CreateProjectPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    goals: "",
    categoryId: "",
    projectTypeId: "",
    stage: "",
    technologies: [],
    languages: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement API call to create project
      console.log("Form data:", formData);
      
      toast({
        title: "Success",
        description: "Project created successfully!",
      });
      
      router.push("/projects");
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Create New Project</CardTitle>
              <CardDescription>Share your project idea and find collaborators</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter project title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals">Goals</Label>
                <Textarea
                  id="goals"
                  placeholder="What are the main goals of this project?"
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* TODO: Fetch categories from API */}
                    <SelectItem value="1">Web Development</SelectItem>
                    <SelectItem value="2">Mobile Development</SelectItem>
                    <SelectItem value="3">Data Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectType">Project Type</Label>
                <Select
                  value={formData.projectTypeId}
                  onValueChange={(value) => setFormData({ ...formData, projectTypeId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project type" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* TODO: Fetch project types from API */}
                    <SelectItem value="1">Personal Project</SelectItem>
                    <SelectItem value="2">Team Project</SelectItem>
                    <SelectItem value="3">Open Source</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Select
                  value={formData.stage}
                  onValueChange={(value) => setFormData({ ...formData, stage: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectStages.map((stage) => (
                      <SelectItem key={stage} value={stage.toLowerCase()}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Technologies</Label>
                <MultiSelect
                  placeholder="Select technologies"
                  value={formData.technologies}
                  options={[
                    // TODO: Fetch from API
                    { label: "React", value: 1 },
                    { label: "Node.js", value: 2 },
                    { label: "Python", value: 3 },
                  ]}
                  onChange={(selected) => setFormData({ ...formData, technologies: selected })}
                />
              </div>

              <div className="space-y-2">
                <Label>Programming Languages</Label>
                <MultiSelect
                  placeholder="Select languages"
                  value={formData.languages}
                  options={[
                    // TODO: Fetch from API
                    { label: "JavaScript", value: 1 },
                    { label: "TypeScript", value: 2 },
                    { label: "Python", value: 3 },
                  ]}
                  onChange={(selected) => setFormData({ ...formData, languages: selected })}
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Project"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </ProtectedRoute>
  );
} 