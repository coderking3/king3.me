import type { Message } from '@/types'

import Image from 'next/image'

import { Animated } from '@/components'
import { relativeTime } from '@/lib/date'

type MessageWithReplies = Message & { replies: Message[] }

/* --- Single Reply --- */

function Reply({ reply, isLast }: { reply: Message; isLast: boolean }) {
  return (
    <div className="relative pb-3 pl-6">
      {/* Vertical line — full height for non-last, half for last */}
      <span
        className="bg-border absolute left-0 w-0.5"
        style={{ top: 0, height: isLast ? 12 : '100%' }}
        aria-hidden="true"
      />
      {/* Horizontal connector to avatar center */}
      <span
        className="bg-border absolute left-0 h-0.5 w-5"
        style={{ top: 12 }}
        aria-hidden="true"
      />

      <div className="flex items-start gap-2">
        {reply.userImg ? (
          <Image
            src={reply.userImg}
            alt=""
            width={24}
            height={24}
            className="ring-background size-6 shrink-0 rounded-full ring-2"
          />
        ) : (
          <div className="bg-muted ring-background flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-medium ring-2">
            {reply.userName.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold">{reply.userName}</span>
            <time className="text-[11px] opacity-40 select-none">
              {relativeTime(reply.createdAt)}
            </time>
          </div>
          <p className="mt-0.5 text-sm">{reply.message}</p>
        </div>
      </div>
    </div>
  )
}

/* --- Single Message --- */

function MessageItem({
  message,
  isLast,
  index
}: {
  message: MessageWithReplies
  isLast: boolean
  index: number
}) {
  return (
    <Animated
      as="li"
      preset={{ mode: 'fadeInUp', delay: 0.16 + index * 0.04 }}
      className="relative pb-8"
    >
      {/* Vertical connector line */}
      {!isLast && (
        <span
          className="bg-border absolute top-12 left-5 -ml-px h-[calc(100%-3.5rem)] w-0.5 rounded"
          aria-hidden="true"
        />
      )}

      {/* Avatar + meta row */}
      <div className="relative flex items-start gap-3">
        {message.userImg ? (
          <Image
            src={message.userImg}
            alt=""
            width={40}
            height={40}
            className="ring-background size-10 shrink-0 rounded-full ring-2"
          />
        ) : (
          <div className="bg-muted ring-background flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-medium ring-2">
            {message.userName.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="-mt-0.5 flex min-w-0 flex-1 items-center gap-2">
          <b className="text-sm font-bold">{message.userName}</b>
          <time className="text-xs opacity-40 select-none">
            {relativeTime(message.createdAt)}
          </time>
        </div>
      </div>

      {/* Message body */}
      <p className="-mt-3 mb-1 pl-[3.25rem] text-sm">{message.message}</p>

      {/* Replies */}
      {message.replies.length > 0 && (
        <div className="relative mt-5 ml-[3.25rem]">
          {/* Extend line upward to bridge the mt-4 gap */}
          <span
            className="bg-border absolute -top-2 left-0 h-2 w-0.5"
            aria-hidden="true"
          />
          {message.replies.map((reply, idx) => (
            <Reply
              key={reply.id}
              reply={reply}
              isLast={idx === message.replies.length - 1}
            />
          ))}
        </div>
      )}
    </Animated>
  )
}

/* --- Message List --- */

function MessageList({ messages }: { messages: MessageWithReplies[] }) {
  return (
    <div className="relative mt-12">
      <ul role="list" className="-mb-8 px-1 md:px-4">
        {messages.map((message, idx) => (
          <MessageItem
            key={message.id}
            message={message}
            isLast={idx === messages.length - 1}
            index={idx}
          />
        ))}
      </ul>
    </div>
  )
}

export default MessageList
