# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Project Overview

**king3.me** — a personal website and blog built with Next.js 16 (App Router), React 19, and TypeScript. Features include: blog (MDX), project showcase, message board, photo gallery, poems, playlist, an admin dashboard for CRUD management, OAuth login (GitHub / Google), i18n (en / zh), dark mode, and RSS feed.

## Tech Stack

| Layer           | Technology                                                                       |
| --------------- | -------------------------------------------------------------------------------- |
| Framework       | Next.js 16, React 19, React Compiler                                             |
| Language        | TypeScript (strict mode)                                                         |
| Styling         | Tailwind CSS v4, CSS Modules, PostCSS, tw-animate-css                            |
| UI Components   | shadcn/ui (base-nova style, zinc base color), Lucide icons                       |
| Animation       | Framer Motion, @react-spring/web                                                 |
| Auth            | better-auth (GitHub + Google OAuth), @better-auth/infra                          |
| Database        | PostgreSQL via Prisma ORM (with @prisma/adapter-pg)                              |
| Forms           | react-hook-form + @hookform/resolvers + Zod v4                                   |
| State           | Zustand                                                                          |
| i18n            | i18next, react-i18next, i18next-browser-languagedetector                         |
| Tables          | @tanstack/react-table, @dnd-kit (drag-sort)                                      |
| MDX             | next-mdx-remote, gray-matter, rehype-pretty-code, rehype-slug, remark-gfm, shiki |
| Linting         | ESLint 9 (@king-3/eslint-config), Stylelint, Prettier (@king-3/prettier-config)  |
| Package Manager | pnpm                                                                             |
| Hosting         | Vercel                                                                           |

## Project Structure

```
├── content/
│   ├── posts/          # Blog posts as .mdx files (front matter: title, description, date, published)
│   └── use.md          # "Uses" page content
├── prisma/
│   ├── schema.prisma   # Database models: User, Session, Account, Verification, Message, Playlist, Poem, Project, Photo
│   └── generated/      # Prisma Client output (gitignored)
├── public/
│   ├── fonts/          # Local font files (Audiowide)
│   ├── icons/          # Favicon
│   └── images/         # Static images
├── src/
│   ├── app/            # Next.js App Router
│   │   ├── layout.tsx           # Root layout: ThemeProvider, TooltipProvider, Toaster, fonts, i18n lang
│   │   ├── (site)/              # Public pages (route group)
│   │   │   ├── layout.tsx       # Site layout: Header, Footer, Background art
│   │   │   ├── page.tsx         # Home
│   │   │   ├── blog/            # Blog list + [slug] detail
│   │   │   ├── project/         # Project showcase
│   │   │   ├── message/         # Message board
│   │   │   ├── about/           # About page
│   │   │   ├── photos/          # Photo gallery
│   │   │   ├── poems/           # Poems page
│   │   │   └── use/             # Uses page
│   │   ├── admin/               # Admin dashboard (auth-guarded at layout level)
│   │   │   ├── layout.tsx       # Sidebar layout, redirects to /auth if no session
│   │   │   ├── page.tsx         # Dashboard overview
│   │   │   ├── messages/        # Manage messages
│   │   │   ├── projects/        # Manage projects
│   │   │   ├── playlist/        # Manage playlist
│   │   │   ├── poems/           # Manage poems
│   │   │   ├── photos/          # Manage photos
│   │   │   └── users/           # Manage users
│   │   ├── auth/                # Auth page (OAuth sign-in)
│   │   ├── actions/             # Server Actions (messages, photos, playlist, poems, projects, users)
│   │   ├── api/auth/[...all]/   # better-auth API catch-all route
│   │   └── feed.xml/            # RSS feed (route handler)
│   ├── components/
│   │   ├── ui/                  # shadcn/ui primitives (do not manually edit)
│   │   ├── DataTable/           # Generic table with sorting, pagination, drag-sort, expand
│   │   ├── Form/                # Schema-driven form builder (Zod + react-hook-form)
│   │   ├── Modal/               # Reusable modal dialog
│   │   ├── Confirm/             # Confirm dialog
│   │   └── Animated/            # Framer Motion wrapper with preset configs
│   ├── views/                   # Page-specific view components (one folder per page)
│   ├── layouts/                 # Layout components: Header, Footer, Navbar, MobileNav, Logo, Background (ArtPlum/ArtSnow), admin sidebar
│   ├── icons/                   # Custom SVG icon components with interactive wrapper
│   ├── hooks/                   # Custom hooks: useAuthModal (re-export), useBoop, useIsMobile, useThemeToggle, usePrefersReducedMotion
│   ├── stores/                  # Zustand stores (auth modal state)
│   ├── db/                      # Database access layer — class-based Db wrappers around Prisma
│   ├── lib/                     # Core utilities
│   │   ├── auth.ts              # better-auth config, getSession(), checkAdmin()
│   │   ├── auth-client.ts       # Client-side auth (signIn, signOut, useSession)
│   │   ├── prisma.ts            # Prisma Client singleton (PrismaPg adapter)
│   │   ├── posts.ts             # MDX post loading (getAllPosts, getPostsBySlug, extractHeadings)
│   │   ├── schemas.ts           # Zod validation schemas (poem, project, song, photo)
│   │   ├── action.ts            # Server Action result helpers (actionSuccess / actionError)
│   │   ├── rss.ts               # RSS feed generation (feed library)
│   │   ├── font.ts              # Font definitions (Roboto Mono, Audiowide)
│   │   ├── date.ts              # relativeTime() with i18n support
│   │   ├── math.ts              # Math utilities (clamp, range, roundTo, randomList)
│   │   └── utils.ts             # cn() (clsx + tailwind-merge), capitalize()
│   ├── i18n/                    # Internationalization setup
│   │   ├── settings.ts          # Languages (en, zh), namespaces, constants
│   │   ├── server.ts            # getT() for Server Components (header-based lang detection)
│   │   └── client.ts            # Client-side i18next init (browser detector + cookie)
│   ├── locales/                 # Translation JSON files: {en,zh}/{common,home,about,blog,...}.json
│   ├── styles/
│   │   ├── global.css           # Tailwind imports, font-face declarations, theme tokens (light/dark), custom utilities
│   │   └── markdown.css         # Blog post markdown styles
│   ├── types/                   # TypeScript types and declarations
│   │   ├── app.d.ts             # ActionResult, TocItem, MotionOptions types
│   │   ├── helper.d.ts          # Utility types (DeepPartial, Nullable, Recordable, etc.)
│   │   ├── i18next.d.ts         # i18next type augmentation for typed translations
│   │   └── {message,photo,playlist,poem,posts,project}.ts  # Domain model types
│   └── constants.ts             # NAVIGATION_ITEMS, AUTHOR_INFO, SOCIAL_URLS, SPRINGS, STAGGER, GALLERYS
├── next.config.ts               # React Compiler enabled, remote image patterns, RSS rewrites
├── tsconfig.json                # Path aliases: @/* → ./src/*, ~/* → ./*
├── eslint.config.js             # @king-3/eslint-config (typescript + nextjs)
├── prettier.config.js           # @king-3/prettier-config + oxc + tailwindcss plugins
├── stylelint.config.mjs         # Standard + recess-order, Tailwind directives allowed
├── postcss.config.js            # @tailwindcss/postcss + autoprefixer
├── components.json              # shadcn/ui config (base-nova, rsc: true, zinc)
└── prisma.config.ts             # Prisma config with DIRECT_URL datasource
```

## Development Setup

1. Copy `.env.example` to `.env` and fill in the values:
   - `DATABASE_URL` / `DIRECT_URL` — PostgreSQL connection strings (Neon recommended)
   - `BETTER_AUTH_SECRET` — generate with `openssl rand -base64 32`
   - `BETTER_AUTH_URL` — app URL
   - `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — GitHub OAuth app
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth app
   - `SITE_URL` — deployed site URL

2. Install dependencies and set up the database:

   ```bash
   pnpm install
   pnpm db:generate   # Generate Prisma Client
   pnpm db:push       # Push schema to database
   ```

3. Start the dev server:
   ```bash
   pnpm dev           # http://localhost:3060
   ```

## Build & Commands

| Command              | Description                                        |
| -------------------- | -------------------------------------------------- |
| `pnpm dev`           | Start dev server on port 3060                      |
| `pnpm build`         | Production build (`prisma generate && next build`) |
| `pnpm start`         | Start production server on port 3080               |
| `pnpm lint`          | Run ESLint                                         |
| `pnpm lint:fix`      | Run ESLint with auto-fix                           |
| `pnpm stylelint`     | Run Stylelint on CSS files                         |
| `pnpm stylelint:fix` | Run Stylelint with auto-fix                        |
| `pnpm format`        | Format all files with Prettier                     |
| `pnpm db:generate`   | Regenerate Prisma Client from schema               |
| `pnpm db:push`       | Push Prisma schema changes to database             |

## Code Conventions

- **Language**: All code comments, JSDoc, and section headers must be in **English**. Do not use Chinese in source code.
- **Path aliases**: Use `@/*` for `src/*` imports and `~/*` for project root imports.
- **UI primitives**: shadcn/ui components live in `src/components/ui/` — do not manually edit these files; use `npx shadcn add <component>` to add new ones.
- **Class merging**: Always use `cn()` from `@/lib/utils` to merge Tailwind classes (wraps `clsx` + `tailwind-merge`).
- **Server Actions pattern**: All server actions in `src/app/actions/` follow the same structure:
  - Wrap logic in `try/catch`
  - Return `actionSuccess(data)` on success, `actionError(error)` on failure
  - Call `revalidatePath()` after mutations
  - Use `checkAdmin()` for admin-only operations, `getSession()` for auth checks
- **Database access**: Never call Prisma directly from actions or pages. Use the class-based Db layer in `src/db/` (e.g., `messageDb`, `projectDb`, `playlistDb`). Each Db class has a private `serialize()` method that converts Date fields to ISO strings.
- **Form validation**: Define Zod schemas in `src/lib/schemas.ts`. Use the `<Form>` component from `src/components/Form/` which integrates react-hook-form + Zod resolver automatically.
- **View components**: Page-specific logic goes in `src/views/{pageName}/`. Each folder has an `index.ts` barrel export. App Router page files (`page.tsx`) should be thin — fetch data and delegate to view components.
- **i18n**: Server Components use `getT(namespace)` from `src/i18n/server.ts`. Client Components use `useTranslation` from `src/i18n/client.ts`. Translation files are in `src/locales/{en,zh}/{namespace}.json`. When adding a new namespace, also update `src/i18n/settings.ts` (NAMESPACES array) and `src/types/i18next.d.ts`.
- **Type definitions**: Domain model types go in `src/types/{model}.ts` with barrel export from `src/types/index.ts`. Prisma-generated types are aliased as `PrismaXxx` alongside serialized `Xxx` types.
- **Animations**: Use the `<Animated>` component from `src/components/Animated/` with preset configs or custom Framer Motion options. Respect `usePrefersReducedMotion` for accessibility.

## Architecture Notes

### Data Flow

```
page.tsx (RSC) → Server Action / db layer → Prisma → PostgreSQL
                         ↓
              view component (client or server)
```

- **Pages** are async React Server Components that fetch data via server actions or the db layer directly, then render view components.
- **Server Actions** (`src/app/actions/`) handle mutations. They validate auth, call the db layer, revalidate paths, and return `ActionResult<T>` (`{ success, data }` or `{ success, error }`).
- **Db layer** (`src/db/`) wraps Prisma queries in class instances. Each class serializes Prisma output (Date → ISO string) so types are JSON-safe for client components.

### Auth Flow

- **Server**: `getSession()` reads the session from request headers via better-auth. `checkAdmin()` additionally verifies `role === 'admin'`.
- **Client**: `authClient` from `src/lib/auth-client.ts` provides `signIn`, `signOut`, `useSession`. The auth modal state is managed by Zustand (`useAuthModal`).
- **Admin guard**: `src/app/admin/layout.tsx` calls `getSession()` and redirects to `/auth` if no session.
- **API route**: `src/app/api/auth/[...all]/route.ts` delegates to better-auth's `toNextJsHandler`.

### Blog System

- Posts are `.mdx` files in `content/posts/` with front matter fields: `title`, `description`, `date`, `published`.
- `getAllPosts()` scans the directory with fast-glob, filters `published !== false`, sorts by date descending.
- `getPostsBySlug()` reads a single post, returns metadata + raw MDX content.
- `extractHeadings()` parses heading elements from MDX content for table of contents.
- Posts are rendered via `next-mdx-remote` with rehype-pretty-code (shiki) for syntax highlighting.

### i18n System

- Two languages: `en` (fallback), `zh`.
- Server-side: Language is read from `x-i18n-lang` request header, falling back to `en`.
- Client-side: Detected via cookie (`i18n_lang`) → browser navigator, cached in cookie.
- Typed translations: `src/types/i18next.d.ts` augments i18next so `t()` calls are type-checked against the English JSON files.

### Theming

- Dark mode by default, managed by `next-themes` with `attribute="class"`.
- Theme tokens defined as CSS custom properties in `src/styles/global.css` using `oklch` color space.
- Font stack: Wotfard (body), Roboto Mono (monospace), Audiowide (logo), FiraCode (code blocks), PingFang SC (Chinese fallback).

## Adding New Features

### New Page

1. Create `src/app/(site)/{name}/page.tsx` — keep it thin (data fetching only).
2. Create `src/views/{name}/` with view components and `index.ts` barrel export.
3. Add translation files: `src/locales/en/{name}.json` and `src/locales/zh/{name}.json`.
4. Add namespace to `NAMESPACES` in `src/i18n/settings.ts` and `src/types/i18next.d.ts`.
5. Add navigation entry in `src/constants.ts` (`NAVIGATION_ITEMS`) if needed.

### New Database Entity

1. Add model to `prisma/schema.prisma`.
2. Run `pnpm db:generate` and `pnpm db:push`.
3. Create type definitions in `src/types/{model}.ts`, export from `src/types/index.ts`.
4. Create Db class in `src/db/{model}.ts` with `serialize()` method, export from `src/db/index.ts`.
5. Add Zod schema in `src/lib/schemas.ts`.
6. Create server actions in `src/app/actions/{model}.ts`.
7. Create admin page in `src/app/admin/{model}/page.tsx` with corresponding view in `src/views/admin/`.

### New shadcn/ui Component

```bash
npx shadcn@latest add <component>
```

Components are installed to `src/components/ui/`. Do not manually modify these files.

## Things to Avoid

- **Do not import Prisma directly** in page files or actions — always go through the `src/db/` layer.
- **Do not manually edit** files in `src/components/ui/` — they are managed by shadcn CLI.
- **Do not hardcode strings** that should be translated — use the i18n system.
- **Do not use Chinese** in code comments, JSDoc, or section headers — English only in source code.
- **Do not skip auth checks** in admin actions — always call `checkAdmin()` before mutations.
- **Do not create page-specific logic** in `src/app/` page files — delegate to `src/views/` components.
- **Do not use `className` strings directly** for conditional classes — use `cn()` from `@/lib/utils`.
- **Do not commit `.env` files** — only `.env.example` is tracked.
- **Do not commit `prisma/generated/`** — it is gitignored and regenerated via `pnpm db:generate`.
