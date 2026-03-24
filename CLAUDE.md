# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **king3.me**, a personal blog built with Next.js 16, React 19, and TypeScript. It features a blog with MDX posts, project showcase, message board, and OAuth authentication.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Styling**: Tailwind CSS 4 + Shadcn UI (`base-nova` style, primitives from `@base-ui/react`)
- **Animations**: Framer Motion + @react-spring/web
- **Authentication**: Better-Auth with OAuth (Google/GitHub)
- **Database**: Neon PostgreSQL + Prisma 7 (with `@prisma/adapter-pg`)
- **CSS-in-JS**: Linaria via `next-with-linaria`
- **Package Manager**: pnpm

## Common Commands

```bash
pnpm dev               # Development server on port 3060
pnpm build             # Production build (runs prisma generate first)
pnpm start             # Production server on port 3080

pnpm lint              # Run ESLint
pnpm lint:fix          # Fix ESLint issues
pnpm stylelint         # Run Stylelint on CSS files
pnpm stylelint:fix     # Fix CSS issues
pnpm format            # Run Prettier on all files

pnpm db:generate       # Generate Prisma client
pnpm db:push           # Push schema changes to database
```

## Key Architecture Decisions

### Import Aliases

- `@/*` maps to `src/*`
- `~/*` maps to project root (used for `~/prisma/generated/client`)

### Component Organization

- `src/components/blocks/{feature}/` — page-specific components (home, blog, project, message, auth)
- `src/components/layouts/` — Header, Footer, Background, Navbar (barrel exported via `index.ts`)
- `src/components/ui/` — reusable UI components based on Base UI (barrel exported via `index.ts`)

### MDX Blog System

Blog posts live in `content/posts/` as `.mdx` files. Required frontmatter:

```yaml
title: string
description: string
image: string
date: YYYY-MM-DD HH:mm:ss
tags: string[]
published: boolean
```

Key utilities in `src/lib/posts.ts`: `getAllPosts()`, `getPostsBySlug(slug)`, `extractHeadings(content)`. Posts are parsed with `gray-matter` and rendered with `next-mdx-remote`. Heading IDs use `github-slugger` (matching `rehype-slug`).

### Authentication (Better-Auth)

Two auth modules exist:

- **Server**: `src/lib/auth.ts` — `betterAuth()` instance with Prisma adapter, used in API routes and server components
- **Client**: `src/lib/auth-client.ts` — `createAuthClient()` exports `signIn`, `signUp`, `signOut`, `useSession` for client components

API routes: `src/app/api/auth/[...all]/route.ts` using `toNextJsHandler()`.

### Database

- Prisma client generated to `prisma/generated/` and imported via `~/prisma/generated/client`
- Uses `PrismaPg` adapter (not the default Prisma connector) — see `src/lib/prisma.ts`
- Singleton pattern with `globalThis` caching in development
- Models: `User`, `Session`, `Account`, `Verification` (Better-Auth), `Message` (message board)

### Styling

- Tailwind CSS 4 with `@import 'tailwindcss'` syntax
- Theme switching via `next-themes` (light/dark, class-based)
- Custom fonts: Wotfard, PingFang SC, FiraCode (configured in `src/lib/font.ts`)

### Configuration

- `reactStrictMode: false`, `reactCompiler: true` in Next.js config
- Next.js config wrapped with `withLinaria()` — see `next.config.ts`
- ESLint uses `@king-3/eslint-config` with `defineConfig()` — see `eslint.config.js`
- RSS feed at `/feed.xml` with ISR; `/feed`, `/rss`, `/rss.xml` rewrite to it

### Key Files

- `src/constants.ts` — navigation items, spring configs, author info, copyright
- `src/lib/utils.ts` — `cn()` utility (clsx + tailwind-merge)

### Environment Variables

See `.env.example` for required variables: `SITE_URL`, `DATABASE_URL`, `DIRECT_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, Google/GitHub OAuth credentials.
