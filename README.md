# king3.me

[中文版](./README_zh.md)

A modern personal website and blog built with Next.js 16, featuring a bilingual interface, admin dashboard, and rich content management capabilities.

## ✨ Features

- 📝 **Blog System** — MDX-powered blog with syntax highlighting, table of contents, and RSS feed
- 🎨 **Project Showcase** — Display your portfolio with rich media support
- 💬 **Message Board** — Interactive guestbook for visitors
- 📸 **Photo Gallery** — Beautiful image gallery with lightbox
- 🎵 **Playlist & Poems** — Share your favorite music and poetry
- 🔍 **Global Search** — Command palette (⌘K) for instant navigation
- 🔐 **Admin Dashboard** — Full CRUD management with OAuth authentication (GitHub / Google)
- 🌍 **i18n** — English and Chinese language support
- 🌓 **Dark Mode** — Seamless theme switching
- ⚡ **Performance** — React 19 with React Compiler optimization

## 🛠️ Tech Stack

| Layer           | Technology                                      |
| --------------- | ----------------------------------------------- |
| Framework       | Next.js 16, React 19, React Compiler            |
| Language        | TypeScript (strict mode)                        |
| Styling         | Tailwind CSS v4, CSS Modules, PostCSS           |
| UI Components   | shadcn/ui (base-nova style), Lucide icons, cmdk |
| Animation       | Framer Motion, @react-spring/web                |
| Auth            | better-auth (GitHub + Google OAuth)             |
| Database        | PostgreSQL via Prisma ORM                       |
| Forms           | react-hook-form + Zod v4                        |
| State           | Zustand                                         |
| i18n            | i18next, react-i18next                          |
| MDX             | next-mdx-remote, rehype-pretty-code, shiki      |
| Linting         | ESLint 9, Stylelint, Prettier                   |
| Package Manager | pnpm                                            |
| Hosting         | Vercel                                          |

## 📦 Prerequisites

- Node.js >= 20
- pnpm >= 9
- PostgreSQL database (Neon recommended)

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/coderking3/king3.me.git
   cd king3.me
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Required variables:
   - `DATABASE_URL` / `DIRECT_URL` — PostgreSQL connection strings
   - `BETTER_AUTH_SECRET` — Generate with `openssl rand -base64 32`
   - `BETTER_AUTH_URL` — Your app URL (e.g., `http://localhost:3060`)
   - `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — GitHub OAuth app credentials
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth app credentials

4. **Set up the database**

   ```bash
   pnpm db:generate   # Generate Prisma Client
   pnpm db:push       # Push schema to database
   ```

5. **Start the development server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3060](http://localhost:3060) in your browser.

## 📝 Available Scripts

| Command              | Description                            |
| -------------------- | -------------------------------------- |
| `pnpm dev`           | Start dev server on port 3060          |
| `pnpm build`         | Production build                       |
| `pnpm start`         | Start production server on port 3080   |
| `pnpm lint`          | Run ESLint                             |
| `pnpm lint:fix`      | Run ESLint with auto-fix               |
| `pnpm stylelint`     | Run Stylelint on CSS files             |
| `pnpm stylelint:fix` | Run Stylelint with auto-fix            |
| `pnpm format`        | Format all files with Prettier         |
| `pnpm db:generate`   | Regenerate Prisma Client from schema   |
| `pnpm db:push`       | Push Prisma schema changes to database |

## 📂 Project Structure

```
├── content/          # MDX blog posts and static content
├── prisma/           # Database schema
├── public/           # Static assets (fonts, icons, images)
├── src/
│   ├── app/          # Next.js App Router
│   │   ├── (site)/   # Public pages
│   │   ├── admin/    # Admin dashboard
│   │   ├── actions/  # Server Actions
│   │   └── api/      # API routes
│   ├── components/   # Reusable components
│   ├── views/        # Page-specific view components
│   ├── layouts/      # Layout components
│   ├── hooks/        # Custom React hooks
│   ├── stores/       # Zustand stores
│   ├── db/           # Database access layer
│   ├── lib/          # Core utilities
│   ├── i18n/         # Internationalization setup
│   ├── locales/      # Translation files (en / zh)
│   ├── styles/       # Global styles
│   └── types/        # TypeScript types
└── ...
```

## 🖼️ Screenshots

<!-- TODO: Add screenshots -->
![Homepage](./docs/screenshots/home.png)
![Blog](./docs/screenshots/blog.png)
![Admin Dashboard](./docs/screenshots/admin.png)

## 🌐 Live Demo

[https://king3-me.vercel.app/](https://king3-me.vercel.app/)

## 📄 License

This project is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
