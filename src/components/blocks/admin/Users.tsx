'use client'

import type { ColumnConfig } from '@/components/common'

import { Pencil, Shield, ShieldOff, Trash2, UserX } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod/v4'

import {
  removeUserAction,
  setUserRoleAction,
  unbanUserAction,
  updateUserAction
} from '@/app/actions/users'
import { Confirm, DataTable, Form, Modal } from '@/components/common'
import { Badge } from '@/components/ui'

import BanDialog from './BanDialog'

/* --- Types --- */

interface UserItem {
  id: string
  name: string
  email: string
  image?: string | null
  role?: string | null
  banned?: boolean | null
  banReason?: string | null
  createdAt: Date
}

// ──── Form Config ────

const userSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  image: z.union([z.url('Please enter a valid URL'), z.literal('')])
})

type UserFormValues = z.infer<typeof userSchema>

const userFields: Parameters<typeof Form<UserFormValues>>[0]['fields'] = [
  { name: 'name', label: 'Name', type: 'input', placeholder: 'User name' },
  {
    name: 'image',
    label: 'Avatar URL',
    type: 'input',
    placeholder: 'https://...'
  }
]

/* --- Table Columns --- */

const columns: ColumnConfig<UserItem>[] = [
  {
    key: 'name',
    title: 'User',
    sortable: true,
    render: (_, record) => (
      <div className="flex items-center gap-2">
        {record.image && (
          <Image
            src={record.image}
            alt={record.name}
            width={24}
            height={24}
            className="rounded-full"
          />
        )}
        <span className="text-sm font-medium">{record.name}</span>
      </div>
    )
  },
  {
    key: 'email',
    title: 'Email',
    render: (value) => (
      <span className="text-muted-foreground text-sm">{value}</span>
    )
  },
  {
    key: 'role',
    title: 'Role',
    render: (value) => (
      <Badge variant={value === 'admin' ? 'default' : 'secondary'}>
        {value ?? 'user'}
      </Badge>
    )
  },
  {
    key: 'banned',
    title: 'Status',
    render: (value) =>
      value ? (
        <Badge variant="destructive">Banned</Badge>
      ) : (
        <Badge variant="outline">Active</Badge>
      )
  },
  {
    key: 'createdAt',
    title: 'Joined',
    sortable: true,
    render: (value) => (
      <span className="text-muted-foreground text-xs">
        {new Date(value).toLocaleDateString()}
      </span>
    )
  }
]

/* --- Component --- */

export default function Users({ users }: { users: UserItem[] }) {
  const [banTarget, setBanTarget] = useState<UserItem | null>(null)
  const [unbanId, setUnbanId] = useState<string | null>(null)
  const [editUser, setEditUser] = useState<UserItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const formOpen = !!editUser

  const handleUnban = async () => {
    if (!unbanId) return
    const result = await unbanUserAction(unbanId)
    if (result.success) {
      toast.success('User unbanned')
    } else {
      toast.error(result.error)
    }
    setUnbanId(null)
  }

  const handleToggleRole = async (
    userId: string,
    currentRole?: string | null
  ) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    const result = await setUserRoleAction(userId, newRole)
    if (result.success) {
      toast.success(`Role set to ${newRole}`)
    } else {
      toast.error(result.error)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const result = await removeUserAction(deleteId)
    if (result.success) {
      toast.success('User deleted')
    } else {
      toast.error(result.error)
    }
    setDeleteId(null)
  }

  const handleEditSubmit = async (data: UserFormValues) => {
    if (!editUser) return
    const result = await updateUserAction(editUser.id, data)
    if (result.success) {
      toast.success('User updated')
      setEditUser(null)
    } else {
      toast.error(result.error)
    }
  }

  const handleEditClose = () => {
    setEditUser(null)
  }

  const formDefaultValues: UserFormValues = {
    name: editUser?.name || '',
    image: editUser?.image || ''
  }

  return (
    <>
      <h1 className="mb-4 text-lg font-semibold">Users</h1>

      <DataTable
        columns={columns}
        data={users}
        pagination
        rowKey="id"
        actions={{
          className: 'w-32',
          render: (record) => (
            <div className="flex items-center justify-center gap-1">
              <button
                type="button"
                onClick={() => setEditUser(record)}
                className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
                title="Edit"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleToggleRole(record.id, record.role)}
                className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
                title={record.role === 'admin' ? 'Remove admin' : 'Make admin'}
              >
                {record.role === 'admin' ? (
                  <ShieldOff size={16} />
                ) : (
                  <Shield size={16} />
                )}
              </button>
              {record.banned ? (
                <button
                  type="button"
                  onClick={() => setUnbanId(record.id)}
                  className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
                  title="Unban"
                >
                  <Shield size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setBanTarget(record)}
                  className="text-muted-foreground hover:text-destructive rounded p-1 transition-colors"
                  title="Ban"
                >
                  <UserX size={16} />
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
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' }
          ],
          filterMode: 'auto',
          columnToggle: true
        }}
      />

      {/* Ban Dialog */}
      <BanDialog user={banTarget} onClose={() => setBanTarget(null)} />

      {/* Unban Confirm */}
      <Confirm
        open={!!unbanId}
        onClose={() => setUnbanId(null)}
        title="Unban user"
        description="This will allow the user to sign in and post messages again."
        confirmText="Unban"
        onConfirm={handleUnban}
        onCancel={() => setUnbanId(null)}
      />

      {/* Edit Modal */}
      <Modal
        open={formOpen}
        onClose={handleEditClose}
        title="Edit User"
        showFooter={false}
      >
        <Form
          schema={userSchema}
          fields={userFields}
          defaultValues={formDefaultValues}
          onSubmit={handleEditSubmit}
        />
      </Modal>

      {/* Delete Confirm */}
      <Confirm
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete user"
        description="This action cannot be undone. This will permanently delete the user and all their data."
        variant="destructive"
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  )
}
