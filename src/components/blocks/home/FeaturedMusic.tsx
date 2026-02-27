'use client'

import type { Song } from '@/data'

import { Pause, Play } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { getRandomSongs, playlist } from '@/data'
import { Equalizer, NetEaseMusicIcon } from '@/icons'
import { cn } from '@/lib/utils'

function FeaturedMusic() {
  const [randomSongs] = useState<Song[]>(() => getRandomSongs(playlist))
  const [playingUrl, setPlayingUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 组件卸载时停止播放
  useEffect(() => {
    return () => {
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [])

  const handlePlay = (song: Song) => {
    if (playingUrl === song.url && audioRef.current) {
      if (isPlaying) {
        audioRef.current?.pause()
        setIsPlaying(false)
        return
      }

      audioRef.current?.play()
      setIsPlaying(true)
    } else {
      const audio = new Audio(song.url)
      audioRef.current = audio
      audio.play()
      setIsPlaying(true)
      setPlayingUrl(song.url)
    }
  }

  return (
    <div className="border-border rounded-2xl border bg-transparent p-6 backdrop-blur-xs backdrop-saturate-150">
      <h2 className="text-primary relative mb-6 flex items-center text-base font-semibold">
        <Equalizer size={22} />
        <span className="ml-3">Featured Music</span>
        <div className="absolute -top-0.5 right-0 flex items-center">
          <NetEaseMusicIcon size={36} />
        </div>
      </h2>

      <div className="space-y-4">
        {randomSongs.map((song) => {
          const isPlay = playingUrl === song.url && isPlaying

          return (
            <div
              key={song.name}
              onClick={() => handlePlay(song)}
              className="group relative flex cursor-pointer items-center gap-3"
            >
              {/* 封面 */}
              <div className="relative z-10 h-12 w-12 shrink-0 overflow-hidden rounded select-none">
                <Image
                  src={`${song.cover}?waadw=48y48&type=webp`}
                  alt={song.name}
                  fill
                  className={cn(
                    'object-cover transition-all duration-300',
                    isPlay ? 'brightness-50' : 'group-hover:brightness-50'
                  )}
                />

                <div
                  className={cn(
                    'absolute inset-0 flex items-center justify-center text-white transition-opacity duration-200',
                    isPlay ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  )}
                >
                  {isPlay ? (
                    <Pause size={16} fill="white" strokeWidth={0} />
                  ) : (
                    <Play size={16} fill="white" strokeWidth={0} />
                  )}
                </div>
              </div>

              <div className="z-10 flex w-full items-center justify-between">
                <div className="flex-1">
                  <p className="truncate text-sm font-medium">{song.name}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {Array.isArray(song.author)
                      ? song.author.join(' / ')
                      : `${song.author}`}
                  </p>
                </div>
                <span className="text-muted-foreground mr-2 shrink-0 text-xs tabular-nums">
                  {song.duration}
                </span>
              </div>

              <div className="bg-muted absolute -inset-x-1.5 -inset-y-1.5 z-0 scale-95 rounded-2xl opacity-0 transition group-hover:scale-100 group-hover:opacity-100" />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FeaturedMusic
