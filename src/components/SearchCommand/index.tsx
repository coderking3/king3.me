'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import { getSearchData } from '@/app/actions/search'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command'
import { useTranslation } from '@/i18n/client'
import { useSearchStore } from '@/stores'

interface SearchItem {
  title: string
  href: string
}

interface SearchData {
  posts: SearchItem[]
  projects: SearchItem[]
}

const PAGES: SearchItem[] = [
  { title: 'Home', href: '/' },
  { title: 'Blog', href: '/blog' },
  { title: 'Project', href: '/project' },
  { title: 'Message', href: '/message' },
  { title: 'About', href: '/about' },
  { title: 'Photos', href: '/photos' },
  { title: 'Poems', href: '/poems' },
  { title: 'Uses', href: '/use' }
]

export function SearchCommand() {
  const router = useRouter()
  const { open, openSearch, closeSearch } = useSearchStore()
  const { t } = useTranslation('common')
  const [query, setQuery] = useState('')
  const [data, setData] = useState<SearchData | null>(null)
  const fetched = useRef(false)

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

  // Fetch search data on first open
  useEffect(() => {
    if (!open || fetched.current) return

    fetched.current = true
    getSearchData().then((result) => {
      if (result.success) {
        setData({
          posts: result.data.posts.map((post) => ({
            title: post.title,
            href: `/blog/${post.slug}`
          })),
          projects: result.data.projects.map((project) => ({
            title: project.name,
            href: project.link
          }))
        })
      }
    })
  }, [open])

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
      onOpenChange={(value) => {
        if (value) {
          openSearch()
        } else {
          closeSearch()
          setQuery('')
        }
      }}
      title={t('search.title')}
      description={t('search.placeholder')}
    >
      <Command shouldFilter={!!query}>
        <CommandInput
          placeholder={t('search.placeholder')}
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {!query ? (
            <div className="flex flex-col items-center gap-4 px-6 py-8">
              <p className="text-muted-foreground text-center text-sm">
                {t('search.hint')}
              </p>
            </div>
          ) : (
            <>
              <CommandEmpty>{t('search.noResults')}</CommandEmpty>

              {data?.posts && data.posts.length > 0 && (
                <CommandGroup heading={t('search.posts')}>
                  {data.posts.map((item) => (
                    <CommandItem
                      key={item.href}
                      value={item.title}
                      onSelect={() => handleSelect(item.href)}
                    >
                      {item.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {data?.projects && data.projects.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup heading={t('search.projects')}>
                    {data.projects.map((item) => (
                      <CommandItem
                        key={item.href}
                        value={item.title}
                        onSelect={() => handleSelect(item.href)}
                      >
                        {item.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}

              <CommandSeparator />
              <CommandGroup heading={t('search.pages')}>
                {PAGES.map((item) => (
                  <CommandItem
                    key={item.href}
                    value={item.title}
                    onSelect={() => handleSelect(item.href)}
                  >
                    {item.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
