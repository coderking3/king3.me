import 'i18next'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: typeof import('@/locales/en/common.json')
      home: typeof import('@/locales/en/home.json')
      about: typeof import('@/locales/en/about.json')
      blog: typeof import('@/locales/en/blog.json')
      project: typeof import('@/locales/en/project.json')
      message: typeof import('@/locales/en/message.json')
      poems: typeof import('@/locales/en/poems.json')
      photos: typeof import('@/locales/en/photos.json')
      use: typeof import('@/locales/en/use.json')
      auth: typeof import('@/locales/en/auth.json')
    }
  }
}
