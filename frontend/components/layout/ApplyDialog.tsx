import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Dispatch, SetStateAction } from 'react'

type ApplyDialogProps = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  message?: string
  onAccept: () => Promise<void>
  data?: any
}

export function ApplyDialog({
  isOpen,
  setIsOpen,
  message,
  onAccept,
  data,
}: ApplyDialogProps) {
  const displayMessage =
    message || 'Are you sure you want to apply to this role?'
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply {data && <span>for {data}</span>} </DialogTitle>
          <DialogDescription>{displayMessage}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={() => {
              onAccept()
              setIsOpen(false)
            }}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
