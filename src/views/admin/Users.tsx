'use client'

import type { UserWithRole } from 'better-auth/plugins'

import type { ColumnConfig, FormFieldConfig } from '@/components/common'
import type { UpdateUserInput } from '@/validations/users'

import { format } from 'date-fns'
import { Pencil, Shield, ShieldOff, Trash2, UserX } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

import {
  banUserAction,
  removeUserAction,
  setUserRoleAction,
  unbanUserAction,
  updateUserAction
} from '@/actions/users'
import { Animated, Confirm, DataTable, Form, Modal } from '@/components/common'
import {
  AlertDialogAction,
  AlertDialogCancel,
  Badge,
  Input
} from '@/components/ui'
import { updateUserSchema } from '@/validations/users'

// ──── Form Config ────

const userFields: FormFieldConfig<UpdateUserInput>[] = [
  { name: 'name', label: 'Name', type: 'input', placeholder: 'User name' },
  {
    name: 'image',
    label: 'Avatar URL',
    type: 'input',
    placeholder: 'https://...'
  }
]

// ──── Table Columns ────

const columns: ColumnConfig<UserWithRole>[] = [
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
        {format(value, 'yyyy-MM-dd')}
      </span>
    )
  }
]

// ──── Component ────

export default function Users({ users }: { users: UserWithRole[] }) {
  const [banTarget, setBanTarget] = useState<UserWithRole | null>(null)
  const [banReason, setBanReason] = useState('')
  const [banLoading, setBanLoading] = useState(false)
  const [unbanId, setUnbanId] = useState<string | null>(null)
  const [editUser, setEditUser] = useState<UserWithRole | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const formOpen = !!editUser

  const handleBan = async () => {
    if (!banTarget) return
    setBanLoading(true)
    const result = await banUserAction(banTarget.id, banReason || undefined)
    if (result.success) {
      toast.success(`${banTarget.name} has been banned`)
      setBanReason('')
      setBanTarget(null)
    } else {
      toast.error(result.message)
    }
    setBanLoading(false)
  }

  const handleBanClose = () => {
    setBanTarget(null)
    setBanReason('')
  }

  const handleUnban = async () => {
    if (!unbanId) return
    const result = await unbanUserAction(unbanId)
    if (result.success) {
      toast.success('User unbanned')
    } else {
      toast.error(result.message)
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
      toast.error(result.message)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const result = await removeUserAction(deleteId)
    if (result.success) {
      toast.success('User deleted')
    } else {
      toast.error(result.message)
    }
    setDeleteId(null)
  }

  const handleEditSubmit = async (data: UpdateUserInput) => {
    if (!editUser) return
    const result = await updateUserAction(editUser.id, data)
    if (result.success) {
      toast.success('User updated')
      setEditUser(null)
    } else {
      toast.error(result.message)
    }
  }

  const handleEditClose = () => {
    setEditUser(null)
  }

  const formDefaultValues: UpdateUserInput = {
    name: editUser?.name || '',
    image: editUser?.image || ''
  }

  return (
    <Animated preset="fadeIn">
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
          columnToggle: true,
          exportable: true
        }}
      />

      {/* Ban Confirm */}
      <Confirm
        open={!!banTarget}
        onClose={handleBanClose}
        title={`Ban ${banTarget?.name}`}
        description="This will prevent the user from signing in and posting messages."
        renderFooter={() => (
          <>
            <AlertDialogCancel onClick={handleBanClose}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleBan}
              disabled={banLoading}
            >
              {banLoading ? 'Banning...' : 'Ban User'}
            </AlertDialogAction>
          </>
        )}
      >
        <Input
          placeholder="Reason (optional)"
          value={banReason}
          onChange={(e) => setBanReason(e.target.value)}
        />
      </Confirm>

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
          schema={updateUserSchema}
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
    </Animated>
  )
}
