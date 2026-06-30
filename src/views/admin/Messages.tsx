'use client'

import type { Table } from '@tanstack/react-table'

import type { ColumnConfig, FormFieldConfig } from '@/components/common'
import type { Message, MessageWithReplies } from '@/types'
import type { MessageInput, ReplyInput } from '@/validations/messages'

import { format } from 'date-fns'
import { Pencil, Plus, Reply, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

import {
  batchDeleteMessagesAction,
  createMessageAction,
  deleteMessageAction,
  replyToMessageAction,
  updateMessageAction
} from '@/actions/messages'
import { Animated, Confirm, DataTable, Form, Modal } from '@/components/common'
import { Badge, Button } from '@/components/ui'
import { messageSchema, replySchema } from '@/validations/messages'

// ──── Form Config ────

const replyFields: FormFieldConfig<ReplyInput>[] = [
  {
    name: 'reply',
    label: 'Reply',
    type: 'textarea',
    placeholder: 'Type your reply...',
    rows: 3
  }
]

const messageField: FormFieldConfig<MessageInput> = {
  name: 'message',
  label: 'Message',
  type: 'textarea',
  rows: 4
}

const messageFields: FormFieldConfig<MessageInput>[] = [
  { ...messageField, placeholder: 'Type a message...' }
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
        {format(value, 'yyyy-MM-dd')}
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

function MessagesPage({ messages }: { messages: MessageWithReplies[] }) {
  const tableRef = useRef<Table<MessageWithReplies>>(null)
  const [replyTo, setReplyTo] = useState<MessageWithReplies | null>(null)
  const [editMessage, setEditMessage] = useState<Message | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [selectedRows, setSelectedRows] = useState<MessageWithReplies[]>([])
  const [showBatchDelete, setShowBatchDelete] = useState(false)

  const replyOpen = !!replyTo
  const formOpen = showCreate || !!editMessage

  const handleDelete = async () => {
    if (!deleteId) return
    const result = await deleteMessageAction(deleteId)
    if (result.success) {
      toast.success('Message deleted')
    } else {
      toast.error(result.message)
    }
    setDeleteId(null)
  }

  const totalReplies = selectedRows.reduce(
    (sum, row) => sum + (row.replies?.length ?? 0),
    0
  )

  const handleBatchDelete = async () => {
    const ids = selectedRows.map((row) => row.id)
    const result = await batchDeleteMessagesAction(ids)
    if (result.success) {
      toast.success(`${result.data} messages deleted`)
      tableRef.current?.toggleAllRowsSelected(false)
    } else {
      toast.error(result.message)
    }
    setShowBatchDelete(false)
  }

  const handleReplySubmit = async (data: ReplyInput) => {
    if (!replyTo) return
    const result = await replyToMessageAction(replyTo.id, data.reply)
    if (result.success) {
      toast.success('Reply sent')
      setReplyTo(null)
    } else {
      toast.error(result.message)
    }
  }

  const handleReplyClose = () => {
    setReplyTo(null)
  }

  const handleCloseForm = () => {
    setShowCreate(false)
    setEditMessage(null)
  }

  const handleSubmit = async (data: MessageInput) => {
    const result = editMessage
      ? await updateMessageAction(editMessage.id, data.message)
      : await createMessageAction(data.message)
    if (result.success) {
      toast.success(editMessage ? 'Message updated' : 'Message created')
      handleCloseForm()
    } else {
      toast.error(result.message)
    }
  }

  const replyDefaultValues: ReplyInput = {
    reply: ''
  }

  const formDefaultValues: MessageInput = {
    message: editMessage?.message || ''
  }

  return (
    <Animated preset="fadeIn">
      <DataTable
        columns={columns}
        data={messages}
        pagination
        rowKey="id"
        loading={!messages.length}
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
                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() => setEditMessage(reply)}
                          className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
                          title="Edit reply"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(reply.id)}
                          className="text-muted-foreground hover:text-destructive rounded p-1 transition-colors"
                          title="Delete reply"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        }}
        selectable
        onRowSelectionChange={setSelectedRows}
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
                onClick={() => setEditMessage(record)}
                className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
                title="Edit"
              >
                <Pencil size={16} />
              </button>
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
            <>
              <Button
                size="sm"
                className="h-8"
                onClick={() => setShowCreate(true)}
              >
                <Plus size={16} className="mr-2 size-4" />
                Create
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="h-8"
                disabled={selectedRows.length === 0}
                onClick={() => setShowBatchDelete(true)}
              >
                <Trash2 className="mr-2 size-4" />
                Delete
              </Button>
            </>
          ),
          columnToggle: true,
          exportable: true
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

      {/* Create / Edit Modal */}
      <Modal
        open={formOpen}
        onClose={handleCloseForm}
        title={editMessage ? 'Edit Message' : 'Add Message'}
        showFooter={false}
      >
        <Form
          key={editMessage?.id || 'new'}
          schema={messageSchema}
          fields={messageFields}
          defaultValues={formDefaultValues}
          onSubmit={handleSubmit}
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

      {/* Batch Delete Confirm */}
      <Confirm
        open={showBatchDelete}
        onClose={() => setShowBatchDelete(false)}
        title="Batch delete messages"
        description={`This will permanently delete ${selectedRows.length} messages and ${totalReplies} replies.`}
        variant="destructive"
        confirmText="Delete All"
        onConfirm={handleBatchDelete}
        onCancel={() => setShowBatchDelete(false)}
      />
    </Animated>
  )
}

export default MessagesPage
