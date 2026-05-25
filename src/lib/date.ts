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

export type DateInput = string | number | Date

export const LONG_DATE: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}

function toDate(date: DateInput) {
  const target = date instanceof Date ? date : new Date(date)
  return target
}

export function formatLocalDate(
  date: DateInput,
  locale?: Intl.LocalesArgument
) {
  return toDate(date).toLocaleDateString(locale, LONG_DATE)
}

export function relativeTime(date: DateInput, locale = 'en'): string {
  const target = toDate(date)
  const diff = target.getTime() - Date.now()

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
