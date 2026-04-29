<h1 align="center">king3.me</h1>

<p align="center"><a href="./README_zh.md">简体中文</a></p>

<p align="center">My personal website project</p>

<!-- ![home page picture](./public/images/home.png) -->

## 🛠️ Tech Stack

| Layer          | Technology                                 |
| -------------- | ------------------------------------------ |
| Framework      | Next.js 16, React 19, React Compiler       |
| Styling        | Tailwind CSS v4, CSS Modules, PostCSS      |
| UI Components  | shadcn/ui (base-nova style), Lucide icons  |
| Animation      | Framer Motion, @react-spring/web           |
| Database       | PostgreSQL (Neon)                          |
| ORM            | Prisma ORM                                 |
| Authentication | better-auth (GitHub + Google OAuth)        |
| i18n           | i18next, react-i18next                     |
| MDX            | next-mdx-remote, rehype-pretty-code, shiki |
| Deployment     | Vercel                                     |

## 📦 Prerequisites

- Node.js >= 20
- pnpm >= 9

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

## 📄 License

code is licensed under [MIT](./LICENSE),<br/>
words and images are licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
