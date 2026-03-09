'use client'

import { useState } from 'react'

import { Button, Textarea } from '@/components/ui'
import { signOut, useSession } from '@/lib/auth-client'

import AuthModal from '../auth/AuthModal'

const MessageBoard = () => {
  const { data: session } = useSession()
  const [modalOpen, setModalOpen] = useState(false)
  const [text, setText] = useState('')

  const isLoggedIn = !!session

  return (
    <section className="max-w-2xl">
      {isLoggedIn ? (
        // 已登录：显示输入框 + 操作栏
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {/* {session.user.image && (
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
            </span> */}
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
            <Button size="sm" disabled={!text.trim()}>
              Send
            </Button>
          </div>
        </div>
      ) : (
        // 未登录：显示登录按钮
        <Button variant="outline" size="lg" onClick={() => setModalOpen(true)}>
          Please log in to leave a message
        </Button>
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
