const JUST_NOW: Record<string, string> = { en: 'just now', zh: '刚刚' }

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 60 * 60 * 1000],
  ['month', 30 * 24 * 60 * 60 * 1000],
  ['week', 7 * 24 * 60 * 60 * 1000],
  ['day', 24 * 60 * 60 * 1000],
  ['hour', 60 * 60 * 1000],
  ['minute', 60 * 1000]
]

export function relativeTime(date: string | Date, locale = 'en'): string {
  const diff = new Date(date).getTime() - Date.now()
  if (Math.abs(diff) < 60 * 1000) return JUST_NOW[locale] ?? JUST_NOW.en

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  for (const [unit, ms] of UNITS) {
    if (Math.abs(diff) >= ms) {
      return rtf.format(Math.round(diff / ms), unit)
    }
  }
  return JUST_NOW[locale] ?? JUST_NOW.en
}
