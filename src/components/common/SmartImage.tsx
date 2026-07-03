'use client'

import type { ImageProps } from 'next/image'
import type { ReactNode } from 'react'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { remoteCdnLoader } from '@/lib/image/loader'
import { isRemoteCdn } from '@/lib/image/remote'
import { cn } from '@/lib/utils'

// Native next/image props allowed to pass through untouched.
// Deprecated fields (priority/objectFit/objectPosition/layout/lazyBoundary/lazyRoot/onLoadingComplete)
// are intentionally excluded so callers are forced to use the modern equivalents
// (preload / Tailwind object-* utilities / etc). `preload` itself is NOT omitted,
// so it flows through via nativeRest as-is.
type NativeProps = Omit<
  ImageProps,
  | 'width'
  | 'height'
  | 'fill'
  | 'sizes'
  | 'loader'
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
  showSkeleton?: boolean
  /** Turn off when src is already a fully-built CDN url, to avoid the loader double-appending params */
  cdnOptimize?: boolean
  /** Content shown when the image fails to load. Defaults to a plain-text fallback — pass a
   *  translated string/node if the surrounding page is localized. */
  errorFallback?: ReactNode
  loader?: ImageProps['loader']
  onLoad?: ImageProps['onLoad']
  onError?: ImageProps['onError']
}

interface FillProps extends BaseProps {
  fill: true
  /** Required in fill mode — without it Next falls back to sizes="100vw" and over-fetches */
  sizes: string
}

interface FixedProps extends BaseProps {
  fill?: false
  width: number
  height: number
  /** Fixed pixel sizes usually don't need this — Next auto-generates a 1x/2x srcset */
  sizes?: string
  /**
   * Set to `false` to skip the sizing wrapper div entirely — e.g. when the
   * caller already provides its own `position: relative` container, same
   * contract as fill mode. Defaults to `true`.
   */
  wrapper?: boolean
  /** Extra classes for the sizing wrapper. No-op when `wrapper` is false. */
  wrapperClassName?: string
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
  wrapper?: boolean
  wrapperClassName?: string
}

/**
 * Thin wrapper around next/image: adds a skeleton-while-loading state and
 * routes known CDN hosts through `remoteCdnLoader`.
 *
 * Fill mode renders NO wrapper of its own — every real usage in this codebase
 * already provides a sized, `position: relative` container (aspect-*, rounded-*,
 * framer-motion boxes, etc). Wrap `<SmartImage fill />` in that container
 * yourself, exactly like you would a plain `<Image fill />`.
 *
 * Fixed mode (width/height) gets a small sizing wrapper by default, since
 * standalone uses like avatars/icons usually don't have an external container
 * to rely on. Pass `wrapper={false}` to opt out when you do have one.
 */
export function SmartImage(props: SmartImageProps) {
  const {
    src,
    alt,
    className,
    showSkeleton = true,
    cdnOptimize = true,
    errorFallback = 'Failed to load image',
    loader,
    onLoad,
    onError,
    fill,
    sizes,
    width,
    height,
    wrapper = true,
    wrapperClassName,
    ...nativeRest
  } = props as DestructurableProps

  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  // Reset the loading/error state when the same instance is reused for a
  // different image (e.g. swiping through a lightbox without unmounting).
  useEffect(() => {
    setLoaded(false)
    setError(false)
  }, [src])

  const resolvedLoader =
    loader ??
    (cdnOptimize && typeof src === 'string' && isRemoteCdn(src)
      ? remoteCdnLoader
      : undefined)

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

  const imageProps = {
    src,
    alt,
    sizes,
    loader: resolvedLoader,
    onLoad: handleLoad,
    onError: handleError,
    className: imgClassName,
    ...(fill ? { fill: true } : { width, height }),
    ...nativeRest
  }

  const content = (
    <>
      {showSkeleton && !loaded && !error && (
        <Skeleton className="absolute inset-0 rounded-none" />
      )}

      {!error && <Image {...imageProps} />}

      {error && (
        <div className="bg-muted text-muted-foreground absolute inset-0 flex items-center justify-center text-xs">
          {errorFallback}
        </div>
      )}
    </>
  )

  if (fill || !wrapper) return content

  return (
    <div className={cn('relative overflow-hidden', wrapperClassName)}>
      {content}
    </div>
  )
}
