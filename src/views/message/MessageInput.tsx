'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { SendHorizontal } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import TextareaAutosize from 'react-textarea-autosize'
import { toast } from 'sonner'

import { sendMessageAction } from '@/app/actions/messages'
import { cn } from '@/lib/utils'

const MAX_LENGTH = 600

interface MessageInputProps {
  user: {
    name: string
    image?: string | null
  }
}

function MessageInput({ user }: MessageInputProps) {
  const { t } = useTranslation('message')
  const [text, setText] = useState('')
  const [sending, setSending] = useState<boolean>(false)

  const handleSend = async () => {
    if (!text.trim() || sending) return
    setSending(true)
    try {
      const result = await sendMessageAction(text.trim())
      if (result.success) {
        setText('')
      } else {
        console.error(result.error)
        throw new Error(result.error)
      }
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to send message'
      toast.error(errorMsg)
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
        'ring-border/30 dark:ring-border shadow-muted-foreground/5 bg-background dark:bg-muted relative flex w-full items-start gap-3 overflow-hidden rounded-xl p-4 shadow-xl ring-2 transition-opacity',
        sending && 'pointer-events-none opacity-50'
      )}
    >
      <InputSvgBackground sending={sending} />

      {user.image ? (
        <Image
          src={user.image}
          alt="avatar"
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
        <TextareaAutosize
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('inputPlaceholder')}
          data-slot="textarea"
          className={cn(
            'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:bg-input/50 block w-full shrink-0 resize-none border-0 bg-transparent p-0 text-sm leading-6 transition-all will-change-[height] outline-none focus:ring-0 focus:outline-none focus-visible:ring-0'
          )}
        />

        <footer className="mt-3 -mb-1.5 flex h-5 w-full items-center justify-end">
          <AnimatePresence>
            {text.length > 0 && (
              <motion.aside
                key="send-button-wrapper"
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 8 }}
                className="flex items-center gap-2.5 select-none"
              >
                <span
                  className={cn(
                    'font-mono text-[10px]',
                    text.length > MAX_LENGTH ? 'text-red-500' : 'text-zinc-500'
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
                  className="text-accent-foreground/85 hover:text-primary hover:dark:text-accent-foreground appearance-none transition-colors disabled:opacity-50"
                >
                  <SendHorizontal className="size-5" />
                </motion.button>
              </motion.aside>
            )}
          </AnimatePresence>
        </footer>
      </div>
    </div>
  )
}

function InputSvgBackground({ sending }: { sending: boolean }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-xl mix-blend-overlay select-none',
        sending && 'opacity-0'
      )}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/5 stroke-zinc-900/10 dark:fill-[hsla(0,0%,100%,.03)] dark:stroke-white/10"
      >
        <defs>
          <pattern
            id=":R1d6hd6:"
            width="72"
            height="56"
            patternUnits="userSpaceOnUse"
            x="50%"
            y="16"
          >
            <path d="M.5 56V.5H72" fill="none"></path>
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          strokeWidth="0"
          fill="url(#:R1d6hd6:)"
        ></rect>
        <svg x="50%" y="16" className="overflow-visible">
          <rect strokeWidth="0" width="73" height="57" x="0" y="56"></rect>
          <rect strokeWidth="0" width="73" height="57" x="72" y="168"></rect>
        </svg>
      </svg>
    </div>
  )
}

export default MessageInput
