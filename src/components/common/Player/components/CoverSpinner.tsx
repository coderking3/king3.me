import AsyncImage from '../../AsyncImage'

export function CoverSpinner({
  src,
  alt,
  isPlaying
}: {
  src: string
  alt: string
  isPlaying: boolean
}) {
  return (
    <div className="relative size-full overflow-hidden rounded-full">
      <div
        className="absolute inset-0 animate-spin"
        style={{
          animationDuration: '8s',
          animationTimingFunction: 'linear',
          animationPlayState: isPlaying ? 'running' : 'paused'
        }}
      >
        <AsyncImage
          src={src}
          alt={alt}
          fill
          sizes="4rem"
          className="object-cover"
        />
      </div>
      {!isPlaying && (
        <div className="absolute inset-0 bg-black/25 transition-opacity duration-300" />
      )}
    </div>
  )
}
