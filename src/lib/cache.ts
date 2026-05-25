import { revalidateTag, unstable_cache } from 'next/cache'

import 'server-only'

const REVALIDATE_PRESETS = {
  minutes: 60,
  default: 900,
  hours: 3600,
  days: 86400,
  weeks: 604800
} as const

type RevalidatePreset = keyof typeof REVALIDATE_PRESETS
type AnyAsyncFn = (...args: any[]) => Promise<unknown>

export function createCachedQuery<T extends AnyAsyncFn>(
  fn: T,
  tag: string,
  life: RevalidatePreset = 'default'
) {
  const query = unstable_cache(fn as any, [], {
    tags: [tag],
    revalidate: REVALIDATE_PRESETS[life]
  }) as unknown as T

  const revalidate = () => revalidateTag(tag, { expire: 0 })

  return { query, revalidate, tag }
}
