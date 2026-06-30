'use client'

import type { ResponseResult } from '@/types'

import {
  ArrowUpDown,
  CornerDownLeft,
  FileTextIcon,
  FolderOpenIcon,
  PanelTop
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { useRouter } from '@/i18n/navigation'
import { useSearchStore } from '@/stores/search'

interface SearchItem {
  title: string
  href: string
}

interface SearchData {
  posts: SearchItem[]
  projects: SearchItem[]
}

const PAGES = [
  { key: 'home', href: '/' },
  { key: 'blog', href: '/blog' },
  { key: 'project', href: '/project' },
  { key: 'message', href: '/message' },
  { key: 'about', href: '/about' },
  { key: 'photos', href: '/photos' },
  { key: 'poems', href: '/poems' },
  { key: 'use', href: '/use' }
] as const

const useSearchData = (open: boolean) => {
  // eslint-disable-next-line react-naming-convention/ref-name
  const fetched = useRef(false)
  const [searchData, setSearchData] = useState<SearchData | null>(null)

  // Fetch search data on first open
  useEffect(() => {
    if (!open || fetched.current) return

    fetched.current = true
    fetch('/api/search')
      .then((res) => res.json())
      .then(({ success, data }: ResponseResult) => {
        success && setSearchData(data)
      })
  }, [open])

  return { searchData }
}

export function SearchCommand() {
  const router = useRouter()
  const { open, openSearch, closeSearch } = useSearchStore()
  const t = useTranslations('ui')
  const sharedT = useTranslations('shared')
  const { searchData } = useSearchData(open)

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        openSearch()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [openSearch])

  const handleSelect = useCallback(
    (href: string) => {
      closeSearch()
      if (href.startsWith('http')) {
        window.open(href, '_blank', 'noopener,noreferrer')
      } else {
        router.push(href)
      }
    },
    [closeSearch, router]
  )

  return (
    <CommandDialog
      open={open}
      onOpenChange={(v) => !v && closeSearch()}
      title={t('search.title')}
      description={t('search.placeholder')}
      position="top"
      className="ring-muted border-none bg-clip-padding p-2 pb-11 ring-4 sm:max-w-lg"
    >
      <Command>
        <CommandInput placeholder={t('search.placeholder')} />
        <CommandList>
          <CommandEmpty>{t('search.noResults')}</CommandEmpty>

          <CommandGroup heading={t('search.pages')} className="p-0!">
            {PAGES.map((item) => {
              const title = t(`nav.${item.key}`)
              return (
                <CommandItem
                  key={item.href}
                  value={title}
                  onSelect={() => handleSelect(item.href)}
                >
                  <PanelTop className="text-muted-foreground size-4" />
                  {title}
                </CommandItem>
              )
            })}
          </CommandGroup>

          {searchData?.projects && searchData.projects.length > 0 && (
            <CommandGroup heading={t('search.projects')} className="p-0!">
              {searchData.projects.map((item) => (
                <CommandItem
                  key={item.href}
                  value={item.title}
                  onSelect={() => handleSelect(item.href)}
                >
                  <FolderOpenIcon className="text-muted-foreground size-4" />
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {searchData?.posts && searchData.posts.length > 0 && (
            <CommandGroup heading={t('search.posts')} className="p-0!">
              {searchData.posts.map((item) => (
                <CommandItem
                  key={item.href}
                  value={item.title}
                  onSelect={() => handleSelect(item.href)}
                >
                  <FileTextIcon className="text-muted-foreground size-4 shrink-0" />
                  <span className="truncate">{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>

      <div className="text-muted-foreground bg-muted border-t-border absolute inset-x-0 bottom-0 z-20 flex h-10 items-center justify-between rounded-b-xl border-t px-4 text-xs font-medium">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <kbd className="bg-background text-muted-foreground pointer-events-none inline-flex items-center justify-center rounded-sm px-1.5 py-1 font-medium select-none">
              <ArrowUpDown className="size-3" />
            </kbd>
            <span>{sharedT('switch')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="bg-background text-muted-foreground pointer-events-none inline-flex items-center justify-center rounded-sm px-1.5 py-1 font-medium select-none">
              <CornerDownLeft className="size-3" />
            </kbd>
            <span>{t('search.shortcut.jump')}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <kbd className="bg-background text-muted-foreground pointer-events-none inline-flex items-center justify-center rounded-sm px-1.5 py-1 font-medium select-none">
              <span className="text-[10px]">ESC</span>
            </kbd>
            <span>{sharedT('close')}</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="bg-background text-muted-foreground pointer-events-none inline-flex items-center justify-center rounded-sm px-1.5 py-1 font-medium select-none">
              <span className="text-[10px]">Ctrl</span>
            </kbd>
            <kbd className="bg-background text-muted-foreground pointer-events-none inline-flex items-center justify-center rounded-sm px-1.5 py-1 font-medium select-none">
              <span className="text-[10px]">K</span>
            </kbd>
            <span>{sharedT('open')}</span>
          </div>
        </div>
      </div>
    </CommandDialog>
  )
}
