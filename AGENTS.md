<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Project Overview

**king3.me** — a personal blog and portfolio built with Next.js 16, React 19, and TypeScript. Features: MDX blog, project showcase, message board, admin dashboard, and OAuth authentication (Google/GitHub).

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 (compiler enabled)
- **Styling**: Tailwind CSS 4 + Shadcn UI (`base-nova` style, primitives from `@base-ui/react`) + CSS Modules
- **Animations**: Framer Motion + @react-spring/web
- **Authentication**: Better-Auth with OAuth (Google/GitHub)
- **Database**: Neon PostgreSQL + Prisma 7 (with `@prisma/adapter-pg`)
- **Forms**: react-hook-form + zod 4
- **Data Tables**: @tanstack/react-table
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

No test framework is configured — there are no test files or test commands.

## Architecture: App / Views / Components

The project follows a strict layered architecture:

### `src/app/` — Routing layer

Page files are **thin wrappers** responsible only for:

- Route definition and `metadata` / `revalidate` exports
- Data fetching (server actions, prisma queries)
- Passing data as props to view components

Page files should **not** contain UI markup, layout divs, or component imports beyond views.

### `src/views/` — Page view layer

Each route has a corresponding view component under `src/views/{feature}/`:

| Route                | View                            |
| -------------------- | ------------------------------- |
| `(site)/`            | `views/home/Home.tsx`           |
| `(site)/blog`        | `views/blog/Blog.tsx`           |
| `(site)/blog/[slug]` | `views/blog/Posts.tsx`          |
| `(site)/project`     | `views/project/Project.tsx`     |
| `(site)/message`     | `views/message/Message.tsx`     |
| `(site)/about`       | `views/about/About.tsx`         |
| `(site)/poems`       | `views/poems/Poems.tsx`         |
| `(site)/photos`      | _(placeholder — not yet built)_ |
| `(site)/use`         | _(placeholder — not yet built)_ |
| `auth/`              | `views/auth/Auth.tsx`           |
| `admin/`             | `views/admin/Dashboard.tsx`     |
| `admin/users`        | `views/admin/Users.tsx`         |
| `admin/projects`     | `views/admin/Projects.tsx`      |
| `admin/messages`     | `views/admin/Messages.tsx`      |
| `admin/playlist`     | `views/admin/Playlist.tsx`      |
| `admin/poems`        | `views/admin/Poems.tsx`         |

Views own all page UI: layout, headings, animations, and composition of sub-components. Barrel exported via each feature's `index.ts` (e.g. `src/views/admin/index.ts`).

### `src/components/` — Reusable component layer

- `components/ui/` — primitive UI components based on Base UI (barrel exported via `index.ts`)
- `components/` — composite components: `Modal`, `Confirm`, `DataTable`, `Form`, `Animated`, `ThemeMode` (barrel exported via `index.ts`)

### `src/layouts/` — Layout components

- Site layouts: `Header`, `Footer`, `Background`, `Navbar` (barrel exported via `index.ts`); also `Logo`, `UserAvatar`, `MobileNav`, `ArtPlum`, `ArtSnow` (imported directly)
- Admin layouts: `admin/Header`, `admin/Sidebar` (barrel exported via `admin/index.ts`)

### `src/stores/` — Client state (Zustand)

- `stores/auth/modal.ts` — shared AuthModal open/close state (`useAuthModal`)
- Barrel exported via `index.ts`; organized by domain (e.g. `stores/auth/`)

### `src/db/` — Data access layer

- `db/projects.ts`, `db/messages.ts`, `db/playlist.ts`, `db/poems.ts` — database query classes wrapping Prisma
- `db/dashboard.ts` — aggregated dashboard data queries
- Page-level data fetching should use these classes (e.g. `projectDb.queryAll()`) rather than calling `prisma` directly

### Common component patterns

**Modal** and **Confirm** share the same API pattern:

- **Controlled mode**: `open` + `onClose` props
- **Trigger mode**: `trigger` prop (renders a clickable element)
- **Footer customization**: `renderFooter` for fully custom footer, or default `confirmText` / `cancelText` / `onConfirm` / `onCancel`
- **Content slot**: `children` renders between header and footer

## Routing Structure

- **`(site)/`** — public-facing pages: `/`, `/blog`, `/blog/[slug]`, `/project`, `/message`, `/about`, `/poems`, `/photos`, `/use`
- **`admin/`** — authenticated admin dashboard: `/admin` (dashboard), `/admin/users`, `/admin/projects`, `/admin/messages`, `/admin/playlist`, `/admin/poems`
- **`auth/`** — login page
- **`api/auth/[...all]/`** — Better-Auth catch-all handler
- **`feed.xml/`** — RSS feed generation (ISR); `/feed`, `/rss`, `/rss.xml` rewrite to it

Each route group has its own layout. The site layout includes Header/Footer; the admin layout includes sidebar navigation and an auth guard.

## Key Architecture Decisions

### Import Aliases

- `@/*` maps to `src/*`
- `~/*` maps to project root (used for `~/prisma/generated/client`)

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

- **Server**: `src/lib/auth.ts` — `betterAuth()` instance with Prisma adapter, includes admin role checking
- **Client**: `src/lib/auth-client.ts` — `createAuthClient()` exports `signIn`, `signUp`, `signOut`, `useSession`
- **AuthModal**: `src/views/auth/AuthModal.tsx` — shared login modal, open/close state managed via `useAuthModal` (Zustand store in `src/stores/auth/`). Single instance rendered in `UserAvatar`; other pages trigger it via `useAuthModal().openModal()`

API routes: `src/app/api/auth/[...all]/route.ts` using `toNextJsHandler()`.

### Database

- Prisma schema at `prisma/schema.prisma` with client generated to `prisma/generated/`
- Uses `PrismaPg` adapter (not the default Prisma connector) — see `src/lib/prisma.ts`
- Singleton pattern with `globalThis` caching in development
- Auth models: `User`, `Session`, `Account`, `Verification`
- Business models: `Message` (with replies), `Project`, `Playlist`, `Poem`

### Server Actions

Server actions live in `src/app/actions/` and use helper functions from `src/lib/action.ts` (`actionSuccess`, `actionError`) for consistent return types.

### Styling

- Tailwind CSS 4 with `@import 'tailwindcss'` syntax
- Theme switching via `next-themes` (light/dark, class-based)
- Prettier uses `prettier-plugin-tailwindcss` for class sorting
- Stylelint enforces Recess property order with Tailwind directives whitelisted
- Custom fonts: Audiowide (local), Roboto Mono (Google Fonts) — configured in `src/lib/font.ts`

### State Management

- Zustand for client-side shared state, organized under `src/stores/` by domain
- No providers needed — import hooks directly (e.g. `useAuthModal` from `@/stores`)

### Shadcn UI Components

- Style: `base-nova`, primitives from `@base-ui/react`
- Component docs available at `.temp/docs/*.md` — read these before using unfamiliar components
- `DropdownMenuLabel` / `DropdownMenuItem` must be wrapped in `DropdownMenuGroup` (Base UI requirement)

### Configuration

- `reactStrictMode: false`, `reactCompiler: true` in Next.js config
- Remote image patterns: BiliBili CDN, Netease Music CDN, GitHub avatars
- ESLint uses `@king-3/eslint-config` with `defineConfig()` — see `eslint.config.js`
- Shadcn UI configured with RSC support and `base-nova` style — see `components.json`

### Icon & Animation Patterns

- Icons in `src/icons/` use `createInteractiveIcon()` + `@react-spring/web` for hover animations
- `useInteractive()` hook (`src/icons/_internal/hooks.ts`) provides `isHovered` state + mouse event `handlers`
- Spring config: `SPRINGS.springy` (`{ tension: 300, friction: 10 }`) in `src/constants.ts`

### Page Transition Guidelines

Page entrance animations use the `<Animated>` component (`src/components/Animated`) powered by Framer Motion. Follow these timing rules to keep pages feeling snappy (all content visible within ~0.7–0.9s):

**Global defaults** (`src/components/Animated/presets.ts`):

- `duration`: **0.35s** — single element animation length
- `ease`: `[0.22, 1, 0.36, 1]` — cubic-bezier easeOutExpo
- `fadeInUp` offset: **14px**

**Header pattern** — title and description animate separately:

```
<header>
  <Animated preset="fadeInUp">                                // delay: 0
    <h1>Title</h1>
  </Animated>
  <Animated preset={{ mode: 'fadeInUp', delay: 0.06 }}>      // delay: 0.06
    <p>Description</p>
  </Animated>
</header>
```

**Staggered list pattern** — cards/items use base delay + per-item stagger:

```
BASE_DELAY = 0.12        // start after header finishes
STAGGER_DELAY = 0.04     // interval between items

<Animated preset={{ mode: 'fadeInUp', delay: BASE_DELAY + idx * STAGGER_DELAY }}>
```

**Timing budget reference** (12-item list page):

| Element     | delay | ends at   |
| ----------- | ----- | --------- |
| Title       | 0s    | 0.35s     |
| Description | 0.06s | 0.41s     |
| 1st card    | 0.12s | 0.47s     |
| 6th card    | 0.32s | 0.67s     |
| 12th card   | 0.56s | **0.91s** |

**Rules of thumb**:

- All first-screen content should be visible within **~0.7s**
- Full page content within **~0.9s** max
- Never exceed **1s** total — users lose attention beyond that (Nielsen Norman Group)
- Use `preset` for standard animations; only use `animation` prop for custom behaviors (e.g. scale bounce on social icons)
- **React Compiler compatibility** (`reactCompiler: true`):
  - Do **not** extract sub-components that receive referentially-stable mutable objects (e.g. TanStack `table`, `row`) as props — React Compiler caches renders based on reference equality, so state changes inside those objects will be missed. Prefer inline render functions instead.
  - When a component boundary is **required** (e.g. for hooks like `useSortable`), pass derived primitive props (e.g. `isExpanded={row.getIsExpanded()}`) alongside the mutable object so React Compiler can detect state changes.
  - See `DataTable` for the canonical example: most rendering is inlined; only `TableSortableRow` is a separate component (because it needs `useSortable`), and it receives `isExpanded`/`isSelected` primitives to break memoization.

### Key Files

- `src/constants.ts` — navigation items, spring configs, author info, copyright
- `src/lib/utils.ts` — `cn()` (clsx + tailwind-merge), `capitalize()`
- `src/lib/math.ts` — `clamp()`, `range()`, `roundTo()`, `randomList()`

### Environment Variables

See `.env.example` for required variables: `SITE_URL`, `DATABASE_URL`, `DIRECT_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, Google/GitHub OAuth credentials.

## Code Conventions

- **Language**: All code comments, JSDoc, and section headers must be in **English**. Do not use Chinese in source code.
