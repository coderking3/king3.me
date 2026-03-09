# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **king3.me**, a personal blog built with Next.js 16, React 19, and TypeScript. It features a blog with MDX posts, project showcase, message board, and OAuth authentication.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Styling**: Tailwind CSS 4 + Shadcn UI (Base UI)
- **Animations**: Framer Motion + @react-spring/web
- **Authentication**: Better-Auth with OAuth (Google/GitHub)
- **Database**: Neon PostgreSQL + Prisma 7
- **CSS-in-JS**: Linaria (@wyw-in-js)
- **Package Manager**: pnpm

## Common Commands

```bash
# Development - runs on port 3060
pnpm dev

# Production build
pnpm build

# Start production server - runs on port 3080
pnpm start

# Linting
pnpm lint              # Run ESLint
pnpm lint:fix          # Fix ESLint issues
pnpm stylelint         # Run Stylelint on CSS files
pnpm stylelint:fix     # Fix CSS issues
pnpm format            # Run Prettier on all files

# Database
pnpm db:generate       # Generate Prisma client
pnpm db:push           # Push schema changes to database
```

## Project Structure

```
src/
├── app/                 # Next.js App Router routes
│   ├── api/auth/[...all]/    # Better-Auth API routes
│   ├── blog/                 # Blog listing and posts
│   ├── feed.xml/             # RSS feed generation (ISR)
│   ├── message/              # Message board page
│   ├── project/              # Projects showcase
│   └── ...
├── components/
│   ├── blocks/         # Page-specific components (home, blog, project, message, auth)
│   ├── layouts/        # Layout components (Header, Footer, Background)
│   └── ui/             # Reusable UI components (Base UI based)
├── lib/                # Utility functions
│   ├── auth.ts         # Better-Auth configuration
│   ├── posts.ts        # MDX post processing utilities
│   ├── prisma.ts       # Prisma client singleton
│   └── rss.ts          # RSS feed generation
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── styles/             # Global CSS and Tailwind config

content/posts/          # MDX blog post files
prisma/
├── schema.prisma       # Database schema
└── generated/          # Generated Prisma client
```

## Key Architecture Decisions

### MDX Blog System

Blog posts are stored as `.mdx` files in `content/posts/`. Each post has frontmatter with the following fields:

```yaml
---
title: string
description: string
image: string
date: YYYY-MM-DD HH:mm:ss
tags: string[]
published: boolean
---
```

Posts are processed using `gray-matter` for frontmatter parsing and `next-mdx-remote` for rendering. The `src/lib/posts.ts` module provides utilities:

- `getAllPosts()` - Returns all published posts sorted by date
- `getPostsBySlug(slug)` - Returns a single post with content
- `extractHeadings(content)` - Extracts TOC from markdown headings

### Authentication

Authentication uses **Better-Auth** with the Prisma adapter. The auth configuration is in `src/lib/auth.ts` and supports:

- OAuth providers: Google, GitHub
- Session management via cookies
- Database-backed sessions and accounts

API routes are handled by `src/app/api/auth/[...all]/route.ts` using `toNextJsHandler()`.

### Database Schema

The Prisma schema includes models for:

- `User` / `Session` / `Account` / `Verification` - Better-Auth tables
- `Message` - Message board entries

The Prisma client is generated to `prisma/generated/` and imported via `src/lib/prisma.ts` as a singleton.

### Styling System

- **Tailwind CSS 4** uses the new `@import 'tailwindcss'` syntax
- **Base UI** components (not Radix) - imported from `@base-ui/react`
- **Linaria** for CSS-in-JS via `next-with-linaria`
- Custom fonts: Wotfard, PingFang SC, FiraCode
- Theme switching via `next-themes` (light/dark modes)

### RSS Feed

The RSS feed is generated at `/feed.xml` with ISR revalidation every hour. Aliases `/feed`, `/rss`, and `/rss.xml` redirect to it.

## Configuration Notes

### Next.js (`next.config.ts`)

- `reactStrictMode: false` - Strict mode is disabled
- `reactCompiler: true` - React Compiler is enabled
- Custom remote image patterns for BiliBili and Netease Cloud Music

### TypeScript Paths

- `@/*` maps to `src/*`
- `~/*` maps to root directory

### ESLint

Uses `@king-3/eslint-config` with custom overrides in `eslint.config.js`.

### Environment Variables

Required variables (see `.env.example`):

- `SITE_URL` - Public site URL
- `DATABASE_URL` / `DIRECT_URL` - Neon PostgreSQL URLs
- `BETTER_AUTH_URL` / `BETTER_AUTH_SECRET` - Auth configuration
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` - GitHub OAuth

## Development Guidelines

1. **Components**: Place page-specific components in `src/components/blocks/{feature}/`, shared UI in `src/components/ui/`
2. **MDX Posts**: Add new posts to `content/posts/` with required frontmatter fields
3. **Database Changes**: After modifying `prisma/schema.prisma`, run `pnpm db:generate` and `pnpm db:push`
4. **CSS**: Follow Stylelint rules; use Tailwind's `@apply` for complex utilities
5. **Types**: Add shared types to `src/types/`; use `.d.ts` for module declarations
