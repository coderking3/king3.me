import type { Song } from '@/types'

import { cn } from '@/lib/utils'

import AsyncImage from '../../AsyncImage'
import { BarVisualizer } from './BarVisualizer'

export function PlaylistPanel({
  songs,
  currentIndex,
  isPlaying,
  onSelect
}: {
  songs: Song[]
  currentIndex: number
  isPlaying: boolean
  onSelect: (idx: number) => void
}) {
  return (
    <div className="border-border mx-3 mb-2 max-h-56 overflow-y-auto rounded-xl border">
      {songs.map((song, idx) => {
        const active = idx === currentIndex
        return (
          <button
            key={song.id}
            onClick={() => onSelect(idx)}
            className={cn(
              'flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors',
              active
                ? 'bg-accent text-foreground'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
            )}
          >
            <div className="relative size-8 shrink-0 overflow-hidden rounded">
              <AsyncImage
                src={`${song.cover}?param=32y32&type=webp`}
                alt={song.name}
                fill
                sizes="2rem"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{song.name}</p>
              <p className="text-muted-foreground truncate text-[11px]">
                {Array.isArray(song.author)
                  ? song.author.join(' / ')
                  : song.author}
              </p>
            </div>
            {active && <BarVisualizer playing={isPlaying} size="sm" />}
          </button>
        )
      })}
    </div>
  )
}
