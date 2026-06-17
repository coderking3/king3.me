export type DateInput = string | number | Date

export const LONG_DATE: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}

export function formatLocalDate(date: Date, locale?: Intl.LocalesArgument) {
  return date.toLocaleDateString(locale, LONG_DATE)
}
