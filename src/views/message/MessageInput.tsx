import { AnimatePresence, motion } from 'framer-motion'
import { SendHorizontal } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

import { sendMessageAction } from '@/app/actions/messages'
import { Textarea } from '@/components/ui'
import { cn } from '@/lib/utils'

const MAX_LENGTH = 600

interface MessageInputProps {
  user: {
    name: string
    image?: string | null
  }
}

function MessageInput({ user }: MessageInputProps) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!text.trim() || sending) return
    setSending(true)
    try {
      const result = await sendMessageAction(text.trim())
      if (result.success) {
        setText('')
        toast.success('Message sent!')
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error('Failed to send message')
    }
    setSending(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      className={cn(
        'bg-muted/50 border-border flex items-start gap-3 rounded-xl border p-3 md:p-4',
        sending && 'pointer-events-none opacity-50'
      )}
    >
      {user.image ? (
        <Image
          src={user.image}
          alt=""
          width={40}
          height={40}
          className="size-8 shrink-0 rounded-full md:size-10"
        />
      ) : (
        <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium md:size-10">
          {user.name.slice(0, 2).toUpperCase()}
        </div>
      )}

      <div className="flex-1">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Say something..."
          rows={3}
          className="min-h-0 resize-none border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
        />

        <AnimatePresence>
          {text.length > 0 && (
            <motion.footer
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mt-2 flex items-center justify-end gap-2.5"
            >
              <span
                className={cn(
                  'font-mono text-[10px] select-none',
                  text.length > MAX_LENGTH
                    ? 'text-red-500'
                    : 'text-muted-foreground'
                )}
              >
                {text.length}/{MAX_LENGTH}
              </span>

              <motion.button
                type="button"
                disabled={sending || !text.trim()}
                onClick={handleSend}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-foreground appearance-none disabled:opacity-50"
              >
                <SendHorizontal className="size-5" />
              </motion.button>
            </motion.footer>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default MessageInput
