'use client'

import type { Message } from '@/types'

import { useTranslation } from 'react-i18next'

import { Animated } from '@/components'
import { Button } from '@/components/ui'
import { useSession } from '@/lib/auth-client'
import { useAuthModal } from '@/stores/auth'

import MessageInput from './MessageInput'
import MessageList from './MessageList'

type MessageWithReplies = Message & { replies: Message[] }

function MessagePage({ messages }: { messages: MessageWithReplies[] }) {
  const { t } = useTranslation('message')
  const { data: session } = useSession()
  const { openModal } = useAuthModal()

  return (
    <div className="mt-14 sm:mt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <header className="max-w-2xl">
          <Animated
            as="h1"
            preset="fadeInUp"
            className="text-primary font-mono text-4xl font-medium tracking-tight sm:text-5xl"
          >
            {t('title')}
          </Animated>
          <Animated
            as="p"
            preset={{ mode: 'fadeInUp', delay: 0.06 }}
            className="text-muted-foreground mt-6 text-lg"
          >
            {t('description')}
          </Animated>
        </header>

        <div className="mt-16 sm:mt-20">
          <Animated
            preset={{ mode: 'fadeInUp', delay: 0.12 }}
            className="max-w-2xl"
          >
            {session ? (
              <MessageInput user={session.user} />
            ) : (
              <Button variant="outline" size="lg" onClick={openModal}>
                {t('loginPrompt')}
              </Button>
            )}
          </Animated>

          {messages.length > 0 && <MessageList messages={messages} />}
        </div>
      </div>
    </div>
  )
}

export default MessagePage
