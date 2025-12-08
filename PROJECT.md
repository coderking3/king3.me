# PROJECT.md

> 个人网站项目技术文档 - 完整版

---

## 📌 项目概述

个人网站项目，基于 **Next.js 16**，采用现代化全栈架构，实现博客、项目展示、照片墙、诗词等功能。

**核心理念：**

- 🎨 极简主义设计（Geist Minimalist + Bento）
- ⚡ 高性能（SSG + ISR）
- 🔒 类型安全（TypeScript）
- 🎯 SEO 友好

---

## 🏗️ 技术架构

### 核心框架

```
Next.js 16 (App Router) + React 19 + TypeScript
```

---

## 📊 数据管理策略

### 1. 内容管理（Content）

#### 博客文章 → MDX（本地文件）

**为什么选择 MDX？**

- ✅ 完全自由的 Markdown 编写
- ✅ 可嵌入 React 组件
- ✅ Git 版本控制
- ✅ 完全免费，无依赖第三方服务
- ✅ 高度自定义，不受格式束缚

**技术栈：**

- `@next/mdx` - Next.js MDX 支持
- `@mdx-js/loader` + `@mdx-js/react` - MDX 核心
- `remark-gfm` - GitHub Flavored Markdown
- `rehype-pretty-code` - 代码高亮（基于 Shiki）
- `rehype-slug` + `rehype-autolink-headings` - 标题锚点
- `gray-matter` - Frontmatter 解析
- `shiki` - 代码语法高亮（VS Code 级别）

**文件结构：**

```
content/
└── blog/
    ├── 2024-12-01-first-post.mdx
    ├── 2024-12-02-second-post.mdx
    └── ...
```

**Frontmatter 格式：**

```mdx
---
title: '文章标题'
description: '文章摘要'
date: '2024-12-02'
tags: ['Next.js', 'MDX']
coverImage: '/images/blog/cover.jpg'
---
```

---

#### 动态内容 → Payload CMS + Supabase

**管理内容：**

- 项目列表（Portfolio）
- 工具库展示
- 照片墙（Photos）
- 诗词/句子（Poems）
- 静态页面内容（About 等）

**技术栈：**

- `Payload CMS 3.0+` - 开源 Headless CMS
- `@payloadcms/next` - Next.js 集成
- `@payloadcms/db-postgres` - PostgreSQL 适配器
- `@payloadcms/richtext-lexical` - 富文本编辑器
- `Supabase (PostgreSQL)` - 数据库托管

**Payload 配置位置：**

```
payload.config.ts
collections/
├── Projects.ts
├── Photos.ts
├── Poems.ts
└── Users.ts
```

**为什么不用 Prisma 管理内容？**

- Payload 提供开箱即用的管理界面
- 内置媒体管理、版本控制
- 非技术人员也能使用

---

### 2. 动态数据（Interactive Data）

#### Prisma + Supabase

**管理数据：**

- 用户评论（Comments）
- 点赞/收藏（Likes）
- 浏览量统计（Page Views）
- 用户互动记录
- 留言板数据（待定）

**技术栈：**

- `Prisma 7` - TypeScript ORM
- `@prisma/client` - Prisma Client
- `@prisma/adapter-pg` - PostgreSQL 驱动适配器
- `Supabase PostgreSQL` - 数据库

**Prisma Schema 示例：**

```prisma
model Comment {
  id        String   @id @default(cuid())
  content   String
  author    String
  postSlug  String   // 关联 MDX 文章的 slug
  approved  Boolean  @default(false)
  createdAt DateTime @default(now())
}

model PageView {
  id        String   @id @default(cuid())
  slug      String   @unique
  views     Int      @default(0)
  updatedAt DateTime @updatedAt
}

model Like {
  id        String   @id @default(cuid())
  postSlug  String
  userId    String
  createdAt DateTime @default(now())

  @@unique([postSlug, userId])
}
```

---

### 3. 数据流总结

```
┌─────────────────────────────────────┐
│         Next.js 16 应用              │
├─────────────────────────────────────┤
│                                     │
│  MDX 文件(本地)                       │
│  └─ 博客文章                          │
│                                     │
│  Payload CMS (Supabase)             │
│  ├─ 项目展示                          │
│  ├─ 照片墙                            │
│  └─ 诗词                             │
│                                     │
│  Prisma (Supabase)                  │
│  ├─ 留言板                           │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔐 认证系统

### 方案选择（待定）

#### 方案 A：Better Auth（推荐）⭐⭐⭐⭐⭐

**优点：**

- ✅ 完全免费开源
- ✅ TypeScript 原生
- ✅ 内置 2FA、多会话、组织管理
- ✅ 与 Prisma 深度集成
- ✅ 插件系统
- ✅ 数据保留在自己的数据库

**技术栈：**

- `better-auth`
- `@better-auth/prisma-adapter`

**用途：**

- 留言板认证

---

#### 方案 B：Clerk（备选）⭐⭐⭐⭐

**优点：**

- ✅ 5 分钟快速集成
- ✅ 精美的预制 UI
- ✅ 企业级功能

**缺点：**

- ⚠️ 免费层限制（10,000 MAU）
- ⚠️ 付费后较贵

**技术栈：**

- `@clerk/nextjs`

---

### 认证流程

```
用户访问留言板
    ↓
未登录 → 显示登录/注册按钮 → Better Auth 登录
    ↓
已登录 → 显示留言表单 → 提交留言 → Prisma 存储
```

---

## 🎨 UI/UX 设计系统

### 设计风格

**"Geist Minimalist" + "Bento Grid" 混合风格**

**核心理念：**

- 极简主义（Less is More）
- 大量留白
- 微妙的边框和阴影
- 流畅的动画过渡

---

### 配色方案

#### 基础色：Zinc 系列

```css
/* Light Mode */
--background: white or zinc-50 --foreground: zinc-900 --border: zinc-200/40
  (关键！微妙边框) --muted: zinc-100 --muted-foreground: zinc-500
  /* Dark Mode */ --background: zinc-950 (不要用纯黑 #000) --foreground: zinc-50
  --border: zinc-800/40 (关键！) --muted: zinc-900 --muted-foreground: zinc-400;
```

#### 强调色（Accent）

**方案 1：单一强调色（推荐）**

```css
--primary: indigo-500 或 orange-500 --primary-foreground: white;
```

**方案 2：纯黑白（极简）**

```css
Light Mode: 黑色文字 (zinc-900)
Dark Mode: 白色文字 (zinc-50)
```

#### 边框策略（极其重要！）

```html
// ✅ 正确：微妙的透明边框
<div className="border border-zinc-200/40 dark:border-zinc-800/40" />
// ❌ 错误：过于明显的边框
<div className="border border-zinc-300" />
```

**为什么重要？**

- 细微边框比背景色更能体现精致感
- 透明度让边框更自然融入背景

---

### 字体排印（Typography）

#### 字体选择

| 用途          | 字体           | 说明                            |
| ------------- | -------------- | ------------------------------- |
| **正文/标题** | Geist Sans     | Vercel 出品，开源，专为 UI 设计 |
| **备选**      | Inter          | Google Fonts，广泛使用          |
| **代码**      | Geist Mono     | 等宽字体，与 Geist Sans 配套    |
| **备选代码**  | JetBrains Mono | 编程专用等宽字体                |

#### 字体配置

**使用 next/font（推荐）**

```tsx
// app/layout.tsx
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'

export default function RootLayout({ children }) {
  return (
    <html
      lang="zh-CN"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

**安装字体：**

```bash
npm install geist
```

**Tailwind 配置：**

```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace']
      }
    }
  }
}
```

---

#### 文章内容排版

使用 `@tailwindcss/typography` 插件：

```bash
npm install @tailwindcss/typography
```

**Tailwind 配置：**

```javascript
// tailwind.config.ts
module.exports = {
  plugins: [require('@tailwindcss/typography')],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'var(--foreground)',
            a: {
              color: 'var(--primary)',
              '&:hover': {
                color: 'var(--primary-dark)'
              }
            },
            code: {
              backgroundColor: 'var(--muted)',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontWeight: '400'
            }
          }
        }
      }
    }
  }
}
```

**使用：**

```tsx
<article className="prose prose-zinc dark:prose-invert lg:prose-lg max-w-none">
  <MDXContent />
</article>
```

---

### 组件库

#### shadcn/ui

**安装：**

```bash
npx shadcn@latest init
```

**推荐组件：**

```bash
npx shadcn@latest add button card dialog input textarea tabs toast
```

**配置：**

```json
{
  "style": "new-york",
  "tailwind": {
    "baseColor": "zinc"
  }
}
```

---

### 动画库

#### Framer Motion

```bash
npm install framer-motion
```

**使用场景：**

- 页面切换动画
- 元素进入视口动画
- 交互式卡片翻转
- 导航菜单动画

**示例：**

```tsx
'use client'

import { motion } from 'framer-motion'

export function FadeIn({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}
```

---

## 🚀 性能优化

### 1. 图片优化

#### Next.js Image 组件 + Sharp

**自动优化：**

- WebP/AVIF 格式转换
- 响应式图片
- 懒加载
- 模糊占位符

**使用方式：**

```tsx
import Image from 'next/image'

// 本地图片
const localImage = (
  <Image
    src="/images/photo.jpg"
    alt="描述"
    width={800}
    height={600}
    className="rounded-lg"
    placeholder="blur"
  />
)

// 远程图片（Supabase/Payload）
const remoteImage = (
  <Image
    src="https://cdn.example.com/image.jpg"
    alt="描述"
    fill
    className="object-cover"
  />
)
```

**配置 next.config.js：**

```javascript
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co'
      }
    ],
    formats: ['image/webp', 'image/avif']
  }
}
```

**Sharp 自动安装：**

```bash
npm install sharp
```

---

#### Next.js 内置缓存

**静态生成（SSG）：**

```tsx
// 博客文章 - 构建时生成
export default async function PostPage({ params }) {
  const post = getPostBySlug(params.slug)
  return <Article post={post} />
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}
```

**增量静态再生（ISR）：**

```tsx
// 项目列表 - 每小时更新
export const revalidate = 3600 // 1小时

export default async function ProjectsPage() {
  const projects = await getProjects()
  return <ProjectList projects={projects} />
}
```

**按需重新验证：**

```typescript
// Server Action
'use server'

import { revalidatePath } from 'next/cache'

export async function createComment(formData) {
  // 保存评论到数据库
  await prisma.comment.create({
    /* ... */
  })

  // 重新生成该文章页面
  revalidatePath('/blog/[slug]')
}
```

---

### 3. 代码分割

**动态导入：**

```tsx
import dynamic from 'next/dynamic'

// 懒加载重型组件
const HeavyComponent = dynamic(() => import('@/components/heavy'), {
  loading: () => <Skeleton />,
  ssr: false // 仅客户端渲染
})
```

---

## 📡 部署方案

### Vercel（推荐）⭐⭐⭐⭐⭐

**为什么选择 Vercel？**

- ✅ Next.js 官方推荐
- ✅ 零配置部署
- ✅ 自动 HTTPS
- ✅ 全球 Edge Network
- ✅ 免费额度慷慨
- ✅ 自动预览部署（PR）
- ✅ 环境变量管理

**部署流程：**

1. **连接 GitHub**
   - 访问 [vercel.com](https://vercel.com)
   - Import Git Repository
   - 选择你的仓库

2. **配置环境变量**

   ```
   DATABASE_URL
   DIRECT_URL
   PAYLOAD_SECRET
   BETTER_AUTH_SECRET
   等等...
   ```

3. **构建设置（自动检测）**

   ```
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **点击 Deploy**

**自动部署触发：**

- Push to `main` → 生产环境
- Pull Request → 预览环境

---

### 性能监控

**Vercel Analytics：**

```bash
npm install @vercel/analytics
```

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

---

## 🔍 SEO 优化

### 1. Metadata API

```typescript
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const post = getPostBySlug(params.slug)

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [post.coverImage],
      type: 'article',
      publishedTime: post.date
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.coverImage]
    }
  }
}
```

---

### 2. Sitemap

**安装：**

```bash
npm install next-sitemap
```

**配置 `next-sitemap.config.js`：**

```javascript
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://yourwebsite.com',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/studio', '/admin']
}
```

**package.json：**

```json
{
  "scripts": {
    "postbuild": "next-sitemap"
  }
}
```

---

### 3. RSS Feed

```bash
npm install feed
```

```typescript
import { Feed } from 'feed'

// app/rss.xml/route.ts
import { getAllPosts } from '@/lib/blog'

export async function GET() {
  const posts = getAllPosts()

  const feed = new Feed({
    title: '我的博客',
    description: '个人博客 RSS',
    id: 'https://yourwebsite.com',
    link: 'https://yourwebsite.com',
    language: 'zh-CN',
    copyright: 'All rights reserved 2024'
  })

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `https://yourwebsite.com/blog/${post.slug}`,
      link: `https://yourwebsite.com/blog/${post.slug}`,
      description: post.description,
      date: new Date(post.date)
    })
  })

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml'
    }
  })
}
```

---

## 📂 项目文件结构

```
my-website/
├── app/
│   ├── (main)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── projects/
│   │   ├── photos/
│   │   └── poems/
│   ├── (payload)/
│   │   ├── admin/[[...segments]]/page.tsx
│   │   └── api/[...slug]/route.ts
│   ├── layout.tsx
│   └── globals.css
│
├── content/
│   └── blog/
│       ├── 2024-12-01-first-post.mdx
│       └── 2024-12-02-second-post.mdx
│
├── components/
│   ├── ui/              # shadcn/ui 组件
│   ├── layout/          # 布局组件
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── nav.tsx
│   ├── blog/
│   │   ├── post-card.tsx
│   │   └── mdx-components.tsx
│   └── shared/
│
├── collections/         # Payload CMS 集合
│   ├── Projects.ts
│   ├── Photos.ts
│   ├── Poems.ts
│   └── Users.ts
│
├── lib/
│   ├── prisma.ts       # Prisma 客户端
│   ├── payload.ts      # Payload 客户端
│   ├── blog.ts         # MDX 博客工具函数
│   ├── actions/        # Server Actions
│   │   ├── comments.ts
│   │   └── analytics.ts
│   └── utils/
│
├── prisma/
│   └── schema.prisma   # Prisma 数据库模型
│
├── public/
│   ├── images/
│   │   ├── blog/
│   │   └── projects/
│   └── fonts/
│
├── payload.config.ts   # Payload CMS 配置
├── next.config.mjs     # Next.js 配置
├── tailwind.config.ts  # Tailwind 配置
├── tsconfig.json       # TypeScript 配置
├── mdx-components.tsx  # MDX 组件配置
└── .env.local          # 环境变量
```

---

## ✅ 技术栈总结

### 核心技术

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui

### 内容管理

- MDX（博客）
- Payload CMS（动态内容）
- Prisma 7（动态数据）
- Supabase PostgreSQL

### 认证

- Better Auth 或 Clerk（待定）

### UI/动画

- Geist 字体
- Framer Motion
- @tailwindcss/typography

### 性能

- Next.js Image + Sharp
- ISR 缓存
- Upstash Redis（可选）

### 部署

- Vercel
- Vercel Analytics

---

## 🚧 待完成事项

### 高优先级

- [ ] 确定认证方案（Better Auth vs Clerk）
- [ ] 设计 Bento Grid 首页布局
- [ ] 配置暗色模式切换
- [ ] 实现 MDX 博客系统

### 中优先级

- [ ] 留言板功能设计
- [ ] 评论审核流程
- [ ] 添加搜索功能
- [ ] 配置 RSS Feed

### 低优先级

- [ ] 决定是否使用 Upstash Redis
- [ ] 添加分析统计
- [ ] 性能测试和优化
- [ ] E2E 测试

---

## 📝 需要补充的功能

### 1. 搜索功能

**方案 A：客户端搜索（简单）**

- 使用 Fuse.js 进行模糊搜索
- 适合小型博客（< 100 篇文章）

**方案 B：Algolia（专业）**

- 全文搜索
- 实时索引
- 免费层：10,000 次搜索/月

**方案 C：Meilisearch（开源）**

- 自托管搜索引擎
- 速度快，易用

---

### 2. 评论系统细节

**评论审核流程：**

1. 用户提交评论 → Prisma 存储（`approved: false`）
2. 管理员在 Payload Admin 中审核
3. 批准后前端显示

**垃圾评论过滤：**

- 使用 Akismet API
- 简单的关键词过滤
- 限制评论频率（Redis）

**通知机制：**

- 新评论通知管理员（邮件）
- 评论回复通知用户

---

### 3. Analytics

**推荐方案：**

- Vercel Analytics（基础指标）
- Google Analytics 4（详细分析）
- Plausible（隐私友好，付费）

---

### 4. 测试策略

**单元测试：**

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
```

**E2E 测试：**

```bash
npm install -D @playwright/test
```

**性能测试：**

- Lighthouse CI
- Web Vitals 监控

---

### 5. CI/CD

**GitHub Actions 配置：**

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

---

### 6. 备份策略

**数据库备份：**

- Supabase 自动备份（每日）
- 手动导出重要数据

**媒体文件备份：**

- Payload 媒体文件定期备份到云存储
- 使用 GitHub 备份配置文件

---

## 🎯 开发路线图

### Phase 1：基础设施（2 周）

- [x] 项目初始化
- [ ] Next.js + TypeScript 配置
- [ ] Tailwind CSS + shadcn/ui
- [ ] Prisma + Supabase 集成
- [ ] 基础布局和导航

### Phase 2：内容系统（2 周）

- [ ] MDX 博客系统
- [ ] Payload CMS 集成
- [ ] 项目展示页面
- [ ] 照片墙功能
- [ ] 诗词展示

### Phase 3：交互功能（2 周）

- [ ] 认证系统集成
- [ ] 评论功能
- [ ] 点赞/收藏
- [ ] 留言板
- [ ] 浏览量统计

### Phase 4：优化和上线（1 周）

- [ ] SEO 优化
- [ ] 性能优化
- [ ] 暗色模式
- [ ] 部署到 Vercel
- [ ] 域名配置

### Phase 5：增强功能（持续）

- [ ] 搜索功能
- [ ] RSS Feed
- [ ] 分析统计
- [ ] 备份系统
- [ ] 持续优化

---
