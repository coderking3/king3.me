export function clamp(value: number, a: number, b: number) {
  const min = Math.min(a, b)
  const max = Math.max(a, b)
  return Math.min(Math.max(value, min), max)
}

export const range = (start: number, end?: number, step: number = 1) => {
  const output = []
  if (typeof end === 'undefined') {
    end = start
    start = 0
  }
  for (let i = start; i < end; i += step) {
    output.push(i)
  }
  return output
}

export const roundTo = (value: number, places = 0) =>
  Math.round(value * 10 ** places) / 10 ** places

function lcg(seed: number) {
  const a = 9301
  const c = 49297
  const m = 233280

  seed = (seed * a + c) % m
  return seed / m
}

export const seededShuffle = <T = any>(list: T[], seed: number) => {
  const arr = list.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(lcg(seed + i) * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function getDailySeed(date: Date) {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  return y * 10000 + m * 100 + d
}
