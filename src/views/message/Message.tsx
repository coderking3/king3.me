'use client'

import type { Message } from '@/types'

import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

import { sendMessageAction } from '@/app/actions/messages'
import { Button, Textarea } from '@/components/ui'
import { useSession } from '@/lib/auth-client'
import { useAuthModal } from '@/stores/auth'

type MessageWithReplies = Message & { replies: Message[] }

export const title = 'Welcome to my message wall'
export const description =
  'Here, you can leave what you want to say to me, or your suggestions, or your thoughts, or your criticism, or your praise, or your encouragement, or your complaints.'

function MessagePage({ messages }: { messages: MessageWithReplies[] }) {
  const { data: session } = useSession()
  const { openModal } = useAuthModal()
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
    <div className="mt-24">
      <div className="mx-auto max-w-6xl px-8">
        <header className="max-w-2xl">
          <h1 className="text-primary font-mono text-4xl font-medium tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="text-foreground/80 mt-6 text-lg">{description}</p>
        </header>

        <div className="mt-16 sm:mt-20">
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
                <Button variant="outline" size="lg" onClick={openModal}>
                  Please log in to leave a message
                </Button>
              )}
            </div>

            {/* Messages List */}
            {messages.length > 0 && (
              <div className="mt-12 space-y-6">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="border-border rounded-lg border p-4"
                  >
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
                      <span className="text-sm font-medium">
                        {msg.userName}
                      </span>
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
          </section>
        </div>
      </div>
    </div>
  )
}

export default MessagePage
