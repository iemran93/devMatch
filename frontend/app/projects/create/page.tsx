"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"
import { useToast } from "@/components/ui/use-toast"
import { Trash2, Plus } from "lucide-react"
import {
  createProjectSchema,
  CreateProjectFormData,
  CreateProjectRequest,
} from "@/lib/types/project_types"
import {
  useCreateProject,
  useGetAllProjectData,
} from "@/lib/requests/project_requests"
import { Loading } from "@/components/layout/loading"

const projectStages = ["Idea", "In Progress", "Completed"] as const

export default function CreateProjectPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { mutateAsync: creatProject } = useCreateProject()

  // fetch project related data
  const {
    categories,
    languages,
    technologies,
    types,
    isLoading: isDataLoading,
  } = useGetAllProjectData()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      goals: "",
      category_id: 0,
      stage: "Idea",
      project_type: [],
      technologies: [],
      languages: [],
      project_roles: [
        { title: "", description: "", required_experience_level: 1 },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "project_roles",
  })

  const onSubmit = async (data: CreateProjectFormData) => {
    setIsLoading(true)
    try {
      const projectRequest: CreateProjectRequest = {
        title: data.title,
        description: data.description,
        goals: data.goals || null,
        category_id: data.category_id,
        stage: data.stage,
        project_type: data.project_type,
        technologies: data.technologies || [],
        languages: data.languages || [],
        project_roles: data.project_roles.map((role) => ({
          title: role.title,
          description: role.description || "",
          required_experience_level: role.required_experience_level,
        })),
      }

      await creatProject(projectRequest)
      toast({
        title: "Project created successfully!",
        description: "Your project has been created and is now live.",
      })
      router.push("/projects")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating project",
        description: error.message || "Something went wrong",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isDataLoading) {
    return <Loading />
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Create New Project</CardTitle>
              <CardDescription>
                Share your project idea and find collaborators
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter project title"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals">Goals</Label>
                <Textarea
                  id="goals"
                  placeholder="What are the main goals of this project?"
                  {...register("goals")}
                />
                {errors.goals && (
                  <p className="text-sm text-red-500">{errors.goals.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Controller
                  name="category_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category_id && (
                  <p className="text-sm text-red-500">
                    {errors.category_id.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectType">Project Type</Label>
                <Controller
                  name="project_type"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      placeholder="Select project types"
                      value={field.value}
                      options={[
                        ...(types || []).map((type) => ({
                          label: type.name,
                          value: type.id,
                        })),
                      ]}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.project_type && (
                  <p className="text-sm text-red-500">
                    {errors.project_type.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Controller
                  name="stage"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectStages.map((stage) => (
                          <SelectItem key={stage} value={stage}>
                            {stage}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.stage && (
                  <p className="text-sm text-red-500">{errors.stage.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Technologies</Label>
                <Controller
                  name="technologies"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      placeholder="Select technologies"
                      value={field.value || []}
                      options={[
                        ...(technologies || []).map((tech) => ({
                          label: tech.name,
                          value: tech.id,
                        })),
                      ]}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.technologies && (
                  <p className="text-sm text-red-500">
                    {errors.technologies.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Programming Languages</Label>
                <Controller
                  name="languages"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      placeholder="Select languages"
                      value={field.value || []}
                      options={[
                        ...(languages || []).map((lang) => ({
                          label: lang.name,
                          value: lang.id,
                        })),
                      ]}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.languages && (
                  <p className="text-sm text-red-500">
                    {errors.languages.message}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Project Roles</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({
                        title: "",
                        description: "",
                        required_experience_level: 1,
                      })
                    }
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Role
                  </Button>
                </div>

                {errors.project_roles && (
                  <p className="text-sm text-red-500">
                    {errors.project_roles.message}
                  </p>
                )}

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="border rounded-lg p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">
                          Role {index + 1}
                        </h4>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => remove(index)}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`project_roles.${index}.title`}>
                            Title <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`project_roles.${index}.title`}
                            placeholder="e.g., Frontend Developer"
                            {...register(`project_roles.${index}.title`)}
                          />
                          {errors.project_roles?.[index]?.title && (
                            <p className="text-sm text-red-500">
                              {errors.project_roles[index]?.title?.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor={`project_roles.${index}.required_experience_level`}
                          >
                            Experience Level (1-5){" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Controller
                            name={`project_roles.${index}.required_experience_level`}
                            control={control}
                            render={({ field }) => (
                              <Select
                                value={field.value?.toString() || "1"}
                                onValueChange={(value) =>
                                  field.onChange(parseInt(value))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select experience level" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">
                                    1 - Beginner
                                  </SelectItem>
                                  <SelectItem value="2">2 - Basic</SelectItem>
                                  <SelectItem value="3">
                                    3 - Intermediate
                                  </SelectItem>
                                  <SelectItem value="4">
                                    4 - Advanced
                                  </SelectItem>
                                  <SelectItem value="5">5 - Expert</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.project_roles?.[index]
                            ?.required_experience_level && (
                            <p className="text-sm text-red-500">
                              {
                                errors.project_roles[index]
                                  ?.required_experience_level?.message
                              }
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`project_roles.${index}.description`}>
                          Description
                        </Label>
                        <Textarea
                          id={`project_roles.${index}.description`}
                          placeholder="Describe the role responsibilities and requirements..."
                          {...register(`project_roles.${index}.description`)}
                        />
                        {errors.project_roles?.[index]?.description && (
                          <p className="text-sm text-red-500">
                            {errors.project_roles[index]?.description?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
  )
}
