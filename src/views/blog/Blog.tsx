import type { PostsMetadata } from '@/types'

import { Animated } from '@/components'
import { STAGGER } from '@/constants'

import PostsCard from './PostsCard'

const description =
  'Writing blog posts is one of my favorite ways to share and reflect, and I hope to pass on useful technical knowledge to more people. I prefer writing about technical topics, but I also write about non-technical topics, such as photography and personal reflections.'

export { description }

function Blog({ posts }: { posts: PostsMetadata[] }) {
  return (
    <div className="mt-14 sm:mt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <header className="max-w-2xl">
          <Animated
            as="h1"
            preset="fadeInUp"
            className="text-primary font-mono text-4xl font-medium tracking-tight sm:text-5xl"
          >
            Welcome to my blog
          </Animated>
          <Animated
            as="p"
            preset={{ mode: 'fadeInUp', delay: 0.06 }}
            className="text-muted-foreground mt-6 text-lg"
          >
            {description}
          </Animated>
        </header>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-20 sm:grid-cols-2 sm:gap-8">
          {posts.map((post, idx) => (
            <Animated
              key={post.slug}
              preset={{
                mode: 'fadeInUp',
                delay: STAGGER.base + idx * STAGGER.step
              }}
            >
              <PostsCard metadata={post} />
            </Animated>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Blog
