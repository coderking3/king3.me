'use client'

import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button
} from '@/components/ui'

export default function Page() {
  const colors = [
    {
      name: 'Background',
      var: '--background',
      value: 'var(--background)',
      desc: 'Background：页面主背景色',
      usage: '用于页面、对话框、弹窗的底色'
    },
    {
      name: 'Foreground',
      var: '--foreground',
      value: 'var(--foreground)',
      desc: 'Foreground：主要文字颜色',
      usage: '标题、正文、导航链接等核心内容'
    },
    {
      name: 'Card',
      var: '--card',
      value: 'var(--card)',
      desc: 'Card：卡片背景色',
      usage: 'Bento 卡片、内容区块、面板背景'
    },
    {
      name: 'Card Foreground',
      var: '--card-foreground',
      value: 'var(--card-foreground)',
      desc: 'Card Foreground：卡片文字颜色',
      usage: '卡片内的标题、内容文本'
    },
    {
      name: 'Primary',
      var: '--primary',
      value: 'var(--primary)',
      desc: 'Primary：主要交互色',
      usage: '主按钮、关键操作、品牌强调元素'
    },
    {
      name: 'Primary Foreground',
      var: '--primary-foreground',
      value: 'var(--primary-foreground)',
      desc: 'Primary Foreground：主按钮文字',
      usage: 'Primary 按钮上的文字和图标'
    },
    {
      name: 'Secondary',
      var: '--secondary',
      value: 'var(--secondary)',
      desc: 'Secondary：次要背景色',
      usage: '次级按钮、标签、徽章背景'
    },
    {
      name: 'Secondary Foreground',
      var: '--secondary-foreground',
      value: 'var(--secondary-foreground)',
      desc: 'Secondary Foreground：次要文字',
      usage: 'Secondary 元素上的文字'
    },
    {
      name: 'Muted',
      var: '--muted',
      value: 'var(--muted)',
      desc: 'Muted：弱化背景色',
      usage: '提示框、引用块、禁用状态背景'
    },
    {
      name: 'Muted Foreground',
      var: '--muted-foreground',
      value: 'var(--muted-foreground)',
      desc: 'Muted Foreground：辅助文字',
      usage: '说明文本、时间戳、次要信息'
    },
    {
      name: 'Accent',
      var: '--accent',
      value: 'var(--accent)',
      desc: 'Accent：强调/悬停色',
      usage: 'Hover 状态、选中高亮、侧边栏激活'
    },
    {
      name: 'Accent Foreground',
      var: '--accent-foreground',
      value: 'var(--accent-foreground)',
      desc: 'Accent Foreground：强调文字',
      usage: 'Accent 背景上的文字'
    },
    {
      name: 'Destructive',
      var: '--destructive',
      value: 'var(--destructive)',
      desc: 'Destructive：危险/警示色',
      usage: '删除按钮、错误提示、警告标识'
    },
    {
      name: 'Destructive Foreground',
      var: '--destructive-foreground',
      value: 'var(--destructive-foreground)',
      desc: 'Destructive Foreground：警示文字',
      usage: '危险按钮上的文字'
    },
    {
      name: 'Border',
      var: '--border',
      value: 'var(--border)',
      desc: 'Border：边框颜色',
      usage: '卡片边框、分割线、输入框描边'
    },
    {
      name: 'Input',
      var: '--input',
      value: 'var(--input)',
      desc: 'Input：输入框边框',
      usage: '表单输入框、文本域的边框'
    },
    {
      name: 'Ring',
      var: '--ring',
      value: 'var(--ring)',
      desc: 'Ring：焦点环颜色',
      usage: '键盘聚焦时的外圈高亮'
    }
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="text-foreground mb-2 text-4xl font-bold">
            King3-me Bento 配色方案
          </h1>
          <p className="text-muted-foreground text-lg">
            极简风格 · 边框区分 · 动态背景适配 · 光明/黑暗主题
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {colors.map((color) => (
            <div
              key={color.var}
              className="group border-border bg-card hover:border-foreground cursor-pointer rounded-[0.875rem] border p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              onClick={() => copyToClipboard(color.value)}
            >
              <div
                className="border-border mb-4 h-24 w-full rounded-lg border"
                style={{ backgroundColor: color.value }}
              />

              <h3 className="text-card-foreground mb-1 text-base font-semibold">
                {color.name}
              </h3>

              <p className="text-muted-foreground mb-2 text-sm leading-snug font-medium">
                {color.desc}
              </p>

              <p className="text-muted-foreground mb-3 text-xs leading-relaxed opacity-75">
                {color.usage}
              </p>

              <code className="bg-secondary! text-accent-foreground block overflow-hidden rounded-md px-2 py-1.5 font-mono text-xs text-ellipsis whitespace-nowrap">
                {color.var}
              </code>

              <div className="text-muted-foreground mt-3 text-center text-xs opacity-60">
                点击复制 CSS 变量
              </div>
            </div>
          ))}
        </div>

        <div className="border-border bg-card rounded-[0.875rem] border p-8">
          <h2 className="text-card-foreground mb-6 text-2xl font-semibold">
            组件预览
          </h2>

          <div className="mb-6 space-y-4">
            <div>
              <h3 className="text-card-foreground mb-3 text-sm font-medium">
                按钮组件
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="bg-brand text-brand-foreground rounded-lg px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
                >
                  Brand Button
                </button>

                <button
                  type="button"
                  className="bg-primary text-primary-foreground rounded-lg px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
                >
                  Primary Button
                </button>

                <button
                  type="button"
                  className="bg-secondary text-secondary-foreground rounded-lg px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
                >
                  Secondary Button
                </button>

                <button
                  type="button"
                  className="bg-destructive text-destructive-foreground rounded-lg px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
                >
                  Destructive
                </button>

                <button
                  type="button"
                  className="border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors"
                >
                  Outline
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-card-foreground mb-3 text-sm font-medium">
                信息提示
              </h3>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground m-0 text-sm">
                  这是 Muted 背景上的辅助文字，用于次要信息展示
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-card-foreground mb-3 text-sm font-medium">
                表单输入
              </h3>
              <input
                type="text"
                placeholder="Input 示例 - 尝试聚焦查看 Ring 颜色"
                className="border-input bg-background text-foreground ring-offset-background focus-visible:ring-ring w-full rounded-lg border px-3.5 py-2.5 text-sm transition-shadow outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              />
            </div>

            <div>
              <h3 className="text-card-foreground mb-3 text-sm font-medium">
                卡片示例
              </h3>
              <div className="border-border bg-card rounded-lg border p-4">
                <h4 className="text-card-foreground mb-2 text-base font-semibold">
                  Bento 风格卡片
                </h4>
                <p className="text-muted-foreground text-sm">
                  卡片背景与页面背景同色，通过边框区分层次，营造简洁通透的视觉效果
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-card-foreground mb-3 text-sm font-medium">
                交互状态
              </h3>
              <div className="flex flex-wrap gap-3">
                <div className="bg-accent text-accent-foreground rounded-lg px-4 py-2 text-sm">
                  Hover/Active State
                </div>
                <div className="border-border rounded-lg border px-4 py-2 text-sm opacity-50">
                  Disabled State
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-card-foreground mb-3 text-sm font-medium">
                shadcn ui
              </h3>
              <div className="flex flex-wrap gap-3">
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button className="hover:bg-primary/80 transition-colors">
                      AlertDialog Open
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={() => toast('Event has been created', {})}
                  >
                    Default
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => toast.success('Event has been created')}
                  >
                    Success
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      toast.info(
                        'Be at the area 10 minutes before the event time'
                      )
                    }
                  >
                    Info
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      toast.warning(
                        'Event start time cannot be earlier than 8am'
                      )
                    }
                  >
                    Warning
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => toast.error('Event has not been created')}
                  >
                    Error
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      toast.promise<{ name: string }>(
                        () =>
                          new Promise((resolve) =>
                            setTimeout(() => resolve({ name: 'Event' }), 2000)
                          ),
                        {
                          loading: 'Loading...',
                          success: (data) => `${data.name} has been created`,
                          error: 'Error'
                        }
                      )
                    }}
                  >
                    Promise
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
