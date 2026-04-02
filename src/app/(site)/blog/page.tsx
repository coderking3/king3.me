import { blogDescription, BlogPage } from '@/views/blog'

export const metadata = {
  title: 'My Blog',
  description: blogDescription
}

export default function Page() {
  return <BlogPage />
}
