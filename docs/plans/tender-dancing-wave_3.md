# Admin 响应式改造方案

## Context

前台 (site) 页面的响应式改造已全部完成。现在需要对 Admin 后台进行响应式适配，使其在移动端（<768px）可用。Admin 主要使用 DataTable 展示数据，整体结构为 Sidebar + Header + 内容区。

---

## 访谈确认结果

| 项目                 | 决策                                  |
| -------------------- | ------------------------------------- |
| DataTable 移动端策略 | 水平滚动（overflow-x-auto）           |
| Admin Header 高度    | 移动端缩小为 h-12                     |
| 分页控件             | 保持原样                              |
| 工具栏（搜索+操作）  | 保持 flex-wrap，不额外调整            |
| 内容区间距           | 保持不变（px-4 py-4 md:py-6 lg:px-6） |
| 操作列               | 保持不变，随表格水平滚动              |
| 弹窗 Dialog          | 移动端全屏                            |
| Dashboard 统计卡片   | 保持 grid-cols-2                      |
| Sidebar              | 需要微调（间距/字号/底部用户区域）    |
| 滚动提示             | 不需要                                |

---

## 改动清单

### 1. Admin Header 高度响应式

**文件**：`src/layouts/admin/Header.tsx`

- 当前：`h-14` 固定
- 改为：`h-12 md:h-14`
- 同步更新 layout.tsx 中 `--header-height` CSS 变量

**文件**：`src/app/admin/layout.tsx`

- `'--header-height': '3.5rem'` → 不能用静态值了，改为在 Header 组件中通过 class 控制，或使用响应式 CSS 变量
- 方案：layout.tsx 去除 `--header-height` 静态变量，Header 直接用 class `h-12 md:h-14` 控制高度

### 2. DataTable 水平滚动

**文件**：`src/components/DataTable/DataTable.tsx`

在表格外层容器加 `overflow-x-auto`：

```
当前：<div className={cn('overflow-hidden rounded-md border', ...)}>
改为：<div className={cn('overflow-x-auto rounded-md border', ...)}>
```

### 3. Dialog 移动端全屏

**文件**：`src/components/ui/dialog.tsx` — `DialogContent` 组件

当前 DialogContent 样式：

```
fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl p-4 text-sm ring-1 sm:max-w-sm
```

移动端全屏改造：

- 移动端（<sm）：全屏模式，移除圆角和 ring，去掉 translate/居中定位
- sm+ ：保持现有居中弹窗样式

```
// 移动端默认全屏
'fixed inset-0 z-50 grid w-full gap-4 p-4 text-sm',
// sm+ 恢复居中弹窗
'sm:inset-auto sm:top-1/2 sm:left-1/2 sm:max-w-sm sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:ring-1 sm:ring-foreground/10 sm:max-w-[calc(100%-2rem)]',
```

注意：

- 移动端全屏时需要 `overflow-y-auto` 以防内容超出
- 移动端圆角改为 0（全屏），sm+ 恢复 `rounded-xl`
- DialogFooter 的 `-mx-4 -mb-4 rounded-b-xl` 在移动端全屏时需要适配（移除圆角）
- position 参数（'center' / 'top'）在移动端全屏时不生效，sm+ 时生效

### 4. Sidebar 微调

**文件**：`src/layouts/admin/Sidebar.tsx`

当前导航项样式：`px-3 py-5 text-base` — py-5 间距偏大

微调项：

- 导航项间距：`py-5` → `py-4`（稍微紧凑）
- 导航列表间距：`space-y-2` → `space-y-1`（减少项间距）
- Logo 区域与导航之间间距保持不变

### 5. StatCard 移动端内边距

**文件**：`src/views/admin/Dashboard.tsx`

当前 StatCard：`p-6`
改为：`p-4 md:p-6`（移动端缩小内边距）

当前数值字号：`text-3xl`
改为：`text-2xl md:text-3xl`（移动端缩小）

---

## 文件改动总览

| 文件                                     | 改动类型 | 改动项                            |
| ---------------------------------------- | -------- | --------------------------------- |
| `src/layouts/admin/Header.tsx`           | 修改     | 高度 h-12 md:h-14                 |
| `src/app/admin/layout.tsx`               | 修改     | --header-height 适配              |
| `src/components/DataTable/DataTable.tsx` | 修改     | overflow-hidden → overflow-x-auto |
| `src/components/ui/dialog.tsx`           | 修改     | 移动端全屏 DialogContent          |
| `src/layouts/admin/Sidebar.tsx`          | 修改     | 导航项间距微调                    |
| `src/views/admin/Dashboard.tsx`          | 修改     | StatCard 移动端内边距 + 字号      |

不变的文件：

- `DataTable/components/TableToolbar.tsx` — flex-wrap 已可自动换行
- `DataTable/components/TablePagination.tsx` — 保持原样
- `src/components/Modal/Modal.tsx` — 使用 DialogContent 的样式，自动受益于 Dialog 改造

---

## 验证步骤

1. `pnpm dev` — 无编译错误
2. `pnpm lint` — 无 lint 错误
3. Chrome DevTools 测试：
   - **375px Dashboard**：StatCard 2列 + 紧凑内边距，数值 text-2xl
   - **375px 表格页（Users/Projects/Messages/Playlist）**：表格可水平滚动，工具栏自动换行
   - **375px Header**：高度 h-12（48px），汉堡菜单可点击打开 Sidebar
   - **375px Sidebar**：导航项间距紧凑（py-4 + space-y-1），底部用户区域正常
   - **375px Dialog**：弹窗全屏展示，内容可滚动，Footer 正常显示
   - **768px+ Header**：高度恢复 h-14（56px）
   - **768px+ Dialog**：恢复居中弹窗样式
4. 测试所有 CRUD 操作在移动端全屏 Dialog 中正常工作
5. 测试 Sidebar offcanvas 打开/关闭无异常
