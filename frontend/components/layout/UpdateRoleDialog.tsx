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
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Dispatch, SetStateAction, useState } from 'react'

type UpdateRoleDialogProps = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  role: any
  setRole: Dispatch<SetStateAction<any>>
  onUpdate: () => Promise<void>
}

export function UpdateRoleDialog({
  isOpen,
  setIsOpen,
  role,
  setRole,
  onUpdate,
}: UpdateRoleDialogProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!role?.title?.trim()) {
      newErrors.title = 'Title is required'
    } else if (role.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    }

    if (
      !role?.required_experience_level ||
      role.required_experience_level < 1 ||
      role.required_experience_level > 5
    ) {
      newErrors.required_experience_level = 'Experience level is required'
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
      console.error('Update role failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    setRole(null)
    setErrors({})
  }

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              value={role?.title || ''}
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
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={role?.description || ''}
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
            <Label htmlFor="edit-experience">Experience Level</Label>
            <Select
              value={role?.required_experience_level?.toString() || ''}
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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="edit-is-filled"
              checked={role?.is_filled || false}
              onCheckedChange={(checked) =>
                setRole({
                  ...role,
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
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
