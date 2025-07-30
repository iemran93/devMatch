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
import { Dispatch, SetStateAction } from 'react'
import { ProjectRolesRequest } from '@/lib/types/project_types'
type NewRoleDialgoProps = {
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
}: NewRoleDialgoProps) {
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
              value={role.title}
              onChange={(e) => setRole({ ...role, title: e.target.value })}
              placeholder="e.g., Frontend Developer"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={role.description || ''}
              onChange={(e) =>
                setRole({
                  ...role,
                  description: e.target.value,
                })
              }
              placeholder="Describe the role responsibilities..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience">Experience Level</Label>
            <Select
              value={role.required_experience_level.toString()}
              onValueChange={(value) =>
                setRole({
                  ...role,
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onAdd}>Add Role</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
