export default async function Page() {
  // 模拟数据 - 实际项目中从数据库或 CMS 获取
  const posts = [
    {
      id: 1,
      title: 'Building a Modern Blog with Next.js 14',
      excerpt:
        'Exploring the latest features of Next.js 14 including Server Components, Server Actions, and the new App Router architecture.',
      date: '2024-12-20',
      readTime: '8 min read',
      tags: ['Next.js', 'React', 'Web Development']
    },
    {
      id: 2,
      title: 'Mastering Tailwind CSS: Tips and Tricks',
      excerpt:
        'A comprehensive guide to writing maintainable and scalable CSS with Tailwind, including custom configurations and best practices.',
      date: '2024-12-15',
      readTime: '6 min read',
      tags: ['CSS', 'Tailwind', 'Design']
    },
    {
      id: 3,
      title: 'TypeScript Advanced Patterns',
      excerpt:
        'Deep dive into advanced TypeScript patterns including conditional types, mapped types, and template literal types.',
      date: '2024-12-10',
      readTime: '10 min read',
      tags: ['TypeScript', 'JavaScript']
    },
    {
      id: 4,
      title: 'State Management in React: A Complete Guide',
      excerpt:
        'Comparing different state management solutions from useState to Zustand, Redux, and Jotai.',
      date: '2024-12-05',
      readTime: '12 min read',
      tags: ['React', 'State Management']
    }
  ]

  const skills = [
    { name: 'React / Next.js', level: 95 },
    { name: 'TypeScript', level: 90 },
    { name: 'Tailwind CSS', level: 88 },
    { name: 'Node.js', level: 85 },
    { name: 'Python', level: 80 }
  ]

  return (
    <div>
      {/* Hero Section - 个人简介 */}
      <section className="py-20">
        {/* <div className="mx-auto max-w-4xl"> */}
        <div>
          <div className="space-y-6">
            <h1 className="text-primary text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Hi, I'm <span>King3</span>
            </h1>
            <p className="max-w-2xl text-xl leading-relaxed md:text-2xl">
              A full-stack developer passionate about building beautiful,
              performant web applications. I write about modern web development,
              design systems, and everything in between.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Twitter
              </a>
              <a
                href="mailto:hello@example.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - 文章列表 + 侧边栏 */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-12">
            {/* Left - 博客文章列表 */}
            <div className="space-y-12">
              <h2 className="text-primary text-3xl font-bold">Recent Posts</h2>

              <div className="space-y-8">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="group rounded-lg border p-6 transition-all duration-300"
                  >
                    <div className="space-y-3">
                      <div className="text-muted-foreground flex items-center gap-3 text-sm">
                        <time>{post.date}</time>
                        <span>·</span>
                        <span>{post.readTime}</span>
                      </div>

                      <h3 className="group-hover:text-accent-foreground text-2xl font-semibold transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-muted-foreground leading-relaxed">
                        {post.excerpt}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Right - 侧边栏展示区 */}
            <aside className="space-y-8">
              {/* About Card */}
              <div className="top-8 space-y-4 rounded-lg border p-6">
                <h3 className="text-lg font-semibold">About Me</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Based in San Francisco, building products that people love.
                  Currently working on next-generation web tools.
                </p>
              </div>

              {/* Skills Card */}
              <div className="space-y-4 rounded-lg border p-6">
                <h3 className="text-lg font-semibold">Skills</h3>
                <div className="space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground">{skill.name}</span>
                        <span className="text-muted-foreground">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="bg-secondary h-2 overflow-hidden rounded-full">
                        <div
                          className="bg-foreground h-full rounded-full transition-all duration-500"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Currently Reading */}
              <div className="space-y-4 rounded-lg border p-6">
                <h3 className="text-lg font-semibold">Currently Reading</h3>
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium">
                      Designing Data-Intensive Applications
                    </p>
                    <p className="text-muted-foreground">by Martin Kleppmann</p>
                  </div>
                </div>
              </div>

              {/* Now Playing */}
              <div className="space-y-4 rounded-lg border p-6">
                <h3 className="text-lg font-semibold">Now Playing</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex h-12 w-12 items-center justify-center rounded">
                      <span className="text-2xl">🎵</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        Blinding Lights
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        The Weeknd
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4 rounded-lg border p-6">
                <h3 className="text-lg font-semibold">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold">42</p>
                    <p className="text-muted-foreground text-xs">Articles</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">15k</p>
                    <p className="text-muted-foreground text-xs">Views</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">3.2k</p>
                    <p className="text-muted-foreground text-xs">Followers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">128</p>
                    <p className="text-muted-foreground text-xs">Stars</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
