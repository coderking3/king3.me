# king3.me

> This is a highly personalized personal blog.

# ⚙️ Tech Stack

- **Framework**: React + Next.js
- **Styling**: Tailwind CSS + Shadcn UI
- **Animations**: Framer Motion
- **Database**: Supabase
- **CMS**: Payload
- **Deployment**: Vercel

## Project Tree

```bash
tree -a -I "node_modules|.git|.next|tsconfig.tsbuildinfo|next-env.d.ts|.temp" --dirsfirst > tree.txt
```

```txt
king3.me
├── .vscode
│   └── settings.json
├── content
│   ├── posts
│   │   ├── ARCHITECTURE_REVIEW.mdx
│   │   ├── markdown-syntax-demo-zh.mdx
│   │   ├── markdown-syntax-demo.mdx
│   │   ├── nextjs-i18next-cookie-based.mdx
│   │   └── README-king3.me.mdx
│   └── use.md
├── prisma
│   ├── generated
│   │   ├── internal
│   │   │   ├── class.ts
│   │   │   ├── prismaNamespace.ts
│   │   │   └── prismaNamespaceBrowser.ts
│   │   ├── models
│   │   │   ├── Account.ts
│   │   │   ├── Message.ts
│   │   │   ├── Photo.ts
│   │   │   ├── Playlist.ts
│   │   │   ├── Poem.ts
│   │   │   ├── Project.ts
│   │   │   ├── Session.ts
│   │   │   ├── User.ts
│   │   │   └── Verification.ts
│   │   ├── browser.ts
│   │   ├── client.ts
│   │   ├── commonInputTypes.ts
│   │   ├── enums.ts
│   │   └── models.ts
│   └── schema.prisma
├── public
│   ├── fonts
│   │   └── Audiowide-King3.woff2
│   ├── icons
│   │   ├── favicon-bold.svg
│   │   └── favicon.svg
│   └── images
│       ├── avatar-old.png
│       └── avatar.png
├── src
│   ├── app
│   │   ├── (site)
│   │   │   ├── about
│   │   │   │   └── page.tsx
│   │   │   ├── blog
│   │   │   │   ├── [slug]
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── message
│   │   │   │   └── page.tsx
│   │   │   ├── photos
│   │   │   │   └── page.tsx
│   │   │   ├── poems
│   │   │   │   └── page.tsx
│   │   │   ├── project
│   │   │   │   └── page.tsx
│   │   │   ├── use
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── actions
│   │   │   ├── messages.ts
│   │   │   ├── photos.ts
│   │   │   ├── playlist.ts
│   │   │   ├── poems.ts
│   │   │   ├── projects.ts
│   │   │   └── users.ts
│   │   ├── admin
│   │   │   ├── messages
│   │   │   │   └── page.tsx
│   │   │   ├── photos
│   │   │   │   └── page.tsx
│   │   │   ├── playlist
│   │   │   │   └── page.tsx
│   │   │   ├── poems
│   │   │   │   └── page.tsx
│   │   │   ├── projects
│   │   │   │   └── page.tsx
│   │   │   ├── users
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── api
│   │   │   └── auth
│   │   │       └── [...all]
│   │   │           └── route.ts
│   │   ├── auth
│   │   │   └── page.tsx
│   │   ├── feed.xml
│   │   │   └── route.ts
│   │   ├── layout.tsx
│   │   └── not-found.tsx
│   ├── components
│   │   ├── Animated
│   │   │   ├── Animated.tsx
│   │   │   ├── index.ts
│   │   │   ├── presets.ts
│   │   │   └── types.ts
│   │   ├── Confirm
│   │   │   ├── Confirm.tsx
│   │   │   ├── index.ts
│   │   │   └── types.ts
│   │   ├── DataTable
│   │   │   ├── components
│   │   │   │   ├── index.ts
│   │   │   │   ├── TablePagination.tsx
│   │   │   │   ├── TableSortableHeader.tsx
│   │   │   │   ├── TableSortableRow.tsx
│   │   │   │   └── TableToolbar.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── index.ts
│   │   │   ├── types.ts
│   │   │   └── utils.tsx
│   │   ├── Form
│   │   │   ├── controls
│   │   │   │   ├── index.ts
│   │   │   │   ├── InputControl.tsx
│   │   │   │   ├── SelectControl.tsx
│   │   │   │   └── TextareaControl.tsx
│   │   │   ├── Form.tsx
│   │   │   ├── FormField.tsx
│   │   │   ├── index.ts
│   │   │   └── types.ts
│   │   ├── mdx
│   │   │   └── MdxLink.tsx
│   │   ├── Modal
│   │   │   ├── index.ts
│   │   │   ├── Modal.tsx
│   │   │   └── types.ts
│   │   ├── ui
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── field.tsx
│   │   │   ├── index.ts
│   │   │   ├── input-group.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── spinner.tsx
│   │   │   ├── table.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── tooltip.tsx
│   │   ├── index.ts
│   │   ├── LocaleSwitcher.tsx
│   │   └── ThemeMode.tsx
│   ├── db
│   │   ├── dashboard.ts
│   │   ├── index.ts
│   │   ├── messages.ts
│   │   ├── photos.ts
│   │   ├── playlist.ts
│   │   ├── poems.ts
│   │   └── projects.ts
│   ├── hooks
│   │   ├── index.ts
│   │   ├── useBoop.ts
│   │   ├── useIsMobile.ts
│   │   ├── usePrefersReducedMotion.ts
│   │   └── useThemeToggle.ts
│   ├── i18n
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── settings.ts
│   ├── icons
│   │   ├── _internal
│   │   │   ├── hooks.ts
│   │   │   ├── Interactive.tsx
│   │   │   ├── types.ts
│   │   │   └── utils.tsx
│   │   ├── Logo
│   │   │   ├── index.tsx
│   │   │   ├── style.module.css
│   │   │   └── utils.ts
│   │   ├── ArrowLeft.tsx
│   │   ├── ArrowRight.tsx
│   │   ├── Back.tsx
│   │   ├── BiliBili.tsx
│   │   ├── Browser.tsx
│   │   ├── Camera.tsx
│   │   ├── ChevronUp.tsx
│   │   ├── Email.tsx
│   │   ├── Equalizer.tsx
│   │   ├── ExternalLink.tsx
│   │   ├── Feather.tsx
│   │   ├── Feed.tsx
│   │   ├── Github.tsx
│   │   ├── Google.tsx
│   │   ├── index.ts
│   │   ├── Link.tsx
│   │   ├── NetEaseMusic.tsx
│   │   ├── Picture.tsx
│   │   ├── Search.module.css
│   │   ├── Search.tsx
│   │   ├── Serve.tsx
│   │   ├── SunMoon.module.css
│   │   ├── SunMoon.tsx
│   │   ├── X.tsx
│   │   └── Youtube.tsx
│   ├── layouts
│   │   ├── admin
│   │   │   ├── Header.tsx
│   │   │   ├── index.ts
│   │   │   └── Sidebar.tsx
│   │   ├── ArtPlum.tsx
│   │   ├── ArtSnow.tsx
│   │   ├── Background.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── index.ts
│   │   ├── Logo.tsx
│   │   ├── MobileNav.tsx
│   │   ├── Navbar.tsx
│   │   └── UserAvatar.tsx
│   ├── lib
│   │   ├── action.ts
│   │   ├── auth-client.ts
│   │   ├── auth.ts
│   │   ├── date.ts
│   │   ├── font.ts
│   │   ├── math.ts
│   │   ├── posts.ts
│   │   ├── prisma.ts
│   │   ├── rss.ts
│   │   ├── schemas.ts
│   │   └── utils.ts
│   ├── locales
│   │   ├── en
│   │   │   ├── about.json
│   │   │   ├── auth.json
│   │   │   ├── blog.json
│   │   │   ├── common.json
│   │   │   ├── home.json
│   │   │   ├── message.json
│   │   │   ├── photos.json
│   │   │   ├── poems.json
│   │   │   ├── project.json
│   │   │   └── use.json
│   │   └── zh
│   │       ├── about.json
│   │       ├── auth.json
│   │       ├── blog.json
│   │       ├── common.json
│   │       ├── home.json
│   │       ├── message.json
│   │       ├── photos.json
│   │       ├── poems.json
│   │       ├── project.json
│   │       └── use.json
│   ├── stores
│   │   ├── auth
│   │   │   ├── index.ts
│   │   │   └── modal.ts
│   │   └── index.ts
│   ├── styles
│   │   ├── global.css
│   │   └── markdown.css
│   ├── types
│   │   ├── app.d.ts
│   │   ├── helper.d.ts
│   │   ├── i18next.d.ts
│   │   ├── index.ts
│   │   ├── message.ts
│   │   ├── photo.ts
│   │   ├── playlist.ts
│   │   ├── poem.ts
│   │   ├── posts.ts
│   │   └── project.ts
│   ├── views
│   │   ├── about
│   │   │   ├── About.tsx
│   │   │   ├── AboutSocial.tsx
│   │   │   └── index.ts
│   │   ├── admin
│   │   │   ├── Dashboard.tsx
│   │   │   ├── index.ts
│   │   │   ├── Messages.tsx
│   │   │   ├── Photos.tsx
│   │   │   ├── Playlist.tsx
│   │   │   ├── Poems.tsx
│   │   │   ├── Projects.tsx
│   │   │   └── Users.tsx
│   │   ├── auth
│   │   │   ├── Auth.tsx
│   │   │   ├── AuthForm.tsx
│   │   │   ├── AuthModal.tsx
│   │   │   └── index.ts
│   │   ├── blog
│   │   │   ├── Blog.tsx
│   │   │   ├── index.ts
│   │   │   ├── Posts.tsx
│   │   │   ├── PostsActions.tsx
│   │   │   ├── PostsCard.tsx
│   │   │   ├── PostsFloatingBar.tsx
│   │   │   └── PostsTableOfContents.tsx
│   │   ├── home
│   │   │   ├── FeaturedMusic.tsx
│   │   │   ├── Gallery.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── index.ts
│   │   │   └── Typewriter.tsx
│   │   ├── message
│   │   │   ├── index.ts
│   │   │   ├── Message.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   └── MessageList.tsx
│   │   ├── photos
│   │   │   ├── index.ts
│   │   │   ├── PhotoPreview.tsx
│   │   │   └── Photos.tsx
│   │   ├── poems
│   │   │   ├── index.ts
│   │   │   └── Poems.tsx
│   │   ├── project
│   │   │   ├── index.ts
│   │   │   ├── Project.tsx
│   │   │   └── ProjectCard.tsx
│   │   ├── use
│   │   │   ├── index.ts
│   │   │   └── Use.tsx
│   │   └── .DS_Store
│   ├── .DS_Store
│   ├── constants.ts
│   └── proxy.ts
├── .env
├── .env.example
├── .env.local
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
├── components.json
├── env-local.crypto.txt
├── env.crypto.txt
├── eslint.config.js
├── global.d.ts
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── prettier.config.js
├── prisma.config.ts
├── README.md
├── stylelint.config.mjs
├── tree.txt
└── tsconfig.json

73 directories, 286 files
```
