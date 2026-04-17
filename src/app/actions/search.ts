'use server'

import { projectDb } from '@/db/projects'
import { actionError, actionSuccess } from '@/lib/action'
import { getAllPosts } from '@/lib/posts'

export async function getSearchData() {
  try {
    const [posts, projects] = await Promise.all([
      getAllPosts(),
      projectDb.queryAll()
    ])

    return actionSuccess({
      posts: posts.map((post) => ({
        title: post.title,
        slug: post.slug
      })),
      projects: projects.map((project) => ({
        name: project.name,
        link: project.link
      }))
    })
  } catch (error: unknown) {
    return actionError(error)
  }
}
