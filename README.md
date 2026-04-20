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

src/views/admin/Photos.tsx 需要添加一个编辑功能
src/views/admin/Poems.tsx 需要和src/views/admin/Photos.tsx 一样添加一个 date 属性
并且 这两个页面的 编辑弹窗 需要支持 date 属性的修改 datepicker组件文档看 .temp/docs/date-picker.md
需要在。src/components/Form/controls下新建一个date-picker 控件 需要封装一下
使用 AskUserQuestion 对我进行访谈，补充我容易忽略的细节 ，最后给我一个方案，我确认后  
再执行
