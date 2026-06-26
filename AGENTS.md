<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Project Overview

**king3.me** — a personal website and blog built with Next.js 16 (App Router), React 19, and TypeScript. Features include: blog (MDX), project showcase, message board, photo gallery, poems, playlist, global search (command palette), an admin dashboard for CRUD management, OAuth login (GitHub / Google), i18n (en / zh), dark mode, and RSS feed.

## Tech Stack

| Layer           | Technology                                                                                                             |
| --------------- | --------------------------------------------------------------------------------------------------------------------- |
| Framework       | Next.js 16, React 19, React Compiler (Cache Components + root params)                                                 |
| Language        | TypeScript (strict mode)                                                                                              |
| Styling         | Tailwind CSS v4, CSS Modules, PostCSS, tw-animate-css, @tailwindcss/typography                                        |
| UI Components   | shadcn/ui (base-nova style, @base-ui/react primitives, zinc base color), Lucide icons, cmdk (command palette), sonner |
| Animation       | Framer Motion, @react-spring/web                                                                                      |
| Auth            | better-auth (GitHub + Google OAuth), @better-auth/infra                                                               |
| Database        | PostgreSQL via Drizzle ORM (@neondatabase/serverless, neon-http driver)                                               |
| Forms           | react-hook-form + @hookform/resolvers + Zod v4                                                                        |
| State           | Zustand                                                                                                               |
| i18n            | next-intl (locale-prefixed routing via root params)                                                                   |
| Tables          | @tanstack/react-table, @dnd-kit (drag-sort)                                                                           |
| MDX             | next-mdx-remote-client, gray-matter, @shikijs/rehype (shiki), remark-flexible-toc, rehype-slug, rehype-autolink-headings, remark-gfm |
| Utilities       | date-fns, react-day-picker, react-textarea-autosize, github-slugger, feed (RSS)                                       |
| Linting         | ESLint 10 (@king-3/eslint-config), Stylelint, Prettier (@king-3/prettier-config)                                      |
| Package Manager | pnpm                                                                                                                  |
| Hosting         | Vercel                                                                                                                |

## Development Setup

1. Copy `.env.example` to `.env` and fill in the values:
   - `DATABASE_URL` — PostgreSQL connection strings (Neon recommended)
   - `BETTER_AUTH_API_KEY` — API key for better-auth
   - `BETTER_AUTH_SECRET` — generate with `openssl rand -base64 32`
   - `BETTER_AUTH_URL` — app URL
   - `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — GitHub OAuth app
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth app
   - `SITE_URL` — deployed site URL

2. Install dependencies and set up the database:

   ```bash
   pnpm install
   pnpm db:generate   # Generate migration SQL files from schema
   pnpm db:push       # Push schema to database
   ```

3. Start the dev server:
   ```bash
   pnpm dev           # http://localhost:3060
   ```

## Build & Commands

| Command              | Description                                      |
| -------------------- | ------------------------------------------------ |
| `pnpm dev`           | Start dev server on port 3060                    |
| `pnpm build`         | Production build (`next build`)                  |
| `pnpm start`         | Start production server (`next start`)           |
| `pnpm lint`          | Run ESLint                                       |
| `pnpm lint:fix`      | Run ESLint with auto-fix                         |
| `pnpm typecheck`     | Run TypeScript type checking                     |
| `pnpm stylelint`     | Run Stylelint on CSS files                       |
| `pnpm stylelint:fix` | Run Stylelint with auto-fix                      |
| `pnpm format`        | Format all files with Prettier                   |
| `pnpm db:generate`   | Generate migration SQL files from schema changes |
| `pnpm db:migrate`    | Run pending migrations against the database      |
| `pnpm db:push`       | Push schema changes directly to database (dev)   |
| `pnpm db:studio`     | Open Drizzle Studio (visual database editor)     |
| `pnpm prepare`       | Install simple-git-hooks (runs automatically on install) |

## Code Conventions

- **Language**: All code comments, JSDoc, and section headers must be in **English**. Do not use Chinese in source code.
- **Path aliases**: Use `@/*` for `src/*` imports and `~/*` for project root imports.
- **UI primitives**: shadcn/ui components live in `src/components/ui/` — do not manually edit these files; use `npx shadcn add <component>` to add new ones.
- **Component organization**: Shared app components live in `src/components/common/`, layout components in `src/components/layout/`, icons in `src/components/icons/`, MDX components in `src/components/mdx/`, custom hooks in `src/hooks/`, Zustand stores in `src/stores/`, and route-specific UI in `src/views/`.
- **Class merging**: Always use `cn()` from `@/lib/utils` to merge Tailwind classes (wraps `clsx` + `tailwind-merge`).
- **Server Actions pattern**: All exported server actions in `src/app/actions/` use an `Action` suffix (for example, `createProjectAction`) and follow the same structure:
  - Wrap logic in `try/catch`
  - Check auth in the action (`requireServerAdminSession()` for admin mutations)
  - Validate inputs with Zod schemas from `@/validations/`
  - Call a DAL function from `src/data/`
  - Call the DAL-layer `invalidateXxx()` helper (which calls `updateTag()` from `next/cache`) after mutations — this is the only invalidation mechanism, used uniformly across all models including `users.ts`
  - Return `success(data)` on success, `failure(error)` on failure
- **Data access**: Never call the Drizzle `db` client directly from actions, pages, or client components. Use server-only DAL functions in `src/data/`. Read functions serialize Date fields to ISO strings before passing data to Client Components; write functions perform database mutations only and do not do auth checks.
- **Form validation**: Define Zod schemas in `src/lib/validations/{domain}.ts`. Use the `<Form>` component from `src/components/common/Form/` which integrates react-hook-form + Zod resolver automatically.
- **View components**: Page-specific logic goes in `src/views/{pageName}/`. Each folder has an `index.ts` barrel export. App Router page files (`page.tsx`) should be thin — fetch data and delegate to view components.
- **i18n**: Server Components use `getTranslations()` / `getLocale()` from `next-intl/server`. Client Components use `useTranslations()` / `useLocale()` from `next-intl` (the `NextIntlClientProvider` is mounted in `src/app/[locale]/layout.tsx`). Locale-aware navigation (`Link`, `useRouter`, `usePathname`, `redirect`) comes from `src/i18n/navigation.ts`. Translations are consolidated in `messages/{en,zh}.json`; types are derived automatically via `src/types/next-intl.d.ts`.
- **Type definitions**: Shared app/helper types live in `src/types/`; serialized domain/API types (derived from `typeof table.$inferSelect`, with `Date` fields `Omit`-ed and re-added as `string`) are grouped in `src/types/data.d.ts` and exported from `src/types/index.ts`.
- **Animations**: Use the `Animated` component from `src/components/common/Animated/` for standardized reveal/enter/exit transitions (for example, simple fade or slide-in effects). Use Framer Motion primitives directly (`motion.div`, `motion.h1`, etc.) for complex interactions, variants, layout animations, or animations requiring fine-grained control. Always respect reduced-motion accessibility.

## Architecture Notes

### Data Flow

```
page.tsx (RSC) → src/data read function → Drizzle → PostgreSQL
                         ↓
              view component (client or server)

client view → Server Action → src/data write function → Drizzle → PostgreSQL
```

- **Pages** are async React Server Components that fetch data via `src/data/` read functions, then render view components.
- **Server Actions** (`src/app/actions/`) handle mutations only. They validate auth and input, call `src/data/` write functions, invalidate cached reads via the DAL-layer `invalidateXxx()` helpers, and return `ResponseResult<T>` via `success()` / `failure()`.
- **DAL functions** (`src/data/`) are server-only. Reads are async functions marked with the `'use cache'` directive (Next.js 16 Cache Components, enabled via `cacheComponents: true` in `next.config.ts`) and use `cacheLife()` / `cacheTag()` from `next/cache`; they must return JSON-safe data for Client Components (Date fields serialized to ISO strings). Invalidation goes through per-model `invalidateXxx()` helpers that call `updateTag()`. Writes may call the Drizzle `db` client or better-auth APIs but must not perform auth checks; authorization stays in Server Actions or protected layouts.
- **Route Handlers** are used for HTTP-style endpoints such as `/api/search` and auth callbacks. Do not use Route Handlers for UI mutations when a Server Action fits better.

### Auth Flow

- **Server**: `getServerSession()` (in `src/lib/auth-session.ts`) reads the session from request headers via better-auth. `requireServerSession()` redirects unauthenticated users to `/auth`; `requireServerAdminSession()` verifies `role === 'admin'` (the `ADMIN_USER_ROLE` constant and `auth` instance live in `src/lib/auth.ts`).
- **Client**: `authClient` from `src/lib/auth-client.ts` provides `signIn`, `signUp`, `signOut`, `useSession`. The auth modal state is managed by the Zustand store `useAuthStore` in `src/stores/auth.ts`.
- **Admin guard**: `src/app/[locale]/admin/layout.tsx` calls `requireServerAdminSession()`. The proxy (`src/proxy.ts`) also intercepts `/admin` and `/zh/admin` requests and redirects non-admin users to `/`.
- **Proxy extra duties**: `src/proxy.ts` delegates locale detection and prefix handling to `createMiddleware(routing)` from `next-intl/middleware` (`localePrefix: 'as-needed'`), and redirects already-signed-in users away from `/auth` (and `/zh/auth`).
- **API route**: `src/app/api/auth/[...all]/route.ts` delegates to better-auth's `toNextJsHandler`.

### Blog System

- Posts are `.mdx` files in `content/posts/` with front matter fields: `title`, `description`, `date`, `published` (optional `author`, defaults to the site author).
- Content helpers live in `src/lib/content/`.
- `getAllPosts()` scans the directory with fast-glob, filters out drafts (`published === false`) and entries missing required front matter, and sorts by date descending. It is a `'use cache'` function tagged `all-posts`.
- `getPostsBySlug()` reads a single post, returns metadata + raw MDX content (a `'use cache'` function tagged `post-{slug}`).
- Posts are rendered via `next-mdx-remote-client/rsc` (`evaluate`) in `src/components/mdx/evaluate.ts` — the `evaluateMdx()` function is a `'use cache'` function returning `{ mdx, toc }`. Syntax highlighting uses `@shikijs/rehype` (shiki, catppuccin themes) with `@shikijs/transformers` + `@shikijs/colorized-brackets`; the table of contents is extracted with `remark-flexible-toc`; plus `rehype-slug`, `rehype-autolink-headings`, and `remark-gfm`.

### i18n System

- Two languages: `en` (default), `zh`. Routing is defined in `src/i18n/routing.ts` via `defineRouting` with `localePrefix: 'as-needed'` (the default locale `en` has no URL prefix; `zh` uses `/zh/...`).
- All routes live under `src/app/[locale]/`. `generateStaticParams` returns the locales; `next.config.ts` enables `experimental.rootParams: true` and `cacheComponents: true`.
- Server-side: `getTranslations()` / `getLocale()` from `next-intl/server`. The request config (`src/i18n/request.ts`) uses `getRequestConfig` and resolves the locale via `next/root-params` (`rootParams.locale()`).
- Client-side: `NextIntlClientProvider` is mounted in `src/app/[locale]/layout.tsx`; components use `useTranslations()` / `useLocale()` from `next-intl`. Locale-aware `Link`, `useRouter`, `usePathname`, and `redirect` come from `src/i18n/navigation.ts` (`createNavigation(routing)`) — use these instead of `next/link` / `next/navigation`.
- Middleware: `src/proxy.ts` delegates locale detection and prefix handling to `createMiddleware(routing)` from `next-intl/middleware`.
- Messages: consolidated in `messages/en.json` and `messages/zh.json` (top-level namespaces). Interpolation uses next-intl `{x}` syntax.
- Typed translations: `src/types/next-intl.d.ts` augments `next-intl`'s `AppConfig` (`Locale`, `Messages`) from `messages/en.json`, so `t()` calls are type-checked.

### Theming

- Dark mode by default, managed by `next-themes` with `attribute="class"`.
- Theme tokens defined as CSS custom properties in `src/styles/variables.css` (imported by `src/styles/global.css`) using the `oklch` color space.
- Font stack: Wotfard (body), Roboto Mono (monospace), Audiowide (logo), FiraCode (code blocks), PingFang SC (Chinese fallback).

## Adding New Features

### New Page

1. Create `src/app/[locale]/(site)/{name}/page.tsx` — keep it thin (data fetching only).
2. Create `src/views/{name}/` with view components and `index.ts` barrel export.
3. Add translations under a new top-level key in `messages/en.json` and `messages/zh.json`.
4. Types update automatically from `messages/en.json` via `src/types/next-intl.d.ts` — no manual step needed.
5. Add navigation entry in `src/constants/nav.ts` if needed.

### New Database Entity

1. Add table definition to `src/lib/db/schema.ts` using `pgTable()`.
2. Run `pnpm db:generate` to generate the migration SQL, then `pnpm db:migrate` to apply it (or `pnpm db:push` during development).
3. Add serialized domain/API types in `src/types/data.d.ts` using `Omit<typeof table.$inferSelect, ...Date fields> & { ...: string }` when the model crosses the RSC/client boundary; export them from `src/types/index.ts`.
4. Add read and write DAL functions in `src/data/{model}.ts`; mark reads with `'use cache'` + `cacheLife()` / `cacheTag()`, serialize Date fields to ISO strings, and add an `invalidateXxx()` helper that calls `updateTag()`.
5. Add Zod schemas in `src/lib/validations/{model}.ts`.
6. Create server actions in `src/app/actions/{model}.ts` with exported names ending in `Action`; call `invalidateXxx()` after mutations.
7. Create admin page in `src/app/[locale]/admin/{model}/page.tsx` with corresponding view in `src/views/admin/`.

### New shadcn/ui Component

```bash
npx shadcn@latest add <component>
```

Components are installed to `src/components/ui/`. Do not manually modify these files.

## Things to Avoid

- **Do not import the `db` client directly** in page files, actions, or client components — always go through `src/data/`.
- **Do not manually edit** files in `src/components/ui/` — they are managed by shadcn CLI.
- **Do not hardcode strings** that should be translated — use the i18n system.
- **Do not use Chinese** in code comments, JSDoc, or section headers — English only in source code.
- **Do not skip auth checks** in admin actions — always call `requireServerAdminSession()` before mutations.
- **Do not move auth checks into DAL write functions** — keep authorization in Server Actions, layouts, proxy, or route handlers.
- **Do not create page-specific logic** in `src/app/` page files — delegate to `src/views/` components.
- **Do not use `className` strings directly** for conditional classes — use `cn()` from `@/lib/utils`.
- **Do not use `unstable_cache` / `revalidateTag` / `revalidatePath` for DAL reads** — use the `'use cache'` directive with `cacheLife()` / `cacheTag()` and invalidate via the DAL `invalidateXxx()` helpers (`updateTag`).
- **Do not use `next/link` or `next/navigation` directly for in-app navigation** — use the locale-aware `Link` / `useRouter` / `usePathname` / `redirect` from `@/i18n/navigation`.
- **Do not commit `.env` files** — only `.env.example` is tracked.
