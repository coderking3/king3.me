import Image from 'next/image'

import { getRandomSongs, playlist } from '@/data'
import { Equalizer, NetEaseMusicIcon } from '@/icons'

function FeaturedMusic() {
  const randomSongs = getRandomSongs(playlist)

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
        {randomSongs.map((song) => (
          <div
            key={song.name}
            className="group relative flex cursor-pointer items-center gap-3"
          >
            <div className="relative z-10 h-12 w-12 shrink-0 overflow-hidden rounded select-none">
              <Image
                src={`${song.cover}?waadw=48y48&type=webp`}
                alt={song.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="z-10 min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{song.name}</p>
              <p className="text-muted-foreground truncate text-xs">
                {Array.isArray(song.author)
                  ? song.author.join(' / ')
                  : `${song.author}`}
              </p>
            </div>

            <div className="bg-muted absolute -inset-x-1.5 -inset-y-1.5 z-0 scale-95 rounded-2xl opacity-0 transition group-hover:scale-100 group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default FeaturedMusic
