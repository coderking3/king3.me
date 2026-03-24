'use client'

import { Shield, ShieldOff, Users, UserX } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

import { setUserRoleAction, unbanUserAction } from '@/app/actions/users'
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui'

import BanDialog from './BanDialog'

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

function UsersTable({ users }: { users: UserItem[] }) {
  const [banTarget, setBanTarget] = useState<UserItem | null>(null)

  const handleUnban = async (userId: string) => {
    const result = await unbanUserAction(userId)
    if (result.success) {
      toast.success('User unbanned')
    } else {
      toast.error(result.error)
    }
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

  if (users.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center py-20">
        <Users size={48} className="mb-4 opacity-30" />
        <p>No users yet</p>
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="w-28">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {user.image && (
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-muted-foreground text-sm">
                  {user.email}
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant={user.role === 'admin' ? 'default' : 'secondary'}
                >
                  {user.role ?? 'user'}
                </Badge>
              </TableCell>
              <TableCell>
                {user.banned ? (
                  <Badge variant="destructive">Banned</Badge>
                ) : (
                  <Badge variant="outline">Active</Badge>
                )}
              </TableCell>
              <TableCell>
                <span className="text-muted-foreground text-xs">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleToggleRole(user.id, user.role)}
                    className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
                    title={
                      user.role === 'admin' ? 'Remove admin' : 'Make admin'
                    }
                  >
                    {user.role === 'admin' ? (
                      <ShieldOff size={16} />
                    ) : (
                      <Shield size={16} />
                    )}
                  </button>
                  {user.banned ? (
                    <button
                      type="button"
                      onClick={() => handleUnban(user.id)}
                      className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
                      title="Unban"
                    >
                      <Shield size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setBanTarget(user)}
                      className="text-muted-foreground hover:text-destructive rounded p-1 transition-colors"
                      title="Ban"
                    >
                      <UserX size={16} />
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <BanDialog user={banTarget} onClose={() => setBanTarget(null)} />
    </>
  )
}

export default UsersTable
