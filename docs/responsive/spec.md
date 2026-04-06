# 响应式设计规范

> 更新日期：2026-04-03
> 适用范围：前台 (site) 页面 + 全局 Header / Footer

---

## 断点定义

| Token | 宽度    | 用途                       |
| ----- | ------- | -------------------------- |
| 默认  | 0–639px | 手机竖屏                   |
| `sm:` | 640px+  | 手机横屏 / 小平板          |
| `md:` | 768px+  | 平板 / Header 布局切换断点 |
| `lg:` | 1024px+ | 桌面端                     |

所有样式采用**移动优先**写法：默认 class 为移动端样式，通过 `sm:` / `md:` / `lg:` 逐级覆盖。

---

## 容器规范

| 元素        | 移动端                   | sm+       | 说明                |
| ----------- | ------------------------ | --------- | ------------------- |
| 页面容器    | `max-w-6xl mx-auto px-4` | `sm:px-8` | 所有页面视图统一    |
| Header 容器 | `max-w-6xl mx-auto px-4` | `sm:px-6` | Header 内边距略窄   |
| 文本区约束  | `max-w-2xl`              | 同        | 页面标题 / 描述区域 |
| 长文本约束  | `max-w-3xl`              | 同        | Hero 描述等         |

---

## 字号规范（Typography Scale）

| 元素            | 移动端                  | sm (640px)           | md (768px)           | 附加样式                |
| --------------- | ----------------------- | -------------------- | -------------------- | ----------------------- |
| Hero h1 标题    | `text-4xl` (36px)       | `sm:text-5xl` (48px) | `md:text-6xl` (60px) | `font-mono font-medium` |
| 页面 h1 标题    | `text-4xl` (36px)       | `sm:text-5xl` (48px) | —                    | `font-mono font-medium` |
| Hero Typewriter | `text-3xl` (30px)       | —                    | `md:text-5xl` (48px) | `font-mono`             |
| Hero Tags       | `text-xl` (20px)        | `sm:text-2xl` (24px) | —                    | `font-medium`           |
| 区块标题 h2     | `text-lg` (18px)        | —                    | —                    | `font-semibold`         |
| 卡片标题 h3     | `text-xl` (20px)        | —                    | —                    | `font-semibold`         |
| 描述文本        | `text-lg` (18px)        | —                    | —                    | `leading-relaxed`       |
| 正文            | `text-sm` ~ `text-base` | —                    | —                    | `leading-relaxed`       |
| 元信息          | `text-xs` ~ `text-sm`   | —                    | —                    | —                       |
| 标签 badge      | `text-xs` (12px)        | —                    | —                    | `font-medium`           |

---

## 间距规范（Spacing Scale）

| 元素            | 移动端                    | sm/md+                  | 说明             |
| --------------- | ------------------------- | ----------------------- | ---------------- |
| 页面顶部        | `mt-16` (64px)            | `sm:mt-24` (96px)       | 所有页面统一     |
| Header → 内容区 | `mt-12` ~ `mt-16`         | `sm:mt-16` ~ `sm:mt-20` | 标题到列表区间距 |
| Footer 上间距   | `mt-20` (80px)            | `sm:mt-32` (128px)      | —                |
| 标题 → 描述     | `mt-6` (24px)             | —                       | 所有页面统一     |
| 卡片内部        | `px-4 py-3` ~ `px-6 py-3` | —                       | 根据卡片大小     |
| 列表间距        | `space-y-6` ~ `space-y-8` | —                       | —                |

---

## 网格布局（Grid）

| 页面               | 移动端             | sm (640px) | lg (1024px) | 间距                |
| ------------------ | ------------------ | ---------- | ----------- | ------------------- |
| Blog 列表          | 1 列               | 2 列       | 2 列        | `gap-6 sm:gap-8`    |
| Project 列表       | 1 列               | 2 列       | 3 列        | `gap-x-12 gap-y-16` |
| About Explore      | 1 列               | 2 列       | 3 列        | `gap-4`             |
| Home 文章 + 侧边栏 | 1 列（侧边栏隐藏） | 1 列       | 2 列        | `gap-10`            |

---

## Header 规范

| 属性       | 移动端 (<md)                  | 桌面端 (md+)                    |
| ---------- | ----------------------------- | ------------------------------- |
| 结构       | 单胶囊占满宽度                | 双胶囊（左导航 + 右操作）       |
| Logo       | 文字 "King3"（隐藏 LogoIcon） | 图标 + 文字 "King3"             |
| 导航       | 汉堡菜单打开侧边栏            | 内联 Navbar                     |
| 搜索       | 顶栏右侧图标                  | 顶栏右侧图标                    |
| Feed       | 隐藏，移入侧边栏底部          | 顶栏图标                        |
| 头像       | 顶栏右侧图标                  | 顶栏右侧图标                    |
| 主题切换   | 顶栏右侧图标                  | 顶栏右侧图标                    |
| 滚动效果   | sticky → fixed + 毛玻璃       | 同                              |
| 胶囊高度   | `h-11.5`                      | `h-11.5`                        |
| 胶囊内边距 | `px-1.5 sm:px-3`              | `pl-3 pr-0`（左）/ `px-3`（右） |

### 移动端单胶囊 DOM 结构

```
<div 胶囊 w-full justify-between md:hidden>
  <div> 汉堡菜单 + Logo(文字) </div>
  <div> Search + Avatar + ThemeMode </div>
</div>
```

### 桌面端双胶囊 DOM 结构

```
<div hidden md:flex justify-between>
  <div 胶囊A> Logo(图标+文字) + 分隔线 + Navbar </div>
  <div flex-1 justify-end>
    <div 胶囊B> Search + Avatar + ThemeMode + Feed </div>
  </div>
</div>
```

### 移动端侧边栏（MobileNav）

- 导航列表首位插入 Home (`/`) 菜单项
- SheetFooter 包含 FeedIcon + "RSS Feed" 可点击链接，跳转 `/feed.xml`

---

## Typewriter 响应式文本

| 属性     | 移动端 (<md)                    | 桌面端 (md+)         |
| -------- | ------------------------------- | -------------------- |
| 文本 1   | `<Dev/>`                        | `<Developer/>`       |
| 文本 2   | `<Story/>`                      | `<Storyteller/>`     |
| 字号     | `text-3xl` (30px)               | `md:text-5xl` (48px) |
| 断点检测 | `useIsMd()` hook (`matchMedia`) | —                    |
| 切换行为 | `key` 重新挂载，重置动画状态    | —                    |

---

## 可见性控制

| 元素                | 移动端 (<md)             | 桌面端 (md+)                     |
| ------------------- | ------------------------ | -------------------------------- |
| LogoIcon            | `hidden`                 | `md:inline-flex`                 |
| 音乐侧边栏          | `hidden`                 | `md:block`                       |
| Feed 图标（Header） | `hidden`（在侧边栏显示） | 显示                             |
| Gallery 滚动条      | `scrollbar-none`（隐藏） | `md:overflow-x-hidden`（无滚动） |

---

## 通用原则

1. **移动优先**：所有 class 默认写移动端样式，通过 `sm:` / `md:` / `lg:` 覆盖
2. **内容不溢出**：任何元素不得超出视口宽度，长文本使用 `break-words`
3. **触摸目标**：交互元素最小 44×44px（WCAG 2.5.5）
4. **横向滚动**：仅 Gallery 区域允许，且隐藏滚动条
5. **body 保底**：`overflow-x-hidden` 始终存在（已在 global.css）
6. **动画预算**：首屏内容 <0.7s 可见，全部内容 <0.9s
7. **DOM 拆分优于 CSS 隐藏**：Header 等结构差异大的组件，使用独立 DOM + `md:hidden` / `hidden md:flex` 切换，而非在同一 DOM 上堆叠大量条件 class
