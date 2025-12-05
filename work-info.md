# 在岗信息登记表

## 个人基本信息

姓名: `王敏`

证件类型: `身份证`

证件号码: `4302223200405024513`

出生日期: `2004-05-02`

性别: `男`

国籍: `中国`

手机号: `19173313307`

最高学历: `专科`

## 教育经历

| 入学时间 | 毕业时间 | 毕业院校     | 专业           | 学历 | 学位 | 学历证明 |
| -------- | -------- | ------------ | -------------- | ---- | ---- | -------- |
| 2022-1   | 2024-6   | 长沙理工大学 | 计算机应用技术 | 专科 | 无   | 学信网   |

## 工作经历

| 开始日期 | 结束日期 | 工作单位 | 岗位名称 |
| -------- | -------- | -------- | -------- |
| 2022-6   | 2024     | Title    | Title    |

```tsx
// logo.tsx

'use client'

import * as style from './logo.module.css'

interface LogoProps {
  size?: number
}

const SIZE = 24
const STROKE_WIDTH = 1.5

function Logo({ size = SIZE }: LogoProps) {
  console.log(`🚀 ~ style:`, style)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={style['logo-animate']}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 12H17"
        stroke="currentColor"
        strokeWidth={STROKE_WIDTH}
        className={style['divider-line']}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.2882 3.25L2.59238 19.6487L2.00836 20.7501H3.25499H3.66804L11.3418 6.27864L12.0044 5.02909L12.667 6.27864L20.3408 20.7501H20.754H22.0006L21.4166 19.6487L12.7208 3.25H11.2882Z"
        fill="currentColor"
        className={style['arrow-up']}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.25499 3.25H3.66807L11.3418 17.7214L12.0044 18.9709L12.667 17.7214L20.3408 3.25H20.754H22.0006L21.4166 4.35136L12.7208 20.75H11.2881L2.59238 4.35136L2.00836 3.25H3.25499Z"
        fill="currentColor"
        className={style['arrow-down']}
      />
    </svg>
  )
}

export default Logo
```

```css
/* style.module.css */

/* 箭头从左边绘制的动画 */
@keyframes drawArrowUp {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}

/* 箭头从右边绘制的动画 */
@keyframes drawArrowDown {
  from {
    clip-path: inset(0 0 0 100%);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}

/* 分割线从中间向两边扩展的动画 */
@keyframes drawDividerLine {
  from {
    clip-path: inset(0 50% 0 50%);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}

.divider-line {
  animation: drawDividerLine 1.2s ease-out forwards;
  clip-path: inset(0 50% 0 50%);
}
.arrow-up {
  animation: drawArrowUp 1.2s ease-out forwards;
}
.arrow-down {
  animation: drawArrowDown 1.2s ease-out forwards;
}

.logo-animate:hover divider-line {
  animation: drawDividerLine 1.2s ease-out forwards;
}
.logo-animate:hover arrow-up {
  animation: drawArrowUp 1.2s ease-out forwards;
}
.logo-animate:hover arrow-down {
  animation: drawArrowDown 1.2s ease-out forwards;
}
```
