import { getAllPosts } from '@/lib/content'

import { getProjects } from './projects'

import 'server-only'

interface SearchItem {
  title: string
  href: string
}

interface SearchData {
  posts: SearchItem[]
  projects: SearchItem[]
}

export const getSearchData = async (): Promise<SearchData> => {
  const [posts, projects] = await Promise.all([getAllPosts(), getProjects()])

  return {
    posts: posts.map((post) => ({
      title: post.title,
      href: `/blog/${post.slug}`
    })),
    projects: projects.map((project) => ({
      title: project.name,
      href: project.link
    }))
  }
}
