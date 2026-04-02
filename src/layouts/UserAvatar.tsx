'use client'

import { animated, useSpring } from '@react-spring/web'
import { CalendarDays, LogOut, User } from 'lucide-react'
import { usePathname } from 'next/navigation'

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui'
import { useInteractive } from '@/icons/_internal/hooks'
import { signOut } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { useAuthModal } from '@/stores/auth'
import { AuthModal } from '@/views/auth'

interface UserAvatarUser {
  name: string
  email: string
  image?: string | null
  createdAt: Date
}

interface UserAvatarProps {
  user: UserAvatarUser | null
}

// Match the size-8 container used by other header action icons (Search, ThemeMode, Feed)
const triggerClass = cn(
  'inline-flex items-center justify-center',
  'size-8 min-w-8 cursor-pointer',
  'rounded-full'
)

function UserAvatar({ user }: UserAvatarProps) {
  const { open, openModal, closeModal } = useAuthModal()
  const pathname = usePathname()
  const { isHovered, handlers } = useInteractive({ trigger: 'hover' })

  const spring = useSpring({
    scale: isHovered ? 0.92 : 1,
    config: { tension: 300, friction: 10 }
  })

  const avatarContent = user ? (
    <Avatar size="sm">
      {user.image && <AvatarImage src={user.image} alt={user.name} />}
      <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
      <AvatarBadge className="bg-green-600 dark:bg-green-800" />
    </Avatar>
  ) : (
    <Avatar size="sm">
      <AvatarFallback>
        <User size={14} strokeWidth={2} />
      </AvatarFallback>
    </Avatar>
  )

  if (!user) {
    return (
      <>
        <button
          type="button"
          className={triggerClass}
          aria-label="Sign in"
          onClick={openModal}
          {...handlers}
        >
          <animated.span className="inline-flex" style={spring}>
            {avatarContent}
          </animated.span>
        </button>
        <AuthModal
          open={open}
          onOpenChange={(v) => (v ? openModal() : closeModal())}
          callbackURL={pathname}
        />
      </>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={triggerClass}
        aria-label={user.name}
        {...handlers}
      >
        <animated.span className="inline-flex" style={spring}>
          {avatarContent}
        </animated.span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0">
            <div className="flex items-center gap-3 px-3 py-3">
              <Avatar>
                {user.image && <AvatarImage src={user.image} alt={user.name} />}
                <AvatarFallback>
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="text-muted-foreground truncate text-xs">
                  {user.email}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled className="text-muted-foreground">
            <CalendarDays className="mr-2 size-4" />
            Joined {new Date(user.createdAt).toLocaleDateString()}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
            <LogOut className="mr-2 size-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAvatar
