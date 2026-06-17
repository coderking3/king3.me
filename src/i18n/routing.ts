import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  localePrefix: 'as-needed' // 默认语言无前缀，与当前 URL 习惯一致
})
