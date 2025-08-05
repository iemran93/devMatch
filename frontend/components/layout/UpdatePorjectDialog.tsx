import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Dispatch, SetStateAction, useState } from 'react'
import { UpdateProjectRequest } from '@/lib/types/project_types'
import { useGetAllProjectData } from '@/lib/requests/project_requests'
import MultipleSelector from '@/components/ui/MultipleSelector'

type UpdateProjectDialogProps = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  project: UpdateProjectRequest
  setProject: Dispatch<SetStateAction<UpdateProjectRequest>>
  onUpdate: () => Promise<void>
}

export function UpdateProjectDialog({
  isOpen,
  setIsOpen,
  project,
  setProject,
  onUpdate,
}: UpdateProjectDialogProps) {
  const { categories, languages, technologies, types } = useGetAllProjectData()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!project.title?.trim()) {
      newErrors.title = 'Title is required'
    } else if (project.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    }

    if (!project.description?.trim()) {
      newErrors.description = 'Description is required'
    } else if (project.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }

    if (!project.category_id || project.category_id === 0) {
      newErrors.category_id = 'Category is required'
    }

    if (!project.stage) {
      newErrors.stage = 'Stage is required'
    }

    if (!project.project_type || project.project_type.length === 0) {
      newErrors.project_type = 'At least one project type is required'
    }

    if (!project.technologies || project.technologies.length === 0) {
      newErrors.technologies = 'At least one technology is required'
    }

    if (!project.languages || project.languages.length === 0) {
      newErrors.languages = 'At least one language is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleUpdate = async () => {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onUpdate()
      setIsOpen(false)
      setErrors({})
    } catch (error) {
      console.error('Update failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    setProject({} as UpdateProjectRequest)
    setErrors({})
  }

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[90vh] overflow-hidden flex flex-col max-w-2xl">
        <DialogHeader className="flex-shrink-0">
          <DialogDescription>Update the project information</DialogDescription>
        </DialogHeader>

        <div
          className="flex-1 overflow-y-auto space-y-4 p-2 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={project.title || ''}
              onChange={(e) => {
                setProject({ ...project, title: e.target.value })
                clearError('title')
              }}
              placeholder="Project title"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={project.description || ''}
              onChange={(e) => {
                setProject({
                  ...project,
                  description: e.target.value,
                })
                clearError('description')
              }}
              placeholder="Describe the project..."
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="goals">Goals</Label>
            <Textarea
              id="goals"
              placeholder="What are the main goals of this project?"
              value={project.goals || ''}
              onChange={(e) =>
                setProject({ ...project, goals: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={project.category_id?.toString()}
              onValueChange={(value) => {
                setProject({ ...project, category_id: parseInt(value) })
                clearError('category_id')
              }}
            >
              <SelectTrigger
                className={errors.category_id ? 'border-red-500' : ''}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category_id && (
              <p className="text-sm text-red-500">{errors.category_id}</p>
            )}
          </div>

          {/* Project Types */}
          <div className="space-y-2">
            <Label htmlFor="projectType">Project Types</Label>
            <MultipleSelector
              placeholder="Select project types"
              options={(types || []).map((type) => ({
                label: type.name,
                value: type.id,
              }))}
              value={project.project_type || []}
              onChange={(selectedValues) => {
                setProject({
                  ...project,
                  project_type: selectedValues,
                })
                clearError('project_type')
              }}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                  No types found.
                </p>
              }
              className={errors.project_type ? 'border-red-500' : ''}
            />
            {errors.project_type && (
              <p className="text-sm text-red-500">{errors.project_type}</p>
            )}
          </div>

          {/* Technologies */}
          <div className="space-y-2">
            <Label htmlFor="technologies">Technologies</Label>
            <MultipleSelector
              placeholder="Select technologies"
              options={(technologies || []).map((tech) => ({
                label: tech.name,
                value: tech.id,
              }))}
              value={project.technologies || []}
              onChange={(selectedValues) => {
                setProject({
                  ...project,
                  technologies: selectedValues,
                })
                clearError('technologies')
              }}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                  No technologies found.
                </p>
              }
              className={errors.technologies ? 'border-red-500' : ''}
            />
            {errors.technologies && (
              <p className="text-sm text-red-500">{errors.technologies}</p>
            )}
          </div>

          {/* Languages */}
          <div className="space-y-2">
            <Label htmlFor="languages">Languages</Label>
            <MultipleSelector
              placeholder="Select languages"
              options={(languages || []).map((lang) => ({
                label: lang.name,
                value: lang.id,
              }))}
              value={project.languages || []}
              onChange={(selectedValues) => {
                setProject({
                  ...project,
                  languages: selectedValues,
                })
                clearError('languages')
              }}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                  No languages found.
                </p>
              }
              className={errors.languages ? 'border-red-500' : ''}
            />
            {errors.languages && (
              <p className="text-sm text-red-500">{errors.languages}</p>
            )}
          </div>

          {/* Stage */}
          <div className="space-y-2">
            <Label htmlFor="stage">Stage</Label>
            <Select
              value={project.stage}
              onValueChange={(value) => {
                setProject({ ...project, stage: value })
                clearError('stage')
              }}
            >
              <SelectTrigger className={errors.stage ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Idea">Idea</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            {errors.stage && (
              <p className="text-sm text-red-500">{errors.stage}</p>
            )}
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
