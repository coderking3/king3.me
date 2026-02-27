'use client'

import { useState } from 'react'

import { Button } from '@/components/ui'
import { useSession } from '@/lib/auth-client'

import AuthModal from '../auth/AuthModal'

const MessageBoard = () => {
  const { data: session, isPending } = useSession()
  const [modalOpen, setModalOpen] = useState(false)
  const [text, setText] = useState('')

  const isLoggedIn = !!session

  return (
    <section className="max-w-2xl">
      <Button variant="outline" onClick={() => setModalOpen(true)}>
        登录后留言
      </Button>

      <AuthModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        callbackURL="/message"
      />
    </section>
  )
}

export default MessageBoard
