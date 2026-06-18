'use client'

import { format } from 'date-fns'
import {
  CalendarDays,
  Ellipsis,
  Feather,
  FolderKanban,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Music,
  Users
} from 'lucide-react'
import { usePathname } from 'next/navigation'

import { LogoIcon } from '@/components/icons'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui'
import { ADMIN_NAVIGATION_ITEMS } from '@/constants'
import { Link } from '@/i18n/navigation'
import { signOut } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

export const NAV_ICOM_MAP = {
  dashboard: LayoutDashboard,
  messages: MessageSquare,
  user: Users,
  music: Music,
  image: ImageIcon,
  feather: Feather,
  folder: FolderKanban
}

const sidebarMenus = ADMIN_NAVIGATION_ITEMS.map((item) => ({
  ...item,
  icon: NAV_ICOM_MAP[item.icon]
}))

interface AdminSidebarUser {
  name: string
  email: string
  image?: string | null
  createdAt: Date
}

export function AdminSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: AdminSidebarUser }) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="text-primary justify-center gap-2 transition-colors hover:bg-transparent active:bg-transparent [&_svg]:size-[30px]"
              render={<Link href="/" />}
            >
              <LogoIcon size={30} variant="bold" />
              <span className="text-lg font-semibold">King3 Admin</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="flex-1 space-y-2 px-3 py-2">
          {sidebarMenus.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(href)

            return (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={label}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-5 text-base font-medium transition-colors duration-200',
                    isActive
                      ? 'bg-accent! text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent active:text-accent-foreground'
                  )}
                  render={<Link href={href} />}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}

function NavUser({ user }: { user: AdminSidebarUser }) {
  const { isMobile } = useSidebar()
  const initials = user.name.slice(0, 2).toUpperCase()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
          >
            <Avatar className="h-8 w-8 rounded-lg">
              {user.image && <AvatarImage src={user.image} alt={user.name} />}
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {user.email}
              </span>
            </div>
            <Ellipsis className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    {user.image && (
                      <AvatarImage src={user.image} alt={user.name} />
                    )}
                    <AvatarFallback className="rounded-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem disabled className="text-muted-foreground">
                <CalendarDays className="mr-2 size-4" />
                Joined {format(user.createdAt, 'yyyy/MM/dd')}
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
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
