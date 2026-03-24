'use client'

import type { Message } from '@/types'

import { MessageSquare, Reply, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'
import z from 'zod'

import { deleteMessageAction } from '@/app/actions/messages'
import { Form } from '@/components/common/Form'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui'

import ReplyDialog from './ReplyDialog'

type MessageWithReplies = Message & { replies: Message[] }

function MessagesTable({ messages }: { messages: MessageWithReplies[] }) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [replyTo, setReplyTo] = useState<MessageWithReplies | null>(null)

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

  if (messages.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center py-20">
        <MessageSquare size={48} className="mb-4 opacity-30" />
        <p>No messages yet</p>
        <Form
          className="mt-20 w-xs"
          schema={z.object({
            age: z.number(),
            name: z.string()
          })}
          onSubmit={(values) => {
            // eslint-disable-next-line no-console
            console.log('values', values)
          }}
          fields={[
            {
              name: 'name',
              label: 'Name',
              type: 'input',
              placeholder: 'Please enter your username.',
              defaultValue: 'king3'
            },
            {
              name: 'age',
              label: 'Age',
              placeholder: 'Please select your age.',
              type: 'select',
              defaultValue: undefined,
              options: [
                { label: '18岁', value: 18 },
                { label: '19岁', value: 19 },
                { label: '20岁', value: 20, disabled: true },
                { label: '21岁', value: 21 },
                { label: '22岁', value: 22 }
              ]
            }
          ]}
        ></Form>
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Replies</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((msg) => (
            <TableRow key={msg.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {msg.userImg && (
                    <Image
                      src={msg.userImg}
                      alt={msg.userName}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium">{msg.userName}</span>
                </div>
              </TableCell>
              <TableCell>
                <p className="max-w-md truncate text-sm">{msg.message}</p>
              </TableCell>
              <TableCell>
                <span className="text-muted-foreground text-xs">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </TableCell>
              <TableCell>
                {msg.replies.length > 0 && (
                  <Badge variant="secondary">{msg.replies.length}</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setReplyTo(msg)}
                    className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
                    title="Reply"
                  >
                    <Reply size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(msg.id)}
                    className="text-muted-foreground hover:text-destructive rounded p-1 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ReplyDialog message={replyTo} onClose={() => setReplyTo(null)} />

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete message</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              message and all its replies.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default MessagesTable
