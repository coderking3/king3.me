# King3.me

个人博客与作品集网站，基于 Next.js 16 + React 19 + TypeScript 构建。

## 核心功能

### 首页

- [x] Hero 区域 + 打字机效果
- [x] 社交媒体链接（GitHub / YouTube / Bilibili / X / Email）
- [x] 图片画廊
- [x] 最新博客文章
- [x] 精选音乐侧边栏（随机播放列表）

### 博客

- [x] MDX 文章渲染（gray-matter + next-mdx-remote）
- [x] 文章列表页（双列网格布局）
- [x] 文章详情页（/blog/[slug]）
- [x] 目录导航 + 滚动定位
- [x] 代码高亮（Shiki / Catppuccin 主题）
- [x] 标签系统

### 项目展示

- [x] 项目卡片网格（3列）
- [x] 数据库驱动（Prisma）

### 留言墙

- [x] 登录后发送留言
- [x] 嵌套回复（线程式对话）
- [x] 管理员回复 / 删除

### 关于页

- [x] 个人简介与技术栈
- [x] "Explore More" 导航卡片（Photos / Poems / Uses 三个子页面入口）

### 管理后台（/admin）

- [x] 用户管理（角色 / 封禁 / 删除）
- [x] 留言管理（查看 / 回复 / 删除）
- [x] 项目管理（CRUD + 排序）
- [x] 播放列表管理（CRUD + 排序）
- [x] DataTable（排序 / 搜索 / 分页 / 列控制 / 拖拽排序 / 行展开）
- [x] 仪表盘首页（/admin）— 数据概览面板（统计卡片 + 近期数据摘要）

### 认证系统

- [x] Better-Auth + OAuth（Google / GitHub）
- [x] 会话管理
- [x] 管理员权限校验

### 基础设施

- [x] RSS 订阅（/feed.xml）
- [x] 深色 / 浅色主题切换
- [x] 响应式布局
- [x] React Compiler 启用

### Header

- [x] 导航栏 + 主题切换
- [x] 用户状态图标（Avatar + Badge + Dropdown）：未登录点击弹出登录弹窗，已登录显示头像 + 下拉菜单（用户信息 / 退出登录）
- [x] AuthModal 共享状态（Zustand），Header 与留言墙共用同一个登录弹窗
- [x] hover 缩放回弹动画（useInteractive + @react-spring/web）

## 待开发功能

- [ ] 照片页（/photos）— 路由已创建，内容待开发
- [ ] 诗歌页（/poems）— 路由已创建，内容待开发
- [ ] 装备页（/use）— 路由已创建，内容待开发
