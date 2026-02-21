'use client'

import type { Songs } from '@/data'

import { Pause, Play } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { getRandomSongs, playlist } from '@/data'
import { Equalizer, NetEaseMusicIcon } from '@/icons'

function FeaturedMusic() {
  const [randomSongs] = useState<Songs[]>(() => getRandomSongs(playlist))
  const [playingUrl, setPlayingUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 组件卸载时停止播放
  useEffect(() => {
    return () => {
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [])

  const handlePlay = (song: Songs) => {
    if (playingUrl === song.url) {
      audioRef.current?.pause()
      setPlayingUrl(null)
      return
    }

    if (audioRef.current) {
      audioRef.current.pause()
    }

    const audio = new Audio(song.url)
    audioRef.current = audio
    audio.play()
    setPlayingUrl(song.url)

    audio.addEventListener('ended', () => setPlayingUrl(null), { once: true })
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
          const isPlaying = playingUrl === song.url

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
                  className={`object-cover transition-all duration-300 ${
                    isPlaying ? 'brightness-50' : 'group-hover:brightness-50'
                  }`}
                />
                <div
                  className={`absolute inset-0 flex items-center justify-center text-white transition-opacity duration-200 ${
                    isPlaying
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {isPlaying ? (
                    <Pause size={16} fill="white" strokeWidth={0} />
                  ) : (
                    <Play size={16} fill="white" strokeWidth={0} />
                  )}
                </div>
              </div>

              {/* 
 <div className="z-10 min-w-0 flex-1">
 
              <p className="truncate text-sm font-medium">{song.name}</p>
              <p className="text-muted-foreground truncate text-xs">
                {Array.isArray(song.author)
                  ? song.author.join(' / ')
                  : `${song.author}`}
              </p>
            </div>
*/}
              {/* 歌曲信息 */}
              <div className="z-10 min-w-0 flex-1">
                <div className="flex justify-between">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`truncate text-sm font-medium transition-colors ${
                        isPlaying ? 'text-primary' : ''
                      }`}
                    >
                      {song.name}
                    </p>
                  </div>

                  <p className="text-muted-foreground truncate text-xs">
                    {Array.isArray(song.author)
                      ? song.author.join(' / ')
                      : song.author}
                  </p>
                </div>

                {/* 时长  */}
                <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                  {song.duration}
                </span>
              </div>

              {/* hover 背景 */}
              <div className="bg-muted absolute -inset-x-1.5 -inset-y-1.5 z-0 scale-95 rounded-2xl opacity-0 transition group-hover:scale-100 group-hover:opacity-100" />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FeaturedMusic
