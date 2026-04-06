# 布局响应式改动记录

> 更新日期：2026-04-03
> 范围：前台 (site) 页面 + 全局 Header / Footer

---

## 改动概览

| 文件                        | 改动项                | 移动端 (<md)                                            | 桌面端 (md+)                                |
| --------------------------- | --------------------- | ------------------------------------------------------- | ------------------------------------------- |
| `layouts/Header.tsx`        | 双胶囊 → 移动端单胶囊 | 单胶囊占满宽度，内部 justify-between 左右分布           | 保持双胶囊（左导航 + 右操作）               |
| `layouts/Header.tsx`        | 容器 padding          | `px-4` (16px)                                           | `sm:px-6` (24px)                            |
| `layouts/Header.tsx`        | Search 图标           | 保留在顶栏右侧                                          | 保留在顶栏右侧                              |
| `layouts/Header.tsx`        | Feed 图标             | 隐藏，移入侧边栏底部                                    | 顶栏显示                                    |
| `layouts/Logo.tsx`          | LogoIcon 可见性       | 隐藏图标，只显示 "King3" 文字                           | 图标 + 文字都显示                           |
| `layouts/MobileNav.tsx`     | 导航列表              | 新增 Home 菜单项（列表首位）                            | N/A（仅移动端组件）                         |
| `layouts/MobileNav.tsx`     | SheetFooter           | FeedIcon + "RSS Feed" 可点击跳转 `/feed.xml`            | N/A                                         |
| `layouts/Footer.tsx`        | 上间距                | `mt-20` (80px)                                          | `sm:mt-32` (128px)                          |
| `layouts/Footer.tsx`        | 容器 padding          | `px-4` (16px)                                           | `sm:px-8` (32px)                            |
| `views/home/Home.tsx`       | 页面顶部间距          | `mt-16` (64px)                                          | `sm:mt-24` (96px)                           |
| `views/home/Home.tsx`       | 容器 padding          | `px-4` (16px)                                           | `sm:px-8` (32px)                            |
| `views/home/Home.tsx`       | 文章区间距            | `mt-16` (64px)                                          | `sm:mt-24` / `md:mt-28`                     |
| `views/home/Home.tsx`       | 音乐侧边栏            | `hidden`（隐藏）                                        | `md:block`（显示）                          |
| `views/home/Hero.tsx`       | h1 标题字号           | `text-4xl` (36px)                                       | `sm:text-5xl` (48px) / `md:text-6xl` (60px) |
| `views/home/Hero.tsx`       | Tags 字号             | `text-xl` (20px)                                        | `sm:text-2xl` (24px)                        |
| `views/home/Hero.tsx`       | Typewriter 短文本     | 传入 `shortText1="<Dev/>"` `shortText2="<Story/>"`      | 使用完整文本                                |
| `views/home/Typewriter.tsx` | 字号                  | `text-3xl` (30px)                                       | `md:text-5xl` (48px)                        |
| `views/home/Typewriter.tsx` | 文本内容              | `<Dev/>` / `<Story/>`                                   | `<Developer/>` / `<Storyteller/>`           |
| `views/home/Typewriter.tsx` | 断点切换              | `useIsMd()` hook 监听 `matchMedia`，切换时 key 重新挂载 | —                                           |
| `views/home/Gallery.tsx`    | 滚动条                | `scrollbar-none`（隐藏）                                | `md:overflow-x-hidden`（无滚动）            |
| `views/blog/Blog.tsx`       | 页面顶部间距          | `mt-16` (64px)                                          | `sm:mt-24` (96px)                           |
| `views/blog/Blog.tsx`       | 容器 padding          | `px-4` (16px)                                           | `sm:px-8` (32px)                            |
| `views/blog/Blog.tsx`       | 网格列数              | `grid-cols-1` (1 列)                                    | `sm:grid-cols-2` (2 列)                     |
| `views/blog/Blog.tsx`       | 网格间距              | `gap-6` (24px)                                          | `sm:gap-8` (32px)                           |
| `views/project/Project.tsx` | 页面顶部间距          | `mt-16` (64px)                                          | `sm:mt-24` (96px)                           |
| `views/project/Project.tsx` | 容器 padding          | `px-4` (16px)                                           | `sm:px-8` (32px)                            |
| `views/message/Message.tsx` | 页面顶部间距          | `mt-16` (64px)                                          | `sm:mt-24` (96px)                           |
| `views/message/Message.tsx` | 容器 padding          | `px-4` (16px)                                           | `sm:px-8` (32px)                            |
| `views/about/About.tsx`     | 页面顶部间距          | `mt-16` (64px)                                          | `sm:mt-24` (96px)                           |
| `views/about/About.tsx`     | 容器 padding          | `px-4` (16px)                                           | `sm:px-8` (32px)                            |

---

## 各组件改动详情

### Header.tsx

**改动前**：移动端和桌面端使用同一套 DOM 结构，两个独立胶囊卡并排。小屏下右侧胶囊被裁切溢出。

**改动后**：拆分为两套 DOM，通过 `md:hidden` / `hidden md:flex` 切换：

- **移动端 (<md)**：单个胶囊容器 `w-full justify-between`
  - 左侧：汉堡菜单 + Logo（仅文字）
  - 右侧：Search + 头像 + 主题切换
- **桌面端 (md+)**：双胶囊布局
  - 左胶囊：Logo（图标+文字） + 分隔线 + Navbar 导航
  - 右胶囊：Search + 头像 + 主题切换 + Feed

sticky → fixed 的滚动过渡效果（CSS 变量驱动）保持不变。

### Logo.tsx

LogoIcon 容器添加 `hidden md:inline-flex`，移动端只显示 "King3" 文字，桌面端显示图标 + 文字。

### MobileNav.tsx

- 导航列表从 `NAVIGATION_ITEMS` 改为 `MOBILE_NAV_ITEMS`（在前面插入 `{ name: 'Home', href: '/' }`）
- SheetFooter 中 Feed 改为 `FeedIcon` + 可点击的 `<Link>` 跳转 `/feed.xml`

### Hero.tsx + Typewriter.tsx

- Hero h1 标题添加响应式字号：`text-4xl sm:text-5xl md:text-6xl`
- Tags 添加响应式字号：`text-xl sm:text-2xl`
- Typewriter 新增 `shortText1` / `shortText2` props
- Typewriter 内部通过 `useIsMd()` hook（`matchMedia`）判断断点，移动端使用短文本
- 断点切换时通过 `key` 重新挂载，重置动画状态
- 字号从 `text-5xl` 改为 `text-3xl md:text-5xl`

### Home.tsx

- 音乐侧边栏 `<aside>` 添加 `hidden md:block`，移动端完全隐藏
- 文章区间距改为 `mt-16 sm:mt-24 md:mt-28`

### Gallery.tsx

Gallery 滚动容器添加 `scrollbar-none`（Tailwind 4 内置），移动端横向滚动时不显示滚动条。

### 全局容器 padding

所有页面视图（Home、Blog、Project、Message、About）和 Footer 统一从 `px-8` 改为 `px-4 sm:px-8`，移动端每侧多出 16px 内容空间。

### 全局页面间距

所有页面顶部间距从 `mt-24` 改为 `mt-16 sm:mt-24`，Footer 从 `mt-32` 改为 `mt-20 sm:mt-32`。
