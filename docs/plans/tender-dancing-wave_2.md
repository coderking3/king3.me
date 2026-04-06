# 响应式改造方案 — Blog + Project 页面

## Context

Home + Header/Footer 的响应式改造已完成（见 `docs/responsive/`）。现在需要对 Blog 列表页、Blog 文章详情页、Project 列表页进行响应式改造，使移动端体验完整。

主要问题：

1. Blog 文章详情页（Posts.tsx）三栏布局的 PostsActions 和 TOC 只在 xl+ 显示，移动端完全没有这些功能
2. PostsCard 封面图在移动端单列时比例太扁（aspect-10/4）
3. Blog/Project 列表页 header→内容区间距移动端偏大
4. PostsCard 内边距和详情页标题字号需按规范调整
5. 代码块可能在移动端横向溢出

## 访谈确认结果

| 项目                   | 决策                                                  |
| ---------------------- | ----------------------------------------------------- |
| 文章详情页 Actions/TOC | 移动端（<xl）底部固定全宽工具栏 + TOC 底部 Sheet 抽屉 |
| 工具栏风格             | 类似现有 PostsActions 按钮风格，水平排列              |
| 工具栏显示时机         | 滚动一定距离后从底部滑入，回到顶部时滑出隐藏          |
| 工具栏断点             | xl 以下显示浮动栏，xl+ 保持现有侧边栏                 |
| 详情页容器间距         | 保持 mt-18 和 px-6（刻意差异化，不改）                |
| 详情页标题字号         | text-3xl sm:text-4xl lg:text-5xl（按规范缩小移动端）  |
| PostsCard 封面比例     | 移动端 aspect-video (16:9)，桌面端 aspect-10/4        |
| PostsCard 内边距       | px-4 py-3 sm:px-6（移动端缩小）                       |
| 代码块溢出             | overflow-x-auto scrollbar-none                        |
| 列表间距               | Blog/Project 统一 mt-12 sm:mt-20                      |
| Project 网格间距       | gap-y-10 sm:gap-y-16（移动端缩小纵向间距）            |
| Project hover          | 保持现状，不改动                                      |

---

## 改动清单

### 1. Blog 列表页 — Blog.tsx

**文件**：`src/views/blog/Blog.tsx`

- header→内容区间距：`mt-20` → `mt-12 sm:mt-20`

### 2. PostsCard 封面比例 + 内边距

**文件**：`src/views/blog/PostsCard.tsx`

- 封面图比例：`aspect-10/4` → `aspect-video sm:aspect-10/4`
- 卡片内容区内边距：`px-6 py-3` → `px-4 py-3 sm:px-6`

### 3. Blog 文章详情页 — Posts.tsx

**文件**：`src/views/blog/Posts.tsx`

#### 3a. 标题字号响应式

```
当前：text-4xl lg:text-5xl
改为：text-3xl sm:text-4xl lg:text-5xl
```

#### 3b. 代码块溢出处理

在 prose 容器的 className 中添加代码块溢出控制：

```
'prose-pre:overflow-x-auto prose-pre:scrollbar-none'
```

#### 3c. 移动端浮动工具栏（新组件）

**新增文件**：`src/views/blog/PostsFloatingBar.tsx`

- 客户端组件（'use client'）
- 仅在 `<xl` 显示（`xl:hidden`）
- `fixed bottom-0 inset-x-0` 全宽工具栏
- 视觉风格复用 PostsActions 的按钮样式（`dark:bg-secondary/80 border-border/50` 等）
- 容器背景：`bg-background/80 backdrop-blur border-t border-border`
- 按钮水平排列：返回 | 复制链接 | 分隔线 | TOC 目录 | 回到顶部
- 滚动超过 400px 后从底部滑入（framer-motion animate），回到顶部附近时滑出
- 复用 PostsActions 中已有的 copyLink 和 scrollToTop 逻辑
- 底部安全区域：`pb-[env(safe-area-inset-bottom)]`

#### 3d. TOC 底部 Sheet 抽屉

在 PostsFloatingBar 中集成：

- 使用现有 `Sheet` 组件（`@/components/ui`）
- `side="bottom"` 从底部弹出
- 复用 `PostsTableOfContents` 组件渲染目录内容
- 点击标题后自动关闭 Sheet 并滚动到对应位置

#### 3e. Posts.tsx 集成浮动工具栏

- 在 Posts.tsx 底部渲染 `<PostsFloatingBar headings={headings} />`
- PostsFloatingBar 需要接收 headings 数据用于 TOC 渲染

### 4. Project 列表页 — Project.tsx

**文件**：`src/views/project/Project.tsx`

- header→内容区间距：已有 `mt-16 sm:mt-20`，改为 `mt-12 sm:mt-20`
- 网格纵向间距：`gap-y-16` → `gap-y-10 sm:gap-y-16`

---

## 文件改动总览

| 文件                                  | 改动类型 | 改动项                             |
| ------------------------------------- | -------- | ---------------------------------- |
| `src/views/blog/Blog.tsx`             | 修改     | header→列表间距响应式              |
| `src/views/blog/PostsCard.tsx`        | 修改     | 封面比例 + 内边距响应式            |
| `src/views/blog/Posts.tsx`            | 修改     | 标题字号 + 代码块溢出 + 集成浮动栏 |
| `src/views/blog/PostsFloatingBar.tsx` | **新增** | 移动端浮动工具栏 + TOC 抽屉        |
| `src/views/project/Project.tsx`       | 修改     | 网格间距 + header→列表间距         |

不变的文件：

- `PostsActions.tsx` — 桌面端侧边栏保持不变
- `PostsTableOfContents.tsx` — 直接复用，不修改
- `ProjectCard.tsx` — hover 效果保持不变

---

## PostsFloatingBar 组件设计

```tsx
// src/views/blog/PostsFloatingBar.tsx
'use client'

interface PostsFloatingBarProps {
  headings: TocItem[]
}

// 核心逻辑：
// 1. useScroll 监听滚动位置，scrollY > 400 时 visible = true
// 2. framer-motion AnimatePresence 控制滑入/滑出动画
// 3. 按钮组：ArrowLeft(返回/blog) | Link(复制链接) | 分隔线 | ListTree(TOC) | ChevronUp(回顶部)
// 4. TOC 按钮点击 → 打开 Sheet(side="bottom")，内嵌 PostsTableOfContents
// 5. 通过 onHeadingClick 回调关闭 Sheet 并滚动

// DOM 结构：
// <div className="fixed inset-x-0 bottom-0 z-40 xl:hidden">
//   <div className="bg-background/80 backdrop-blur border-t border-border">
//     <div className="flex items-center justify-around px-4 py-2 pb-[env(safe-area-inset-bottom)]">
//       {buttons}
//     </div>
//   </div>
// </div>
```

---

## 验证步骤

1. `pnpm dev` — 无编译错误
2. `pnpm lint` — 无 lint 错误
3. Chrome DevTools 测试：
   - **375px Blog 列表**：PostsCard 封面 16:9 比例，内边距 px-4，header→列表间距缩小
   - **375px Blog 详情**：标题 text-3xl，代码块可横向滑动无滚动条，底部工具栏在滚动后出现
   - **375px TOC 抽屉**：点击目录按钮弹出底部 Sheet，选中标题后关闭并滚动
   - **375px Project**：纵向间距 gap-y-10 更紧凑
   - **768px+ Blog 详情**：标题 text-4xl，工具栏仍显示（<xl）
   - **1280px+ Blog 详情**：侧边栏 Actions + TOC 显示，浮动工具栏隐藏
   - **640px+ Blog 列表**：PostsCard 封面恢复 aspect-10/4，内边距 px-6
4. 测试复制链接功能在浮动栏中正常工作
5. 测试 TOC Sheet 中点击标题能正确滚动并关闭

所有改动完成。总结一下：

已修改的文件：

1. src/views/blog/Blog.tsx — header→列表间距：mt-20 → mt-12 sm:mt-20
2. src/views/blog/PostsCard.tsx — 封面比例：aspect-10/4 → aspect-video sm:aspect-10/4；内边距：px-6 → px-4 sm:px-6
3. src/views/blog/Posts.tsx — 标题字号：text-4xl lg:text-5xl → text-3xl sm:text-4xl lg:text-5xl；代码块溢出：添加
   prose-pre:overflow-x-auto prose-pre:scrollbar-none；集成 PostsFloatingBar
4. src/views/project/Project.tsx — header→列表间距：mt-16 → mt-12；网格间距：gap-y-16 → gap-y-10 sm:gap-y-16

新增文件：

5. src/views/blog/PostsFloatingBar.tsx — 移动端（<xl）浮动工具栏，包含返回/复制链接/TOC 目录/回顶部按钮，滚动 400px
   后从底部滑入，TOC 用 Sheet 底部抽屉展示

你可以 pnpm dev 启动后在 Chrome DevTools 375px 模式下验证效果。
