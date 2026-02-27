/* eslint-disable next/no-img-element */
'use client'

import { useState } from 'react'

import { Button, Textarea } from '@/components/ui'
import { signOut, useSession } from '@/lib/auth-client'

import { AuthModal } from '..'

const MessageBoard = () => {
  const { data: session, isPending } = useSession()
  const [modalOpen, setModalOpen] = useState(false)
  const [text, setText] = useState('')

  const isLoggedIn = !!session

  return (
    <section className="max-w-2xl">
      {isPending ? (
        // 加载中占位
        <div className="h-[42px] animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800" />
      ) : isLoggedIn ? (
        // 已登录：显示输入框 + 操作栏
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {session.user.image && (
              <img
                src={session.user.image}
                alt="avatar"
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
              退出
            </button>
          </div>

          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="说点什么..."
            rows={3}
            className="resize-none"
          />

          <div className="flex justify-end">
            <Button size="sm" disabled={!text.trim()}>
              发送
            </Button>
          </div>
        </div>
      ) : (
        // 未登录：显示登录按钮
        <Button variant="outline" onClick={() => setModalOpen(true)}>
          登录后留言
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
