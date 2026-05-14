import 'i18next'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: typeof import('@/i18n/language/en/common.json')
      home: typeof import('@/i18n/language/en/home.json')
      about: typeof import('@/i18n/language/en/about.json')
      blog: typeof import('@/i18n/language/en/blog.json')
      project: typeof import('@/i18n/language/en/project.json')
      message: typeof import('@/i18n/language/en/message.json')
      poems: typeof import('@/i18n/language/en/poems.json')
      photos: typeof import('@/i18n/language/en/photos.json')
      use: typeof import('@/i18n/language/en/use.json')
      auth: typeof import('@/i18n/language/en/auth.json')
    }
  }
}
