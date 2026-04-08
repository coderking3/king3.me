'use client'

import type { Table } from '@tanstack/react-table'

import type { ColumnConfig } from '@/components'
import type { Message } from '@/types'

import { Plus, Reply, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod/v4'

import {
  createMessageAction,
  deleteMessageAction,
  replyToMessageAction
} from '@/app/actions/messages'
import { Animated, Confirm, DataTable, Form, Modal } from '@/components'
// import { DataTable } from '@/components/OldDataTable'
import { Badge, Button } from '@/components/ui'

type MessageWithReplies = Message & { replies: Message[] }

// ──── Form Config ────

const replySchema = z.object({
  reply: z.string().min(1, 'Reply is required').max(1000, 'Reply is too long')
})

type ReplyFormValues = z.infer<typeof replySchema>

const replyFields: Parameters<typeof Form<ReplyFormValues>>[0]['fields'] = [
  {
    name: 'reply',
    label: 'Reply',
    type: 'textarea',
    placeholder: 'Type your reply...',
    rows: 3
  }
]

const createSchema = z.object({
  message: z
    .string()
    .min(1, 'Message is required')
    .max(1000, 'Message is too long')
})

type CreateFormValues = z.infer<typeof createSchema>

const createFields: Parameters<typeof Form<CreateFormValues>>[0]['fields'] = [
  {
    name: 'message',
    label: 'Message',
    type: 'textarea',
    placeholder: 'Type a new message...',
    rows: 4
  }
]

// ──── Table Columns ────

const columns: ColumnConfig<MessageWithReplies>[] = [
  {
    key: 'userName',
    title: 'UserName',
    sortable: true,
    render: (_, record) => (
      <div className="flex items-center gap-2">
        {record.userImg && (
          <Image
            src={record.userImg}
            alt={record.userName}
            width={24}
            height={24}
            className="rounded-full"
          />
        )}
        <span className="text-sm font-medium">{record.userName}</span>
      </div>
    )
  },
  {
    key: 'message',
    title: 'Message',
    render: (value) => <p className="max-w-md truncate text-sm">{value}</p>
  },
  {
    key: 'createdAt',
    title: 'CreatedAt',
    sortable: true,
    render: (value) => (
      <span className="text-muted-foreground text-xs">
        {new Date(value).toLocaleDateString()}
      </span>
    )
  },
  {
    key: 'replies',
    title: 'Replies',
    className: 'text-center',
    render: (_, record) =>
      record.replies?.length ? (
        <Badge variant="secondary">{record.replies.length}</Badge>
      ) : null
  }
]

// ──── Component ────

export default function Messages({
  messages
}: {
  messages: MessageWithReplies[]
}) {
  const tableRef = useRef<Table<MessageWithReplies>>(null)
  const [replyTo, setReplyTo] = useState<MessageWithReplies | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const replyOpen = !!replyTo
  const createOpen = showCreate

  const handleDelete = async () => {
    if (!deleteId) return
    const result = await deleteMessageAction(deleteId)
    if (result.success) {
      toast.success('Message deleted')
    } else {
      toast.error(result.error)
    }
    setDeleteId(null)
  }

  const handleReplySubmit = async (data: ReplyFormValues) => {
    if (!replyTo) return
    const result = await replyToMessageAction(replyTo.id, data.reply)
    if (result.success) {
      toast.success('Reply sent')
      setReplyTo(null)
    } else {
      toast.error(result.error)
    }
  }

  const handleReplyClose = () => {
    setReplyTo(null)
  }

  const handleCreateSubmit = async (data: CreateFormValues) => {
    const result = await createMessageAction(data.message)
    if (result.success) {
      toast.success('Message created')
      setShowCreate(false)
    } else {
      toast.error(result.error)
    }
  }

  const handleCreateClose = () => {
    setShowCreate(false)
  }

  const replyDefaultValues: ReplyFormValues = {
    reply: ''
  }

  const createDefaultValues: CreateFormValues = {
    message: ''
  }

  return (
    <Animated preset="fadeIn">
      <DataTable
        columns={columns}
        data={messages}
        pagination
        rowKey="id"
        loading={!messages.length}
        // Tree mode (commented out for panel mode testing)
        // expandable={{
        //   getChildren: (msg) => msg.replies as MessageWithReplies[],
        //   indentSize: 24
        // }}
        expandable={{
          rowExpandable: (record) => record.replies?.length > 0,
          render: (record) => (
            <div className="bg-muted/50 p-4">
              <p className="text-muted-foreground text-xs font-medium">
                {record.userName} &middot;{' '}
                {new Date(record.createdAt).toLocaleString()}
              </p>
              <p className="mt-1 text-sm">{record.message}</p>
              {record.replies?.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-muted-foreground text-xs font-medium">
                    {record.replies.length} replies:
                  </p>
                  {record.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="bg-background flex items-start justify-between rounded-md border p-3"
                    >
                      <div>
                        <p className="text-muted-foreground text-xs">
                          {reply.userName} &middot;{' '}
                          {new Date(reply.createdAt).toLocaleString()}
                        </p>
                        <p className="mt-1 text-sm">{reply.message}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDeleteId(reply.id)}
                        className="text-muted-foreground hover:text-destructive shrink-0 rounded p-1 transition-colors"
                        title="Delete reply"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        }}
        selectable
        tableRef={tableRef}
        actions={{
          className: 'w-24',
          render: (record) => (
            <div className="flex items-center justify-center gap-1">
              {!record.parentId && (
                <button
                  type="button"
                  onClick={() => setReplyTo(record)}
                  className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
                  title="Reply"
                >
                  <Reply size={16} />
                </button>
              )}
              <button
                type="button"
                onClick={() => setDeleteId(record.id)}
                className="text-muted-foreground hover:text-destructive rounded p-1 transition-colors"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )
        }}
        toolbar={{
          filterFields: [
            { key: 'userName', label: 'User' },
            { key: 'message', label: 'Message' }
          ],
          filterMode: 'auto',
          actions: (
            <Button size="sm" onClick={() => setShowCreate(true)}>
              <Plus size={16} />
              New
            </Button>
          ),
          columnToggle: true
        }}
      />

      {/* Reply Modal */}
      <Modal
        open={replyOpen}
        onClose={handleReplyClose}
        title="Reply to message"
        showFooter={false}
      >
        {replyTo && (
          <div className="bg-muted mb-4 rounded-lg p-3">
            <p className="text-muted-foreground text-xs font-medium">
              {replyTo.userName}
            </p>
            <p className="mt-1 text-sm">{replyTo.message}</p>
          </div>
        )}
        <Form
          schema={replySchema}
          fields={replyFields}
          defaultValues={replyDefaultValues}
          onSubmit={handleReplySubmit}
        />
      </Modal>

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={handleCreateClose}
        title="Add Message"
        showFooter={false}
      >
        <Form
          schema={createSchema}
          fields={createFields}
          defaultValues={createDefaultValues}
          onSubmit={handleCreateSubmit}
        />
      </Modal>

      {/* Delete Confirm */}
      <Confirm
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete message"
        description="This action cannot be undone. This will permanently delete the message and all its replies."
        variant="destructive"
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Animated>
  )
}
