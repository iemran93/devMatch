'use client'

import { Loading } from '@/components/layout/loading'
import {
  useGetProjectById,
  useDeleteProject,
  useUpdateProject,
} from '@/lib/requests/project_requests'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
} from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { useParams, useRouter } from 'next/navigation'
import {
  getStageColor,
  getStageIcon,
  getExperienceLevelText,
} from '@/components/layout/components_helper'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import {
  CreateProjectRequest,
  ProjectRolesRequest,
} from '@/lib/types/project_types'
import { DeleteDialog } from '@/components/layout/DeleteDialog'
import { NewRoleDialog } from '@/components/layout/NewRoleDialog'
import { UpdateRoleDialog } from '@/components/layout/UpdateRoleDialog'
import { ProjectActionRequest } from '@/lib/types/project_action_types'
import { ApplyDialog } from '@/components/layout/ApplyDialog'
import {
  useApplyRole,
  useCancelRoleRequest,
  useGetProjectRequests,
  useWithdrawRoleRequest,
} from '@/lib/requests/project_action_request'

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
  // const [isApplyRoleDialogOpen, setIsApplyRoleDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<any>(null)
  // const [applyRole, setApplyRole] = useState<ProjectActionRequest>(
  //   {} as ProjectActionRequest,
  // )
  const [newRole, setNewRole] = useState<ProjectRolesRequest>({
    title: '',
    description: '',
    required_experience_level: 1,
    is_filled: false,
  })

  // query
  const {
    data: project,
    isLoading: projectLoading,
    isError: projectError,
  } = useGetProjectById(id)

  const {
    data: projectRequests,
    isLoading: projectRequestsLoading,
    isError: projectRequestsError,
  } = useGetProjectRequests(id)

  // mutation
  const deleteProjectMutation = useDeleteProject()
  const updateProjectMutation = useUpdateProject(id)
  const applyRoleMutation = useApplyRole()
  const cancelRoleMutation = useCancelRoleRequest()
  const withdrawRoleMutation = useWithdrawRoleRequest()

  // Check if current user is the project creator
  const isCreator = user?.id === project?.creator.id

  const handleDeleteProject = async () => {
    try {
      await deleteProjectMutation.mutateAsync(id)
      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      })
      router.push('/projects')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive',
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
      const projectData: CreateProjectRequest = {
        title: project!.title,
        description: project!.description,
        goals: project!.goals,
        category_id: project!.category.id,
        stage: project!.stage as 'Idea' | 'In Progress' | 'Completed',
        project_type: project!.types.map((type) => type.id),
        technologies: project!.technologies?.map((tech) => tech.id) || [],
        languages: project!.languages?.map((lang) => lang.id) || [],
        project_roles: updatedRoles,
      }

      await updateProjectMutation.mutateAsync(projectData)
      toast({
        title: 'Success',
        description: 'Role added successfully',
      })
      setIsAddRoleDialogOpen(false)
      setNewRole({
        title: '',
        description: '',
        required_experience_level: 1,
        is_filled: false,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add role',
        variant: 'destructive',
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
                  editingRole.required_experience_level,
                ),
                is_filled: editingRole.is_filled,
              }
            : {
                title: role.title,
                description: role.description,
                required_experience_level: parseInt(
                  role.required_experience_level,
                ),
                is_filled: role.is_filled,
              },
        ) || []

      // Send complete project data as required by API
      const projectData: CreateProjectRequest = {
        title: project!.title,
        description: project!.description,
        goals: project!.goals,
        category_id: project!.category.id,
        stage: project!.stage as 'Idea' | 'In Progress' | 'Completed',
        project_type: project!.types.map((type) => type.id),
        technologies: project!.technologies?.map((tech) => tech.id) || [],
        languages: project!.languages?.map((lang) => lang.id) || [],
        project_roles: updatedRoles,
      }

      await updateProjectMutation.mutateAsync(projectData)
      toast({
        title: 'Success',
        description: 'Role updated successfully',
      })
      setIsEditRoleDialogOpen(false)
      setEditingRole(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update role',
        variant: 'destructive',
      })
    }
  }

  // const handleApplyRole = async () => {
  //   try {
  //     await applyRoleMutation.mutateAsync(applyRole)
  //     toast({
  //       title: 'Success',
  //       description: 'Role applied successfully',
  //     })
  //     setIsApplyRoleDialogOpen(false)
  //     setApplyRole({} as ProjectActionRequest)
  //   } catch (error) {
  //     toast({
  //       title: 'Error',
  //       description: 'Failed to apply to role',
  //       variant: 'destructive',
  //     })
  //   }
  // }
  // if (projectLoading || projectRequestsLoading) {
  //   return <Loading />
  // }

  if (projectError || projectRequestsError || !project) {
    //TODO: add error pages (redirect)
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
                <DeleteDialog
                  isOpen={isDeleteDialogOpen}
                  setIsOpen={setIsDeleteDialogOpen}
                  onDelete={handleDeleteProject}
                />
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
                <AvatarImage src={project.creator.profilePicture || ''} />
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
                  <NewRoleDialog
                    isOpen={isAddRoleDialogOpen}
                    setIsOpen={setIsAddRoleDialogOpen}
                    role={newRole}
                    setRole={setNewRole}
                    onAdd={handleAddRole}
                  />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.project_roles.map((role) => (
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
                              Level {role.required_experience_level} -{' '}
                              {getExperienceLevelText(
                                parseInt(role.required_experience_level),
                              )}
                            </span>
                          </div>
                          <Badge
                            variant={role.is_filled ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {role.is_filled ? 'Filled' : 'Open'}
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
                    {isAuthenticated &&
                      !isCreator &&
                      (() => {
                        // Check if role is filled by current user (accepted request)
                        const isFilledByCurrentUser =
                          role.is_filled &&
                          projectRequests?.some(
                            (pr) =>
                              pr.role_id === role.id &&
                              pr.user_id === Number(user?.id) &&
                              pr.status === 'accepted',
                          )

                        // Check if user has pending request for this role
                        const hasPendingRequest = projectRequests?.some(
                          (pr) =>
                            pr.role_id === role.id &&
                            pr.user_id === Number(user?.id) &&
                            pr.status === 'pending',
                        )

                        // Determine button state and action
                        let buttonText,
                          handleClick,
                          isDisabled = false

                        if (role.is_filled) {
                          if (isFilledByCurrentUser) {
                            buttonText = 'Withdraw'
                            handleClick = () =>
                              withdrawRoleMutation.mutate({
                                project_id: role.project_id,
                                role_id: role.id,
                              })
                          } else {
                            buttonText = 'Filled'
                            handleClick = () => {}
                            isDisabled = true
                          }
                        } else {
                          if (hasPendingRequest) {
                            buttonText = 'Cancel Application'
                            handleClick = () =>
                              cancelRoleMutation.mutate({
                                project_id: role.project_id,
                                role_id: role.id,
                              })
                          } else {
                            buttonText = 'Apply for Role'
                            handleClick = () =>
                              applyRoleMutation.mutate({
                                project_id: role.project_id,
                                role_id: role.id,
                              })
                          }
                        }

                        // Check if any mutation is loading
                        const isLoading =
                          applyRoleMutation.isPending ||
                          cancelRoleMutation.isPending ||
                          withdrawRoleMutation.isPending

                        return (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isDisabled || isLoading}
                            onClick={handleClick}
                          >
                            {isLoading ? 'Loading...' : buttonText}
                          </Button>
                        )
                      })()}
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
        <UpdateRoleDialog
          isOpen={isEditRoleDialogOpen}
          setIsOpen={setIsEditRoleDialogOpen}
          role={editingRole}
          setRole={setEditingRole}
          onUpdate={handleUpdateRole}
        />
      )}

      {/* Accept dialog
        {applyRole && (
          <ApplyDialog
            isOpen={isApplyRoleDialogOpen}
            setIsOpen={setIsApplyRoleDialogOpen}
            onAccept={handleApplyRole}
            data={
              project?.project_roles.find((pr) => pr.id === applyRole.role_id)
                ?.title
            }
          />
        )}
      */}
    </div>
  )
}
