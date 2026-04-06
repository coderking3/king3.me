# Message 页面改造方案

## Context

参考 `.temp/example/message-brand` 的样式，改造 `src/views/message/Message.tsx` 留言板页面。核心变化：输入区改为头像+textarea 横排布局，消息列表改为时间线样式，回复以缩进分支展示，时间改为相对时间。不支持 Markdown 渲染。

---

## 访谈确认结果

| 项目       | 决策                                                         |
| ---------- | ------------------------------------------------------------ |
| 输入区风格 | 只参考布局（头像+textarea 横排），不要渐变/纹理/光晕         |
| 输入区卡片 | 微弱背景填充 + 简单边框：`bg-muted/50 rounded-xl border`     |
| Textarea   | 用现有 `Textarea` 组件，自定义样式去掉边框                   |
| 底部栏     | 参考 example：字符计数 + 图标发送按钮，输入为空时隐藏        |
| 快捷键     | Cmd+Enter / Ctrl+Enter 发送                                  |
| 消息列表   | 时间线样式：头像间竖线连接                                   |
| 回复展示   | 右侧缩进嵌套，用 border-l 分支线连接                         |
| 头像样式   | ring-2 边框（ring-background 色），竖线用 border-border 颜色 |
| 时间格式   | 相对时间（原生 `Intl.RelativeTimeFormat`，英文）             |
| 发送动画   | 不需要，保持 toast 提示                                      |
| 登录按钮   | 保持现有样式                                                 |
| 标题描述   | 保持现有                                                     |
| 组件拆分   | 拆分为 MessageInput + MessageList 子组件                     |

---

## 文件改动清单

### 1. 新增 `src/lib/date.ts` — 相对时间工具函数

用原生 `Intl.RelativeTimeFormat` 实现 `relativeTime(date)` 函数，返回如 "3 days ago"、"just now" 等英文相对时间。

### 2. 拆分组件

**现有**：`src/views/message/Message.tsx`（单文件 176 行）

**拆分为**：

| 文件               | 职责                                           |
| ------------------ | ---------------------------------------------- |
| `Message.tsx`      | 主页面壳：header + 条件渲染 input/login + list |
| `MessageInput.tsx` | 输入区：头像+textarea 横排卡片                 |
| `MessageList.tsx`  | 时间线消息列表 + 回复分支                      |

### 3. `MessageInput.tsx` — 输入区改造

**布局**：

```
┌─ bg-muted/50 rounded-xl border ─────────┐
│ [头像]  │ Say something...               │
│ 8~10px  │                                │
│         │                  [123/600]  ✈️  │
└──────────────────────────────────────────┘
```

- 外层：`bg-muted/50 rounded-xl border border-border p-3 md:p-4 flex items-start gap-3`
- 头像：`size-8 md:size-10 rounded-full`，从 session.user.image 获取
- Textarea：现有 `Textarea` 组件 + 自定义 class 去掉边框和 ring（`border-0 bg-transparent shadow-none focus-visible:ring-0 min-h-0 resize-none`）
- 底部栏（`AnimatePresence` 包裹，输入为空时隐藏）：
  - 字符计数：`{length}/600`，超 600 变红
  - 发送按钮：`SendHorizontal` 图标（lucide-react），`motion.button` 带 whileHover/whileTap 缩放
- `onKeyDown`：Cmd+Enter (Mac) / Ctrl+Enter (Win) 触发发送
- MAX_LENGTH = 600

### 4. `MessageList.tsx` — 时间线样式

**主消息结构**：

```
│
●  UserA              3 days ago
│  This is a message
│
│     ● Admin          2 days ago
│     │ This is a reply
│     ● Admin          yesterday
│       Another reply
│
●  UserB              5 hours ago
│  Another message
```

实现要点：

- `<ul role="list">`，每条消息为 `<li className="relative pb-8">`
- **竖线**：`<span>` absolute 定位，`left-5 top-12 h-[calc(100%-3.5rem)] w-0.5 rounded bg-border`，最后一条不显示
- **头像**：`size-10 rounded-full ring-2 ring-background`（ring-background 让头像视觉上"断开"竖线）
- **用户名+时间**：横排，用户名 `font-bold text-sm`，时间 `text-xs opacity-40`（relativeTime）
- **消息文本**：`pl-[3.25rem]`（与用户名对齐，头像宽度 + gap）
- **回复区**：`ml-[3.25rem] mt-2 border-l-2 border-border pl-4 space-y-3`
  - 小头像 `size-6 rounded-full ring-2 ring-background`
  - 用户名 + 时间 + 消息文本
- **入场动画**：`<Animated preset={{ mode: 'fadeInUp', delay: 0.12 + idx * 0.04 }}>`

### 5. `Message.tsx` — 主页面壳

```tsx
<header>
  <Animated preset="fadeInUp"><h1>{title}</h1></Animated>
  <Animated preset={{ mode: 'fadeInUp', delay: 0.06 }}><p>{description}</p></Animated>
</header>

<div className="mt-16 sm:mt-20">
  <div className="max-w-2xl">
    {isLoggedIn ? <MessageInput session={session} /> : <LoginButton />}
  </div>
  {messages.length > 0 && <MessageList messages={messages} />}
</div>
```

- session/auth 逻辑保留在 Message.tsx
- 发送逻辑（handleSend、text state、sending state）移入 MessageInput
- `MessageList` 接收 `messages` prop

### 6. `index.ts` — 不变

barrel export 保持：`export { description, default as MessagePage, title } from './Message'`

---

## 文件改动总览

| 文件                                 | 操作 | 说明                      |
| ------------------------------------ | ---- | ------------------------- |
| `src/lib/date.ts`                    | 新建 | `relativeTime()` 工具函数 |
| `src/views/message/Message.tsx`      | 重写 | 精简为页面壳              |
| `src/views/message/MessageInput.tsx` | 新建 | 头像+textarea 横排输入区  |
| `src/views/message/MessageList.tsx`  | 新建 | 时间线消息列表            |
| `src/views/message/index.ts`         | 不变 | barrel export             |

---

## 验证步骤

1. `pnpm dev` — 无编译错误
2. `pnpm lint` — 无 lint 错误
3. 浏览器测试：
   - **未登录**：显示 "Please log in" 按钮
   - **登录后**：头像 + textarea 横排卡片，输入文字后底部栏出现
   - **字符计数**：输入时显示 `n/600`，超 600 变红
   - **发送**：点击图标或 Cmd+Enter 发送，成功 toast + 清空
   - **时间线**：头像间竖线连接，ring-2 边框
   - **回复**：缩进 + border-l-2 分支
   - **相对时间**：显示 "3 days ago"、"just now" 等
   - **动画**：header fadeInUp + 列表 stagger
   - **移动端**（375px）：头像缩小，布局不溢出
