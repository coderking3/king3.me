'use client'

import type { Message } from '@/types'

import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

import { sendMessageAction } from '@/app/actions/messages'
import { Button, Textarea } from '@/components/ui'
import { signOut, useSession } from '@/lib/auth-client'

import AuthModal from '../auth/AuthModal'

type MessageWithReplies = Message & { replies: Message[] }

const MessageBoard = ({ messages }: { messages: MessageWithReplies[] }) => {
  const { data: session } = useSession()
  const [modalOpen, setModalOpen] = useState(false)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  const isLoggedIn = !!session

  const handleSend = async () => {
    if (!text.trim()) return
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

  return (
    <section>
      <div className="max-w-2xl">
        {isLoggedIn ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt="avatar"
                  width={120}
                  height={120}
                  className="size-5 rounded-full"
                />
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {session.user.name}
              </span>
              <button
                type="button"
                onClick={() => signOut()}
                className="ml-auto text-xs text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-200"
              >
                Sign Out
              </button>
            </div>

            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Say something..."
              rows={3}
              className="resize-none"
            />

            <div className="flex justify-end">
              <Button
                size="sm"
                disabled={!text.trim() || sending}
                onClick={handleSend}
              >
                {sending ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            size="lg"
            onClick={() => setModalOpen(true)}
          >
            Please log in to leave a message
          </Button>
        )}
      </div>

      {/* Messages List */}
      {messages.length > 0 && (
        <div className="mt-12 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className="border-border rounded-lg border p-4">
              <div className="flex items-center gap-2">
                {msg.userImg && (
                  <Image
                    src={msg.userImg}
                    alt={msg.userName}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="text-sm font-medium">{msg.userName}</span>
                <span className="text-muted-foreground text-xs">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 text-sm">{msg.message}</p>

              {/* Replies */}
              {msg.replies.length > 0 && (
                <div className="border-border mt-3 space-y-3 border-l-2 pl-4">
                  {msg.replies.map((reply) => (
                    <div key={reply.id}>
                      <div className="flex items-center gap-2">
                        {reply.userImg && (
                          <Image
                            src={reply.userImg}
                            alt={reply.userName}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        )}
                        <span className="text-xs font-medium">
                          {reply.userName}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1 text-sm">{reply.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <AuthModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        callbackURL="/message"
      />
    </section>
  )
}

export default MessageBoard
