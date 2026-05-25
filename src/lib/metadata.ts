import type { Metadata } from 'next'

const SITE_TITLE = 'King3 | Developer、Storyteller'
const SITE_NAME = 'King3'
const SITE_URL = 'https://king3-me.vercel.app'
const ROOT_DESCRIPTION = 'Frontend Developer & Music Enthusiast'

const PAGE_METADATA = {
  blog: {
    title: 'My Blog',
    description:
      'Writing blog posts is one of my favorite ways to share and reflect, and I hope to pass on useful technical knowledge to more people.'
  },
  about: {
    title: 'About Me',
    description:
      "Hi, I'm King3. A frontend developer, open-source enthusiast, and creative soul."
  },
  project: {
    title: 'My Projects',
    description:
      'A collection of my open-source projects, tools, and creative experiments.'
  },
  message: {
    title: 'Message Wall',
    description:
      'Here, you can leave what you want to say to me, or your suggestions, or your thoughts.'
  },
  photos: {
    title: 'Photos',
    description: 'Moments captured in light — a visual journal.'
  },
  poems: {
    title: 'Poems',
    description: 'Words that resonate — collected verses and original pieces.'
  },
  use: {
    title: 'Use',
    description: 'Hardware and software I use on a daily basis.'
  },
  auth: {
    title: 'Authentication',
    description: 'Sign in or create an account to continue.'
  }
} as const

type PageMetadataKey = keyof typeof PAGE_METADATA

export function createRootMetadata(): Metadata {
  return {
    title: {
      default: SITE_TITLE,
      template: `%s - ${SITE_NAME}`
    },
    description: ROOT_DESCRIPTION,
    keywords: 'King3,CoderKing3,Developer,Storyteller',
    openGraph: {
      title: SITE_TITLE,
      description: ROOT_DESCRIPTION,
      siteName: SITE_NAME,
      locale: 'en',
      type: 'website',
      url: SITE_URL
    }
  }
}

export function createPageMetadata(key: PageMetadataKey): Metadata {
  const { title, description } = PAGE_METADATA[key]

  return {
    title,
    description,
    openGraph: {
      title,
      description
    }
  }
}
