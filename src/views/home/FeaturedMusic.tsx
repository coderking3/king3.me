'use client'

import type { Song } from '@/types'

import { Pause, Play } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'

import { AsyncImage } from '@/components/common'
import { Equalizer, NetEaseMusicIcon } from '@/components/icons'
import { getRemoteImageUrl } from '@/lib/image'
import { getDailySeed, seededShuffle } from '@/lib/math'
import { cn } from '@/lib/utils'
import { usePlayerStore } from '@/stores/player'

function FeaturedMusic({ songs: originalSongs }: { songs: Song[] }) {
  const t = useTranslations('page.home')

  const songs = useMemo(() => {
    return originalSongs.map((item) => ({
      ...item,
      cover: getRemoteImageUrl(item.cover, { netease: { size: 128 } })
    }))
  }, [originalSongs])

  const {
    setQueue,
    play,
    togglePlay,
    currentIndex,
    isVisible,
    isPlaying,
    queue
  } = usePlayerStore()

  const [dailySongs, setDailySongs] = useState<Song[]>([])

  // Set full queue on mount, compute daily display slice client-side
  useEffect(() => {
    setQueue(songs)
  }, [songs, setQueue])

  useEffect(() => {
    const seed = getDailySeed(new Date())
    setDailySongs(seededShuffle(songs, seed).slice(0, 5))
  }, [songs])

  const handlePlay = (song: Song) => {
    // Find the song's index in the full queue (songs), not in dailySongs
    const idx = songs.findIndex((s) => s.id === song.id)
    if (idx === -1) return

    const isCurrentSong =
      isVisible && queue.length > 0 && queue[currentIndex]?.id === song.id

    if (isCurrentSong) {
      // Same song — toggle play/pause
      togglePlay()
    } else {
      // Different song — switch and play
      play(idx)
    }
  }

  const getIsActive = (song: Song) => {
    if (!isVisible || queue.length === 0) return false
    return queue[currentIndex]?.id === song.id
  }

  return (
    <div className="border-border bg-background/30 rounded-2xl border p-6 backdrop-blur-xs">
      <h2 className="text-primary relative mb-6 flex items-center text-base font-semibold">
        <Equalizer size={22} />
        <span className="ml-3">{t('featuredMusic')}</span>
        <div className="absolute -top-0.5 right-0 flex items-center">
          <NetEaseMusicIcon size={36} />
        </div>
      </h2>

      <div className="space-y-4">
        {dailySongs.map((song) => {
          const isActive = getIsActive(song)

          return (
            <div
              key={song.id}
              onClick={() => handlePlay(song)}
              className="group relative flex cursor-pointer items-center gap-3"
            >
              {/* Cover */}
              <div className="relative z-10 h-12 w-12 shrink-0 overflow-hidden rounded select-none">
                <AsyncImage
                  src={song.cover}
                  alt={song.name}
                  fill
                  sizes="3rem"
                  className={cn(
                    'object-cover transition-all duration-300',
                    isActive ? 'brightness-50' : 'group-hover:brightness-50'
                  )}
                />
                <div
                  className={cn(
                    'absolute inset-0 flex items-center justify-center text-white transition-opacity duration-200',
                    isActive
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100'
                  )}
                >
                  {isActive && isPlaying ? (
                    <Pause fill="currentColor" strokeWidth={0} size={16} />
                  ) : (
                    <Play fill="currentColor" strokeWidth={0} size={16} />
                  )}
                </div>
              </div>

              <div className="z-10 flex w-full items-center justify-between">
                <div className="flex-1">
                  <p
                    className={cn(
                      'truncate text-sm font-medium transition-colors',
                      isActive && 'text-brand'
                    )}
                  >
                    {song.name}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {Array.isArray(song.author)
                      ? song.author.join(' / ')
                      : song.author}
                  </p>
                </div>
                <span className="text-muted-foreground mr-2 shrink-0 text-xs tabular-nums">
                  {song.duration}
                </span>
              </div>

              <div className="bg-muted absolute -inset-x-1.5 -inset-y-1.5 z-0 scale-95 rounded-xl opacity-0 transition group-hover:scale-100 group-hover:opacity-100" />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FeaturedMusic
