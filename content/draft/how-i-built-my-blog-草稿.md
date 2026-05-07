# readme-king3-草稿

## 写作流程

### 1. 确定主题

要写的主题 大概点 后续再补充

- 从以前的旧博客 vitepass 重构到 nextjs
- 项目核心技术栈，以及选用nextjs的原因
- 内容管理
- 样式设计与 CSS 应用
- ......

### 2. 拟定标题

**标题**：我的 Next.js 个人博客搭建之路

### 3. 列大纲 ⭐

**最关键的一步**，大纲有了，写作就是填空。

```
1. 开头 — 我为什么要重新搭建个人博客？（动机：旧博客技术栈过时、性能差、功能单一）
   - 使用了 3 年多的 vitepass 博客，遇到了什么瓶颈
   - 为什么要选择 Next.js？它能解决什么问题
   - 这篇文章适合谁（想搭建个人博客的前端开发者）

2. 技术选型 — 为什么是 Next.js？
   - 对比：Next.js vs Gatsby vs Hugo vs WordPress
   - App Router vs Pages Router：我为什么选择 App Router
   - 核心技术栈一览（表格）
   - SSR/SSG/ISR 怎么选？我的实践

3. 项目初始化与架构设计
   - 从 npm create next-app 开始的完整配置
   - 目录结构设计（App Router 最佳实践）
   - TypeScript + ESLint + Prettier 整装流程
   - 【可选】代码规范与 Commit 规范

4. 内容管理 — 如何实现 MDX 博客？
   - 为什么选择 MDX（可交互的 Markdown）
   - 读取与解析 MDX 文件（front-matter、gray-matter）
   - 代码高亮（rehype-pretty-code + shiki）
   - 如何生成文章目录（Toc）
   - 【可选】图片处理优化

5. 样式设计与 UI 组件
   - Tailwind CSS v4 配置与主题定制
   - shadcn/ui 组件库的使用
   - 暗色模式实现（next-themes）
   - 响应式设计与移动端适配
   - 【可选】动画效果（Framer Motion）

6. 进阶功能实现
   - 国际化（i18next）— 中英文双语言
   - 认证系统（better-auth）— GitHub/Google 登录
   - 管理后台搭建 — 文章增删改查
   - 全局搜索（Command K）
   - RSS 订阅与 SEO 优化

7. 部署与持续集成
   - Vercel 一键部署
   - 环境变量管理
   - 【可选】CI/CD 配置
   - 性能优化与监控

8. 踩坑记录 — 我踩过的那些坑
   - 【填写：1-3 个印象深刻的报错/问题】

9. 总结 — 这套方案适合你吗？
   - 方案的优缺点分析
   - 哪些场景推荐使用
   - 后续迭代计划
   - 源代码与参考资源链接

```
