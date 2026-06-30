import { cn } from '@/lib/utils'

export function EqualizerBars({ playing }: { playing: boolean }) {
  return (
    <span className="flex items-end gap-[2px]" aria-hidden>
      {[3, 5, 4].map((h, i) => (
        <span
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          className={cn(
            'bg-brand w-[3px] rounded-full transition-all',
            playing ? 'animate-bounce' : 'opacity-40'
          )}
          style={{
            height: playing ? `${h * 2}px` : '4px',
            animationDelay: `${i * 0.12}s`,
            animationDuration: '0.8s'
          }}
        />
      ))}
    </span>
  )
}
