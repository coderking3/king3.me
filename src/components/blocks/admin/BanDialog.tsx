'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { banUserAction } from '@/app/actions/users'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Input
} from '@/components/ui'

interface BanDialogProps {
  user: { id: string; name: string } | null
  onClose: () => void
}

function BanDialog({ user, onClose }: BanDialogProps) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const handleBan = async () => {
    if (!user) return
    setLoading(true)
    const result = await banUserAction(user.id, reason || undefined)
    if (result.success) {
      toast.success(`${user.name} has been banned`)
      setReason('')
      onClose()
    } else {
      toast.error(result.error)
    }
    setLoading(false)
  }

  return (
    <AlertDialog
      open={!!user}
      onOpenChange={(open) => {
        if (!open) {
          setReason('')
          onClose()
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ban {user?.name}</AlertDialogTitle>
          <AlertDialogDescription>
            This will prevent the user from signing in and posting messages.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Input
          placeholder="Reason (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleBan}
            disabled={loading}
          >
            {loading ? 'Banning...' : 'Ban User'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default BanDialog
