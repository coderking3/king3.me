# king3.me

[English](./README.md)

一个基于 Next.js 16 构建的现代化个人网站和博客，支持双语界面、后台管理和丰富的内容管理功能。

## ✨ 特性

- 📝 **博客系统** — 基于 MDX，支持代码高亮、目录导航和 RSS 订阅
- 🎨 **项目展示** — 展示你的作品集，支持富媒体内容
- 💬 **留言板** — 访客互动留言功能
- 📸 **相册** — 精美的图片画廊，支持灯箱预览
- 🎵 **歌单与诗集** — 分享你喜欢的音乐和诗歌
- 🔍 **全局搜索** — 命令面板（⌘K）快速导航
- 🔐 **管理后台** — 完整的 CRUD 管理，支持 OAuth 认证（GitHub / Google）
- 🌍 **国际化** — 支持中英文双语
- 🌓 **深色模式** — 无缝主题切换
- ⚡ **性能优化** — React 19 + React Compiler

## 🛠️ 技术栈

| 层级     | 技术                                          |
| -------- | --------------------------------------------- |
| 框架     | Next.js 16, React 19, React Compiler          |
| 语言     | TypeScript（严格模式）                        |
| 样式     | Tailwind CSS v4, CSS Modules, PostCSS         |
| UI 组件  | shadcn/ui (base-nova 风格), Lucide 图标, cmdk |
| 动画     | Framer Motion, @react-spring/web              |
| 认证     | better-auth (GitHub + Google OAuth)           |
| 数据库   | PostgreSQL via Prisma ORM                     |
| 表单     | react-hook-form + Zod v4                      |
| 状态管理 | Zustand                                       |
| 国际化   | i18next, react-i18next                        |
| MDX      | next-mdx-remote, rehype-pretty-code, shiki    |
| 代码检查 | ESLint 9, Stylelint, Prettier                 |
| 包管理器 | pnpm                                          |
| 部署平台 | Vercel                                        |

## 📦 环境要求

- Node.js >= 20
- pnpm >= 9
- PostgreSQL 数据库（推荐使用 Neon）

## 🚀 快速开始

1. **克隆仓库**

   ```bash
   git clone https://github.com/coderking3/king3.me.git
   cd king3.me
   ```

2. **安装依赖**

   ```bash
   pnpm install
   ```

3. **配置环境变量**

   ```bash
   cp .env.example .env
   ```

   必需的环境变量：
   - `DATABASE_URL` / `DIRECT_URL` — PostgreSQL 连接字符串
   - `BETTER_AUTH_SECRET` — 使用 `openssl rand -base64 32` 生成
   - `BETTER_AUTH_URL` — 应用 URL（如 `http://localhost:3060`）
   - `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — GitHub OAuth 应用凭证
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth 应用凭证

4. **初始化数据库**

   ```bash
   pnpm db:generate   # 生成 Prisma Client
   pnpm db:push       # 推送数据库 schema
   ```

5. **启动开发服务器**

   ```bash
   pnpm dev
   ```

   在浏览器中打开 [http://localhost:3060](http://localhost:3060)。

## 📝 可用命令

| 命令                 | 说明                             |
| -------------------- | -------------------------------- |
| `pnpm dev`           | 启动开发服务器（端口 3060）      |
| `pnpm build`         | 生产环境构建                     |
| `pnpm start`         | 启动生产服务器（端口 3080）      |
| `pnpm lint`          | 运行 ESLint 检查                 |
| `pnpm lint:fix`      | 运行 ESLint 并自动修复           |
| `pnpm stylelint`     | 运行 Stylelint 检查 CSS 文件     |
| `pnpm stylelint:fix` | 运行 Stylelint 并自动修复        |
| `pnpm format`        | 使用 Prettier 格式化所有文件     |
| `pnpm db:generate`   | 从 schema 重新生成 Prisma Client |
| `pnpm db:push`       | 推送 Prisma schema 变更到数据库  |

## 📂 项目结��

```
├── content/          # MDX 博客文章和静态内容
├── prisma/           # 数据库 schema
├── public/           # 静态资源（字体、图标、图片）
├── src/
│   ├── app/          # Next.js App Router
│   │   ├── (site)/   # 公开页面
│   │   ├── admin/    # 管理后台
│   │   ├── actions/  # Server Actions
│   │   └── api/      # API 路由
│   ├── components/   # 可复用组件
│   ├── views/        # 页面视图组件
│   ├── layouts/      # 布局组件
│   ├── hooks/        # 自定义 React hooks
│   ├── stores/       # Zustand 状态管理
│   ├── db/           # 数据库访问层
│   ├── lib/          # 核心工具函数
│   ├── i18n/         # 国际化配置
│   ├── locales/      # 翻译文件（en / zh）
│   ├── styles/       # 全局样式
│   └── types/        # TypeScript 类型定义
└── ...
```

## 🖼️ 截图

<!-- TODO: 添加截图 -->
![首页](./docs/screenshots/home.png)
![博客](./docs/screenshots/blog.png)
![管理后台](./docs/screenshots/admin.png)

## 🌐 在线演示

[https://king3-me.vercel.app/](https://king3-me.vercel.app/)

## 📄 许可证

本项目采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 协议。

你可以自由地**共享**和**演绎**本作品，但须遵守**署名**、**非商业性使用**和**相同方式共享**的条件。
