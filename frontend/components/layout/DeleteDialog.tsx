import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

type DeleteDialogProps = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  message?: string
  onDelete: () => Promise<void>
}

export function DeleteDialog({
  isOpen,
  setIsOpen,
  message,
  onDelete,
}: DeleteDialogProps) {
  const displayMessage =
    message ||
    'Are you sure you want to delete this project? This action cannot be undone.'
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>{displayMessage}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete()
              setIsOpen(false)
            }}
          >
            Delete Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
