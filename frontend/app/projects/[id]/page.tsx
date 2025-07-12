"use client"

import { Loading } from "@/components/layout/loading"
import {
  useGetProjectById,
  useDeleteProject,
  useUpdateProject,
} from "@/lib/requests/project_requests"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Calendar,
  User,
  ExternalLink,
  Users,
  Target,
  Briefcase,
  Star,
  Clock,
  Edit,
  Trash2,
  Plus,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useParams, useRouter } from "next/navigation"
import {
  getStageColor,
  getStageIcon,
  getExperienceLevelText,
} from "@/components/layout/components_helper"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { ProjectRolesRequest } from "@/lib/types/project_types"

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()

  // State for managing edit dialogs
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false)
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<any>(null)
  const [newRole, setNewRole] = useState<ProjectRolesRequest>({
    title: "",
    description: "",
    required_experience_level: 1,
    is_filled: false,
  })

  const {
    data: project,
    isLoading: projectLoading,
    isError,
  } = useGetProjectById(id)

  const deleteProjectMutation = useDeleteProject()
  const updateProjectMutation = useUpdateProject(id)

  // Check if current user is the project creator
  const isCreator = user?.id === project?.creator.id

  const handleDeleteProject = async () => {
    try {
      await deleteProjectMutation.mutateAsync(id)
      toast({
        title: "Success",
        description: "Project deleted successfully",
      })
      router.push("/projects")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      })
    }
  }

  const handleAddRole = async () => {
    try {
      // Convert existing roles to request format
      const existingRoles: ProjectRolesRequest[] =
        project?.project_roles.map((role) => ({
          title: role.title,
          description: role.description,
          required_experience_level: parseInt(role.required_experience_level),
          is_filled: role.is_filled,
        })) || []

      const updatedRoles = [...existingRoles, newRole]

      // Send complete project data as required by API
      const projectData = {
        title: project!.title,
        description: project!.description,
        goals: project!.goals,
        category_id: project!.category.id,
        stage: project!.stage as "Idea" | "In Progress" | "Completed",
        project_type: project!.types.map((type) => type.id),
        technologies: project!.technologies?.map((tech) => tech.id) || [],
        languages: project!.languages?.map((lang) => lang.id) || [],
        project_roles: updatedRoles,
      }

      await updateProjectMutation.mutateAsync(projectData)
      toast({
        title: "Success",
        description: "Role added successfully",
      })
      setIsAddRoleDialogOpen(false)
      setNewRole({
        title: "",
        description: "",
        required_experience_level: 1,
        is_filled: false,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add role",
        variant: "destructive",
      })
    }
  }

  const handleUpdateRole = async () => {
    try {
      // Convert all roles to request format
      const updatedRoles: ProjectRolesRequest[] =
        project?.project_roles.map((role) =>
          role.id === editingRole.id
            ? {
                title: editingRole.title,
                description: editingRole.description,
                required_experience_level: parseInt(
                  editingRole.required_experience_level
                ),
                is_filled: editingRole.is_filled,
              }
            : {
                title: role.title,
                description: role.description,
                required_experience_level: parseInt(
                  role.required_experience_level
                ),
                is_filled: role.is_filled,
              }
        ) || []

      // Send complete project data as required by API
      const projectData = {
        title: project!.title,
        description: project!.description,
        goals: project!.goals,
        category_id: project!.category.id,
        stage: project!.stage as "Idea" | "In Progress" | "Completed",
        project_type: project!.types.map((type) => type.id),
        technologies: project!.technologies?.map((tech) => tech.id) || [],
        languages: project!.languages?.map((lang) => lang.id) || [],
        project_roles: updatedRoles,
      }

      await updateProjectMutation.mutateAsync(projectData)
      toast({
        title: "Success",
        description: "Role updated successfully",
      })
      setIsEditRoleDialogOpen(false)
      setEditingRole(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      })
    }
  }

  if (projectLoading) {
    return <Loading />
  }

  if (isError || !project) {
    return (
      <div className="container mx-auto py-24 text-center">
        <h1 className="text-2xl font-bold text-muted-foreground">
          Project not found
        </h1>
        <p className="text-muted-foreground mt-2">
          The project you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
    )
  }

  const StageIcon = getStageIcon(project.stage)

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{project.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Created {new Date(project.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  Updated {new Date(project.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={`${getStageColor(project.stage)} px-3 py-1`}
            >
              <StageIcon className="h-4 w-4 mr-1" />
              {project.stage}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              {project.category.name}
            </Badge>

            {/* Creator Controls */}
            {isCreator && (
              <div className="flex items-center gap-2 ml-4">
                <Dialog
                  open={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Project</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this project? This
                        action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsDeleteDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleDeleteProject()
                          setIsDeleteDialogOpen(false)
                        }}
                      >
                        Delete Project
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>

        {/* Creator Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Project Creator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={project.creator.profilePicture || ""} />
                <AvatarFallback>
                  {project.creator.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{project.creator.name}</p>
                <p className="text-sm text-muted-foreground">
                  {project.creator.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About This Project</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </CardContent>
          </Card>

          {/* Goals */}
          {project.goals && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Project Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {project.goals}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Project Roles */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Available Roles
                </CardTitle>
                {isCreator && (
                  <Dialog
                    open={isAddRoleDialogOpen}
                    onOpenChange={setIsAddRoleDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Role
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Role</DialogTitle>
                        <DialogDescription>
                          Add a new role to your project
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={newRole.title}
                            onChange={(e) =>
                              setNewRole({ ...newRole, title: e.target.value })
                            }
                            placeholder="e.g., Frontend Developer"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={newRole.description || ""}
                            onChange={(e) =>
                              setNewRole({
                                ...newRole,
                                description: e.target.value,
                              })
                            }
                            placeholder="Describe the role responsibilities..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="experience">Experience Level</Label>
                          <Select
                            value={newRole.required_experience_level.toString()}
                            onValueChange={(value) =>
                              setNewRole({
                                ...newRole,
                                required_experience_level: parseInt(value),
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 - Beginner</SelectItem>
                              <SelectItem value="2">2 - Basic</SelectItem>
                              <SelectItem value="3">
                                3 - Intermediate
                              </SelectItem>
                              <SelectItem value="4">4 - Advanced</SelectItem>
                              <SelectItem value="5">5 - Expert</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsAddRoleDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleAddRole}>Add Role</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.project_roles.map((role, index) => (
                  <div
                    key={role.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">{role.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            <span>
                              Level {role.required_experience_level} -{" "}
                              {getExperienceLevelText(
                                parseInt(role.required_experience_level)
                              )}
                            </span>
                          </div>
                          <Badge
                            variant={role.is_filled ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {role.is_filled ? "Filled" : "Open"}
                          </Badge>
                        </div>
                      </div>
                      {isCreator && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingRole(role)
                            setIsEditRoleDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      )}
                    </div>
                    {role.description && (
                      <p className="text-sm text-muted-foreground">
                        {role.description}
                      </p>
                    )}
                    {!role.is_filled && isAuthenticated && !isCreator && (
                      <Button size="sm" variant="outline">
                        Apply for Role
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Project Details */}
        <div className="space-y-6">
          {/* Project Types */}
          <Card>
            <CardHeader>
              <CardTitle>Project Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.types.map((type) => (
                  <Badge key={type.id} variant="outline">
                    {type.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Technologies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech.id} variant="secondary">
                      {tech.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Programming Languages */}
          {project.languages && project.languages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Programming Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.languages.map((language) => (
                    <Badge key={language.id} variant="outline">
                      {language.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Project Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Total Roles
                </span>
                <span className="font-medium">
                  {project.project_roles.length}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Open Roles
                </span>
                <span className="font-medium">
                  {
                    project.project_roles.filter((role) => !role.is_filled)
                      .length
                  }
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Filled Roles
                </span>
                <span className="font-medium">
                  {
                    project.project_roles.filter((role) => role.is_filled)
                      .length
                  }
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {isAuthenticated && (
            <div className="space-y-3">
              <Button className="w-full" size="lg">
                <Users className="h-4 w-4 mr-2" />
                Join Project
              </Button>
              <Button variant="outline" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Repository
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Role Dialog */}
      {editingRole && (
        <Dialog
          open={isEditRoleDialogOpen}
          onOpenChange={setIsEditRoleDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
              <DialogDescription>Update the role information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingRole.title || ""}
                  onChange={(e) =>
                    setEditingRole({ ...editingRole, title: e.target.value })
                  }
                  placeholder="e.g., Frontend Developer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingRole.description || ""}
                  onChange={(e) =>
                    setEditingRole({
                      ...editingRole,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe the role responsibilities..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-experience">Experience Level</Label>
                <Select
                  value={
                    editingRole.required_experience_level?.toString() || "1"
                  }
                  onValueChange={(value) =>
                    setEditingRole({
                      ...editingRole,
                      required_experience_level: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Beginner</SelectItem>
                    <SelectItem value="2">2 - Basic</SelectItem>
                    <SelectItem value="3">3 - Intermediate</SelectItem>
                    <SelectItem value="4">4 - Advanced</SelectItem>
                    <SelectItem value="5">5 - Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-is-filled"
                  checked={editingRole.is_filled || false}
                  onCheckedChange={(checked) =>
                    setEditingRole({
                      ...editingRole,
                      is_filled: checked === true,
                    })
                  }
                />
                <Label
                  htmlFor="edit-is-filled"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Mark this role as filled
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditRoleDialogOpen(false)
                  setEditingRole(null)
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateRole}>Update Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
