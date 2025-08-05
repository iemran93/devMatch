import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus } from 'lucide-react'
import { Dispatch, SetStateAction, useState } from 'react'
import { ProjectRolesRequest } from '@/lib/types/project_types'

type NewRoleDialogProps = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  role: ProjectRolesRequest
  setRole: Dispatch<SetStateAction<ProjectRolesRequest>>
  onAdd: () => Promise<void>
}

export function NewRoleDialog({
  isOpen,
  setIsOpen,
  role,
  setRole,
  onAdd,
}: NewRoleDialogProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!role.title?.trim()) {
      newErrors.title = 'Title is required'
    } else if (role.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    }

    if (
      !role.required_experience_level ||
      role.required_experience_level < 1 ||
      role.required_experience_level > 5
    ) {
      newErrors.required_experience_level = 'Experience level is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAdd = async () => {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onAdd()
      setIsOpen(false)
      setErrors({})
    } catch (error) {
      console.error('Add role failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    setErrors({})
  }

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          Add Role
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Role</DialogTitle>
          <DialogDescription>Add a new role to your project</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={role.title || ''}
              onChange={(e) => {
                setRole({ ...role, title: e.target.value })
                clearError('title')
              }}
              placeholder="e.g., Frontend Developer"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={role.description || ''}
              onChange={(e) => {
                setRole({
                  ...role,
                  description: e.target.value,
                })
                clearError('description')
              }}
              placeholder="Describe the role responsibilities..."
              className={errors.description ? 'border-red-500' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Experience Level</Label>
            <Select
              value={role.required_experience_level?.toString() || ''}
              onValueChange={(value) => {
                setRole({
                  ...role,
                  required_experience_level: parseInt(value),
                })
                clearError('required_experience_level')
              }}
            >
              <SelectTrigger
                className={
                  errors.required_experience_level ? 'border-red-500' : ''
                }
              >
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 - Beginner</SelectItem>
                <SelectItem value="2">2 - Basic</SelectItem>
                <SelectItem value="3">3 - Intermediate</SelectItem>
                <SelectItem value="4">4 - Advanced</SelectItem>
                <SelectItem value="5">5 - Expert</SelectItem>
              </SelectContent>
            </Select>
            {errors.required_experience_level && (
              <p className="text-sm text-red-500">
                {errors.required_experience_level}
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
