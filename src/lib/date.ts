export type DateInput = string | number | Date

export const LONG_DATE: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}

export function formatLocalDate(date: Date, locale?: Intl.LocalesArgument) {
  return date.toLocaleDateString(locale, LONG_DATE)
}

const JUST_NOW: Record<string, string> = {
  en: 'just now',
  zh: '刚刚'
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 60 * 60 * 1000],
  ['month', 30 * 24 * 60 * 60 * 1000],
  ['week', 7 * 24 * 60 * 60 * 1000],
  ['day', 24 * 60 * 60 * 1000],
  ['hour', 60 * 60 * 1000],
  ['minute', 60 * 1000]
]

export function relativeTime(date: Date, locale = 'en'): string {
  const diff = date.getTime() - Date.now()

  if (Math.abs(diff) < 60 * 1000) {
    return JUST_NOW[locale] ?? JUST_NOW.en
  }

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  for (const [unit, ms] of UNITS) {
    if (Math.abs(diff) >= ms) {
      return rtf.format(Math.round(diff / ms), unit)
    }
  }

  return JUST_NOW[locale] ?? JUST_NOW.en
}
