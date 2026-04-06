# 响应式布局重构方案 — Home + Header/Footer

## Context

移动端（<768px）存在严重的布局溢出问题：

1. Header 两个独立胶囊卡在小屏上右卡被裁切
2. Hero 区的 Typewriter `<Storyteller/>` 文字溢出屏幕
3. Hero 社交图标占用大量空间
4. 音乐侧边栏在移动端被推到页面底部无意义
5. Gallery 滚动条在移动端可见

目标：重构 Header/Footer/Home 的响应式布局，断点 `md:` (768px)，移动端不溢出、体验完整。

## 需求确认（访谈结论）

| 项目            | 决策                                             |
| --------------- | ------------------------------------------------ |
| Header 移动端   | 两个胶囊 → 合并为一个占满宽度的胶囊              |
| Header 桌面端   | 保持现有两个胶囊设计                             |
| Header 滚动效果 | 保留 sticky→fixed 过渡 + CSS 变量驱动            |
| 搜索图标        | 移动端移入汉堡侧边栏                             |
| Logo            | 移动端隐藏 LogoIcon，只保留 "King3" 文字         |
| Typewriter      | 移动端缩小字号 + 换短文本：`<Dev/>` / `<Story/>` |
| 社交图标        | 保留在 Hero 区，移动端和桌面端都显示             |
| 音乐侧边栏      | 移动端隐藏                                       |
| Gallery 滚动条  | 移动端隐藏滚动条                                 |
| Footer          | 不变，保持现有简洁设计                           |
| 范围            | 先解决 Home + Header/Footer                      |

## 改动清单

### 1. Header.tsx — 移动端合并为单胶囊

**文件**：`src/layouts/Header.tsx`

**当前结构**：

```
<div justify-between>
  <div 胶囊A> 汉堡 | Logo | 分隔线 | Navbar </div>
  <div flex-1 justify-end>
    <div 胶囊B> Search | Avatar | Theme | Feed </div>
  </div>
</div>
```

**改造后结构**：

```
{/* 移动端：单胶囊占满 */}
<div md:hidden 胶囊 w-full justify-between>
  <div> 汉堡 | LogoIcon </div>
  <div> Avatar | Theme </div>
</div>

{/* 桌面端：保持原有双胶囊 */}
<div hidden md:flex justify-between>
  <div 胶囊A> Logo | 分隔线 | Navbar </div>
  <div>
    <div 胶囊B> Search | Avatar | Theme | Feed </div>
  </div>
</div>
```

关键点：

- 移动端隐藏 Search 图标（移入 MobileNav）
- 移动端隐藏 Feed 图标（已在 MobileNav）
- 移动端隐藏 Logo 文字 "King3"，只保留 LogoIcon
- 移动端胶囊加 `w-full` 占满容器
- `headerGlassCardClass` 复用不变
- sticky→fixed 的 CSS 变量逻辑完全保留，只改内部结构

### 2. Logo.tsx — 移动端隐藏图标，保留文字

**文件**：`src/layouts/Logo.tsx`

移动端：隐藏 LogoIcon，只显示 "King3" 文字（与汉堡图标紧邻）
桌面端：保持 LogoIcon + "King3" 文字

```tsx
// LogoIcon 容器
<span className="... hidden md:inline-flex">
  <LogoIcon ... />
</span>

// King3 文字保持不变
<span className="font-logo ml-1 text-xl font-normal">King3</span>
```

### 3. MobileNav.tsx — 加入搜索图标

**文件**：`src/layouts/MobileNav.tsx`

在侧边栏 SheetFooter 区域加入 Search 图标（和 RSS Feed 一起）：

```tsx
<SheetFooter className="flex-row items-center gap-1 border-t px-4">
  <Search />
  <Feed href="/feed.xml" target="_blank" rel="noopener noreferrer" />
  <span className="text-muted-foreground text-sm">RSS Feed</span>
</SheetFooter>
```

注意：Search 图标当前是从 `@/icons` 导入的交互式图标，需要确认它在侧边栏中是否需要调整行为（如点击跳转搜索页）。

### 4. Hero.tsx — Typewriter 响应式 + 社交图标隐藏

**文件**：`src/views/home/Hero.tsx`

#### 4a. Typewriter 传入响应式文本

Hero.tsx 中改为根据屏幕尺寸传不同文本。由于 Hero 是服务端组件，需要把响应式逻辑放在 Typewriter 客户端组件内：

```tsx
// Hero.tsx - 传入完整版和简短版
<Typewriter
  text1="<Developer/>"
  text2="<Storyteller/>"
  shortText1="<Dev/>"
  shortText2="<Story/>"
/>
```

#### 4b. Typewriter.tsx 响应式

**文件**：`src/views/home/Typewriter.tsx`

- 新增 `shortText1` / `shortText2` props
- 用 `useState` + `useEffect` 监听 `matchMedia('(min-width: 768px)')` 判断当前断点
- 移动端使用短文本，桌面端使用完整文本
- 字号：`text-5xl` → `text-3xl md:text-5xl`

```tsx
interface TypewriterProps {
  text1: string
  text2: string
  shortText1?: string
  shortText2?: string
  speed?: number
}

// 内部
const isMd = useMediaQuery('(min-width: 768px)')
const activeText1 = isMd ? text1 : (shortText1 ?? text1)
const activeText2 = isMd ? text2 : (shortText2 ?? text2)
```

注意：切换断点时需要重置 Typewriter 状态（currentIndex, displayText 等），否则会出现错位。用 `key={isMd ? 'md' : 'sm'}` 方式让 React 重新挂载最简单。

#### 4c. 社交图标 — 保持在 Hero 区显示

移动端和桌面端都显示社交图标，不再移到 Footer。保持现有代码不变。

### 5. Home.tsx — 隐藏移动端音乐侧边栏

**文件**：`src/views/home/Home.tsx`

```tsx
// 当前
<aside className="sticky h-fit w-full space-y-8 lg:top-8 lg:w-90">
  <FeaturedMusic songs={songs} />
</aside>

// 改为
<aside className="sticky hidden h-fit w-full space-y-8 md:block lg:top-8 lg:w-90">
  <FeaturedMusic songs={songs} />
</aside>
```

### 6. Gallery.tsx — 隐藏移动端滚动条

**文件**：`src/views/home/Gallery.tsx`

在 Gallery 容器上添加隐藏滚动条的 Tailwind class：

```tsx
// 当前
className =
  '-my-4 flex w-full snap-x snap-proximity scroll-pl-4 justify-start gap-4 overflow-x-auto px-4 py-4 sm:gap-6 md:justify-center md:overflow-x-hidden md:px-0'

// 改为（添加 scrollbar-none）
className =
  '-my-4 flex w-full snap-x snap-proximity scroll-pl-4 justify-start gap-4 overflow-x-auto scrollbar-none px-4 py-4 sm:gap-6 md:justify-center md:overflow-x-hidden md:px-0'
```

需确认 Tailwind 4 是否内置 `scrollbar-none`。如果没有，在 global.css 中添加：

```css
@utility scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
```

### 7. Footer.tsx — 不变

社交图标保留在 Hero 区，Footer 不需要添加社交图标。保持现有简洁设计。

---

## 响应式设计规范（Design Tokens）

以下规范适用于所有页面，后续改造 Blog、Project、Message、About 等页面时统一参照。

### 断点定义

| Token | 宽度    | 用途                   |
| ----- | ------- | ---------------------- |
| 默认  | 0–639px | 手机竖屏               |
| `sm:` | 640px+  | 手机横屏 / 小平板      |
| `md:` | 768px+  | 平板 / Header 切换断点 |
| `lg:` | 1024px+ | 桌面端                 |

### 容器

| Token       | 移动端                   | sm+       | 说明              |
| ----------- | ------------------------ | --------- | ----------------- |
| 页面容器    | `max-w-6xl mx-auto px-4` | `sm:px-8` | 所有页面统一      |
| Header 容器 | `max-w-6xl mx-auto px-4` | `sm:px-6` | Header 略窄       |
| 文本区约束  | `max-w-2xl`              | 同        | 页面标题/描述区域 |
| 长文本约束  | `max-w-3xl`              | 同        | Hero 描述等       |

### 字号（Typography Scale）

| 元素            | 移动端                                | sm (640px)        | md (768px)        | 字体                    |
| --------------- | ------------------------------------- | ----------------- | ----------------- | ----------------------- |
| 页面 h1 标题    | `text-4xl` (36px)                     | `text-5xl` (48px) | —                 | `font-mono font-medium` |
| Hero h1 标题    | `text-4xl` (36px)                     | `text-5xl` (48px) | `text-6xl` (60px) | `font-mono font-medium` |
| Hero Typewriter | `text-3xl` (30px)                     | —                 | `text-5xl` (48px) | `font-mono`             |
| Hero Tags       | `text-xl` (20px)                      | `text-2xl` (24px) | —                 | `font-medium`           |
| 区块标题 h2     | `text-lg` (18px)                      | —                 | —                 | `font-semibold`         |
| 卡片标题 h3     | `text-xl` (20px)                      | —                 | —                 | `font-semibold`         |
| 描述文本        | `text-lg` (18px)                      | —                 | —                 | `leading-relaxed`       |
| 正文            | `text-sm` (14px) ~ `text-base` (16px) | —                 | —                 | `leading-relaxed`       |
| 元信息          | `text-xs` (12px) ~ `text-sm` (14px)   | —                 | —                 | —                       |
| 标签 badge      | `text-xs` (12px)                      | —                 | —                 | `font-medium`           |

### 间距（Spacing Scale）

| 元素          | 移动端                    | sm/md+                  | 说明             |
| ------------- | ------------------------- | ----------------------- | ---------------- |
| 页面顶部      | `mt-16` (64px)            | `sm:mt-24` (96px)       | 所有页面统一     |
| Header→内容区 | `mt-12` ~ `mt-16`         | `sm:mt-16` ~ `sm:mt-20` | 标题到列表区间距 |
| Footer 上间距 | `mt-20` (80px)            | `sm:mt-32` (128px)      | —                |
| 标题→描述     | `mt-6` (24px)             | —                       | 所有页面统一     |
| 卡片内部      | `px-4 py-3` ~ `px-6 py-3` | —                       | 根据卡片大小     |
| 列表间距      | `space-y-6` ~ `space-y-8` | —                       | —                |

### 网格布局（Grid）

| 页面             | 移动端             | sm (640px) | lg (1024px) | 间距                |
| ---------------- | ------------------ | ---------- | ----------- | ------------------- |
| Blog 列表        | 1 列               | 2 列       | 2 列        | `gap-6 sm:gap-8`    |
| Project 列表     | 1 列               | 2 列       | 3 列        | `gap-x-12 gap-y-16` |
| About Explore    | 1 列               | 2 列       | 3 列        | `gap-4`             |
| Home 文章+侧边栏 | 1 列（侧边栏隐藏） | 1 列       | 2 列        | `gap-10`            |

### Header 规范

| 状态     | 移动端 (<md)           | 桌面端 (md+)             |
| -------- | ---------------------- | ------------------------ |
| 结构     | 单胶囊占满宽度         | 双胶囊 (左导航 + 右操作) |
| Logo     | 文字 "King3"（无图标） | 图标 + 文字 "King3"      |
| 导航     | 汉堡菜单侧边栏         | 内联 Navbar              |
| 搜索     | 侧边栏内               | 顶栏图标                 |
| Feed     | 侧边栏内               | 顶栏图标                 |
| 头像     | 顶栏图标               | 顶栏图标                 |
| 主题切换 | 顶栏图标               | 顶栏图标                 |
| 滚动效果 | sticky→fixed + 毛玻璃  | 同                       |

### 通用原则

1. **移动优先**：所有 class 默认写移动端样式，通过 `sm:/md:/lg:` 覆盖
2. **内容不溢出**：任何元素不得超出视口宽度，使用 `break-words` 处理长文本
3. **触摸目标**：交互元素最小 44x44px（WCAG 2.5.5）
4. **横向滚动**：仅 Gallery 区域允许，且隐藏滚动条
5. **body 保底**：`overflow-x-hidden` 始终存在（已在 global.css）
6. **动画预算**：首屏内容 <0.7s 可见，全部内容 <0.9s

---

## 不变的文件

| 文件                            | 原因                                       |
| ------------------------------- | ------------------------------------------ |
| `src/app/(site)/layout.tsx`     | 布局结构不变                               |
| `src/views/blog/Blog.tsx`       | 已在之前修复（grid-cols-1 sm:grid-cols-2） |
| `src/views/project/Project.tsx` | 响应式良好                                 |
| `src/layouts/Navbar.tsx`        | 只在桌面端显示，不需改动                   |
| `src/styles/global.css`         | 可能需要加 scrollbar-none utility          |

## 验证步骤

1. `pnpm dev` — 无编译错误
2. `pnpm lint` — 无 lint 错误
3. Chrome DevTools 模拟测试：
   - **375px (iPhone SE)**：Header 单胶囊占满不溢出，Logo 隐藏图标只显示 "King3" 文字，汉堡+文字+头像+主题切换
   - **375px Hero**：标题 text-4xl 不溢出，Typewriter `<Dev/>` / `<Story/>` 正常显示
   - **375px 社交图标**：Hero 区正常显示
   - **375px Gallery**：横向滚动无滚动条
   - **375px 音乐**：不显示
   - **768px+**：Header 恢复双胶囊，Navbar 展开，Typewriter 恢复完整文本
   - **1024px+**：音乐侧边栏出现在右侧
4. 测试汉堡菜单侧边栏：搜索图标应出现在 SheetFooter 区域
5. 测试滚动行为：Header sticky→fixed 过渡效果在两种模式下都正常
