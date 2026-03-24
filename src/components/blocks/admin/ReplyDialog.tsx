'use client'

import type { Message } from '@/types'

import { useState } from 'react'
import { toast } from 'sonner'

import { replyToMessageAction } from '@/app/actions/messages'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Textarea
} from '@/components/ui'

interface ReplyDialogProps {
  message: (Message & { replies: Message[] }) | null
  onClose: () => void
}

function ReplyDialog({ message, onClose }: ReplyDialogProps) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!message || !text.trim()) return
    setLoading(true)
    const result = await replyToMessageAction(message.id, text.trim())
    if (result.success) {
      toast.success('Reply sent')
      setText('')
      onClose()
    } else {
      toast.error(result.error)
    }
    setLoading(false)
  }

  return (
    <Dialog
      open={!!message}
      onOpenChange={(open) => {
        if (!open) {
          setText('')
          onClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reply to message</DialogTitle>
        </DialogHeader>

        {message && (
          <div className="bg-muted rounded-lg p-3">
            <p className="text-muted-foreground text-xs font-medium">
              {message.userName}
            </p>
            <p className="mt-1 text-sm">{message.message}</p>
          </div>
        )}

        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your reply..."
          rows={3}
          className="resize-none"
        />

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!text.trim() || loading}>
            {loading ? 'Sending...' : 'Send Reply'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ReplyDialog
