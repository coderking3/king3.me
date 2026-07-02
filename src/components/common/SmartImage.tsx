'use client'

import type { ImageProps } from 'next/image'

import process from 'node:process'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { remoteCdnLoader } from '@/lib/image-loader'
import { cn } from '@/lib/utils'

// Native next/image props allowed to pass through untouched.
// Deprecated fields (priority/objectFit/objectPosition/layout/lazyBoundary/lazyRoot/onLoadingComplete)
// are intentionally excluded so callers are forced to use the modern equivalents
// (preload / Tailwind object-* utilities / etc).
type NativeProps = Omit<
  ImageProps,
  | 'width'
  | 'height'
  | 'fill'
  | 'sizes'
  | 'loader'
  | 'placeholder'
  | 'blurDataURL'
  | 'src'
  | 'alt'
  | 'className'
  | 'onLoad'
  | 'onError'
  | 'priority'
  | 'objectFit'
  | 'objectPosition'
  | 'layout'
  | 'lazyBoundary'
  | 'lazyRoot'
  | 'onLoadingComplete'
>

interface BaseProps extends NativeProps {
  src: ImageProps['src']
  alt: string
  className?: string
  /** Sizing/layout classes go here (aspect-*, size-*, float-*, rounded-*, border, etc.), not on className */
  wrapperClassName?: string
  showSkeleton?: boolean
  /** Turn off when src is already a fully-built CDN url, to avoid the loader double-appending params */
  cdnOptimize?: boolean
  loader?: ImageProps['loader']
  onLoad?: ImageProps['onLoad']
  onError?: ImageProps['onError']
}

interface FillProps extends BaseProps {
  fill: true
  /** Required in fill mode — without it Next falls back to sizes="100vw" and over-fetches */
  sizes: string
  /** Use when wrapperClassName can't express the ratio via aspect-* (e.g. a runtime-known ratio) */
  aspectRatio?: number | string
}

interface FixedProps extends BaseProps {
  fill?: false
  width: number
  height: number
  /** Fixed pixel sizes usually don't need this — Next auto-generates a 1x/2x srcset */
  sizes?: string
}

export type SmartImageProps = FillProps | FixedProps

// Widened shape used only for destructuring. The runtime object always matches
// one of the two union members above; this just lets TS pull every field out
// in a single pass instead of branching before we even know what we have.
type DestructurableProps = BaseProps & {
  fill?: boolean
  sizes?: string
  width?: number
  height?: number
  aspectRatio?: number | string
}

const PROTOCOL_RE = /^https?:\/\//

function isRemoteSrc(src: ImageProps['src']) {
  return typeof src === 'string' && PROTOCOL_RE.test(src)
}

export function SmartImage(props: SmartImageProps) {
  const {
    src,
    alt,
    className,
    wrapperClassName,
    showSkeleton = true,
    cdnOptimize = true,
    loader,
    onLoad,
    onError,
    fill,
    sizes,
    width,
    height,
    aspectRatio,
    ...nativeRest
  } = props as DestructurableProps

  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const remote = isRemoteSrc(src)
  const resolvedLoader =
    loader ?? (remote && cdnOptimize ? remoteCdnLoader : undefined)

  // Dev-only safety net: in fill mode, a wrapper with no height collapses silently
  // and the image just disappears with no error or warning from Next itself.
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' || !fill) return
    const el = wrapperRef.current
    if (!el) return

    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.height === 0) {
        console.warn(
          `[SmartImage] fill container has 0 height (src: ${typeof src === 'string' ? src : 'static import'}). ` +
            `Give wrapperClassName a size (aspect-*/h-*/size-*) or pass aspectRatio.`
        )
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [fill, src])

  const handleLoad: ImageProps['onLoad'] = (e) => {
    setLoaded(true)
    onLoad?.(e)
  }

  const handleError: ImageProps['onError'] = (e) => {
    setError(true)
    onError?.(e)
  }

  const imgClassName = cn(
    'transition-opacity duration-300',
    loaded ? 'opacity-100' : 'opacity-0',
    className
  )

  const wrapperStyle = fill
    ? aspectRatio
      ? { aspectRatio: String(aspectRatio) }
      : undefined
    : { width, height }

  return (
    <div
      ref={wrapperRef}
      className={cn('relative overflow-hidden', wrapperClassName)}
      style={wrapperStyle}
    >
      {showSkeleton && !loaded && !error && (
        <Skeleton className="absolute inset-0 rounded-none" />
      )}

      {!error && fill && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loader={resolvedLoader}
          onLoad={handleLoad}
          onError={handleError}
          className={imgClassName}
          {...nativeRest}
        />
      )}

      {!error && !fill && (
        // width/height are guaranteed by the FixedProps branch of the union;
        // the non-null assertion only exists because destructuring widened the type.
        <Image
          src={src}
          alt={alt}
          width={width!}
          height={height!}
          sizes={sizes}
          loader={resolvedLoader}
          onLoad={handleLoad}
          onError={handleError}
          className={imgClassName}
          {...nativeRest}
        />
      )}

      {error && (
        <div className="bg-muted text-muted-foreground absolute inset-0 flex items-center justify-center text-xs">
          Failed to load image
        </div>
      )}
    </div>
  )
}
