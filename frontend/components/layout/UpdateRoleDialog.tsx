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
import { Dispatch, SetStateAction } from 'react'
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
              value={role.title || ''}
              onChange={(e) => setRole({ ...role, title: e.target.value })}
              placeholder="e.g., Frontend Developer"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
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
            <Label htmlFor="edit-experience">Experience Level</Label>
            <Select
              value={role.required_experience_level?.toString() || '1'}
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
          <div className="flex items-center space-x-2">
            <Checkbox
              id="edit-is-filled"
              checked={role.is_filled || false}
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
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false)
              setRole(null)
            }}
          >
            Cancel
          </Button>
          <Button onClick={onUpdate}>Update Role</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
