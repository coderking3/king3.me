export type CdnType = 'bilibili' | 'netease' | 'github' | 'google'

// Single source of truth: each known remote host paired with its CDN type.
// `REMOTE_IMAGE_HOSTS` (consumed by next.config.ts's remotePatterns) and
// `HOST_CDN_TYPE` (hostname -> type lookup) are both derived from this array.
const REMOTE_IMAGE_CDN_CONFIG = [
  { hostname: 'i0.hdslb.com', type: 'bilibili' }, // BiliBili
  { hostname: 'p3.music.126.net', type: 'netease' }, // NeteaseCloudMusic
  { hostname: 'p4.music.126.net', type: 'netease' }, // NeteaseCloudMusic
  { hostname: 'avatars.githubusercontent.com', type: 'github' }, // Github
  { hostname: 'lh3.googleusercontent.com', type: 'google' } // Google
] as const satisfies readonly { hostname: string; type: CdnType }[]

export const REMOTE_IMAGE_HOSTS = [
  ...REMOTE_IMAGE_CDN_CONFIG.map((c) => c.hostname)
  // 'cdn.jsdelivr.net'
]

const HOST_CDN_TYPE: Record<string, CdnType> = Object.fromEntries(
  REMOTE_IMAGE_CDN_CONFIG.map((c) => [c.hostname, c.type])
)

const HTTP_PROTOCOL_RE = /^https?:\/\//i

function getRemoteHostname(src: string): string | null {
  if (!HTTP_PROTOCOL_RE.test(src)) return null

  try {
    return new URL(src).hostname
  } catch {
    return null
  }
}

/** Whether `src` is a remote url from a known CDN host. */
export function isRemoteImage(src: string): boolean {
  const host = getRemoteHostname(src)
  return host !== null && host in HOST_CDN_TYPE
}

// ---------- bilibili ----------

/** `'origin'` bypasses all processing and returns the url untouched. */
export type BilibiliFormat = 'webp' | 'png' | 'jpg' | 'jpeg' | 'gif' | 'origin'

export interface BilibiliParams {
  width?: number
  height?: number
  size?: number
  /** 0 fit-min, 1 fit-max, 2 stretch. Mutually exclusive with `clip` only when 2. */
  resize?: 0 | 1 | 2
  /** [1,1000]. Mutually exclusive with `clip`. */
  scale?: number
  /** [1,100], server default 75 when omitted. */
  quality?: number
  /** Defaults to 1 unless `scale` is set or `resize` is 2. */
  clip?: 0 | 1
  /** Defaults to 'webp'. */
  format?: BilibiliFormat
}

// Format: (original url)@(\d+[whsepqoc]_?)*(\.(webp|gif|png|jpg|jpeg))?
// Segment order is fixed as w h e p q c.
function buildBilibiliUrl(src: string, params: BilibiliParams): string {
  const {
    width,
    height,
    size,
    resize = 1,
    scale,
    quality,
    format,
    clip = 1
  } = params

  if (format === 'origin') return src

  const finalClip =
    clip ?? (scale === undefined && resize !== 2 ? 1 : undefined)

  const segments: string[] = []

  if (size !== undefined) {
    segments.push(`${size}w`)
    segments.push(`${size}h`)
  } else {
    if (width !== undefined) segments.push(`${width}w`)
    if (height !== undefined) segments.push(`${height}h`)
  }

  if (resize !== undefined) segments.push(`${resize}e`)
  if (scale !== undefined) segments.push(`${scale}p`)
  if (quality !== undefined) segments.push(`${quality}q`)
  if (finalClip !== undefined) segments.push(`${finalClip}c`)

  const paramPart = segments.length ? `@${segments.join('_')}` : '@'
  return `${src}${paramPart}.${format}`
}

// ---------- size-only CDNs (netease / github / google) ----------

export interface SizeOnlyParams {
  size?: number
}

function withSearchParam(src: string, key: string, value: string): string {
  const url = new URL(src)
  url.searchParams.set(key, value)
  return url.toString()
}

const SIZE_ONLY_HANDLERS: Record<
  Exclude<CdnType, 'bilibili'>,
  (src: string, size: number) => string
> = {
  netease: (src, size) => withSearchParam(src, 'param', `${size}y${size}`),
  github: (src, size) => withSearchParam(src, 'size', String(size)),
  google: (src, size) => `${src.split('=')[0]}=s${size}-c`
}

// ---------- entry point ----------

export interface CdnParamsMap {
  bilibili?: BilibiliParams
  netease?: SizeOnlyParams
  github?: SizeOnlyParams
  google?: SizeOnlyParams
}

/**
 * Builds a processed CDN url for `src`, auto-detecting its CDN from the
 * hostname and applying the matching entry from `config`. Urls from an
 * unknown host, or a known host with no matching config entry, are
 * returned untouched — safe to call on a list mixing multiple CDNs.
 */
export function getRemoteImageUrl(
  src: string,
  config: CdnParamsMap = {}
): string {
  const host = getRemoteHostname(src)
  const type = host ? HOST_CDN_TYPE[host] : undefined

  if (!type) return src

  if (type === 'bilibili') {
    return buildBilibiliUrl(src, config.bilibili ?? {})
  }

  const size = config[type]?.size
  if (!size) return src

  return SIZE_ONLY_HANDLERS[type](src, size)
}
