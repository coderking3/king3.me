'use client'

import type { Message } from '@/types'

import { Animated } from '@/components'
import { Button } from '@/components/ui'
import { useSession } from '@/lib/auth-client'
import { useAuthModal } from '@/stores/auth'

import MessageInput from './MessageInput'
import MessageList from './MessageList'

type MessageWithReplies = Message & { replies: Message[] }

export const title = 'Welcome to my message wall'
export const description =
  'Here, you can leave what you want to say to me, or your suggestions, or your thoughts, or your criticism, or your praise, or your encouragement, or your complaints.'

function MessagePage({ messages }: { messages: MessageWithReplies[] }) {
  const { data: session } = useSession()
  const { openModal } = useAuthModal()

  return (
    <div className="mt-16 sm:mt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <header className="max-w-2xl">
          <Animated
            as="h1"
            preset="fadeInUp"
            className="text-primary font-mono text-4xl font-medium tracking-tight sm:text-5xl"
          >
            {title}
          </Animated>
          <Animated
            as="p"
            preset={{ mode: 'fadeInUp', delay: 0.06 }}
            className="text-muted-foreground mt-6 text-lg"
          >
            {description}
          </Animated>
        </header>

        <div className="mt-16 sm:mt-20">
          <div className="max-w-2xl">
            {session ? (
              <MessageInput user={session.user} />
            ) : (
              <Button variant="outline" size="lg" onClick={openModal}>
                Please log in to leave a message
              </Button>
            )}
          </div>

          {messages.length > 0 && <MessageList messages={messages} />}
        </div>
      </div>
    </div>
  )
}

export default MessagePage
