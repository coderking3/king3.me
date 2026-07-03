export const REMOTE_CDN_HOSTS = [
  'i0.hdslb.com', // BiliBili
  'p3.music.126.net', // NeteaseCloudMusic
  'p4.music.126.net', // NeteaseCloudMusic
  'avatars.githubusercontent.com', // Github
  'lh3.googleusercontent.com' // Google
] as const

const REMOTE_CDN_HOST_SET = new Set<string>(REMOTE_CDN_HOSTS)

// Fast pre-check to skip `new URL()` for local paths before hitting the try/catch below.
const HTTP_PROTOCOL_RE = /^https?:\/\//i

/**
 * Determines whether an image `src` matches a known remote image host
 * configured in `next.config.ts`.
 * - Always `false` for local paths (`"/xxx.jpg"` or static import objects).
 * - `false` for remote images from unknown domains, which fall back to
 *   Next.js's built-in optimization.
 */
export function isRemoteCdn(src: string): boolean {
  if (!HTTP_PROTOCOL_RE.test(src)) {
    return false
  }

  try {
    return REMOTE_CDN_HOST_SET.has(new URL(src).hostname)
  } catch {
    return false
  }
}
