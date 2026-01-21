/* eslint-disable no-console */

import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

/**
 * 动画时长配置接口
 * 定义动画各个阶段的持续时间(单位:秒)
 */
interface AnimationDuration {
  /** 正向播放时长 */
  forwardDuration: number
  /** 暂停时长 */
  pauseDuration: number
  /** 倒放时长 */
  backwardDuration: number
  /** 间隔时长 */
  gapDuration: number
}

/**
 * 动画关键帧接口
 * 定义动画各个阶段在时间轴上的百分比位置
 */
interface AnimationKeyframes {
  /** 起始点: 0% */
  start: number
  /** 正向播放结束点 */
  forwardEnd: number
  /** 暂停结束点 */
  pauseEnd: number
  /** 倒放结束点 */
  backwardEnd: number
  /** 结束点: 100% */
  end: number
  /** 总时长(秒) */
  totalDuration: number
}

/**
 * CSS 动画状态接口
 * 定义动画不同状态下的 CSS 属性
 */
interface AnimationStates {
  /** 初始状态的 CSS 属性 */
  initial: string
  /** 完成状态的 CSS 属性 */
  complete: string
}

/**
 * 动画元素配置接口
 * 包含元素名称、动画名称和 CSS 状态
 */
interface AnimationElement {
  /** 元素类名 */
  className: string
  /** 动画名称 */
  animationName: string
  /** 动画状态 */
  states: AnimationStates
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const outputFilePath = resolve(__dirname, 'animation.module.css')

const {
  values: { output: isOutput }
} = parseArgs({
  options: {
    output: {
      type: 'boolean',
      short: 'o',
      default: false
    }
  }
})

/**
 * 默认动画时长配置
 * 遵循: 播放 → 暂停 → 倒放 → 间隔 的循环模式
 */
const ANIMATION_DURATION: AnimationDuration = {
  forwardDuration: 1.2, // 播放
  pauseDuration: 3, // 暂停
  backwardDuration: 1.2, // 倒放
  gapDuration: 0.05 // 间隔
} as const

/**
 * 定义 Logo 动画的各个元素配置
 */
const ANIMATION_ELEMENTS: AnimationElement[] = [
  {
    className: 'arrow-up',
    animationName: 'draw-arrow-up',
    states: {
      initial: 'clip-path: inset(0 100% 0 0);',
      complete: 'clip-path: inset(0 0 0 0);'
    }
  },
  {
    className: 'arrow-down',
    animationName: 'draw-arrow-down',
    states: {
      initial: 'clip-path: inset(0 0 0 100%);',
      complete: 'clip-path: inset(0 0 0 0);'
    }
  },
  {
    className: 'divider-line',
    animationName: 'draw-divider-line',
    states: {
      initial: 'clip-path: inset(0 50% 0 50%);',
      complete: 'clip-path: inset(0 0 0 0);'
    }
  }
]

/**
 * 四舍五入到指定小数位数
 * @param value - 需要四舍五入的数值
 * @param decimalPlaces - 保留的小数位数
 * @returns 四舍五入后的数值
 */
function roundToDecimal(value: number, decimalPlaces: number): number {
  const multiplier = 10 ** decimalPlaces
  return Math.round(value * multiplier) / multiplier
}

/**
 * 计算动画关键帧在时间轴上的百分比位置
 * @param duration - 动画时长配置对象
 * @returns 包含各关键帧百分比位置和总时长的对象
 *
 */
function calculateAnimationKeyframes(
  duration: AnimationDuration
): AnimationKeyframes {
  const { forwardDuration, pauseDuration, backwardDuration, gapDuration } =
    duration

  // 计算动画循环的总时长
  const totalDuration =
    forwardDuration + pauseDuration + backwardDuration + gapDuration

  // 计算各个阶段结束时的累计时间
  const forwardEndTime = forwardDuration
  const pauseEndTime = forwardEndTime + pauseDuration
  const backwardEndTime = pauseEndTime + backwardDuration

  // 将累计时间转换为百分比并四舍五入
  const keyframes: AnimationKeyframes = {
    start: 0,
    forwardEnd: roundToDecimal((forwardEndTime / totalDuration) * 100, 2),
    pauseEnd: roundToDecimal((pauseEndTime / totalDuration) * 100, 2),
    backwardEnd: roundToDecimal((backwardEndTime / totalDuration) * 100, 2),
    end: 100,
    totalDuration: roundToDecimal(totalDuration, 2)
  }

  return keyframes
}

/**
 * 生成 CSS @keyframes 动画代码
 * @param animationName - 动画名称(使用 kebab-case 命名)
 * @param keyframes - 关键帧百分比对象
 * @param states - 各状态的 CSS 属性
 * @returns 格式化的 CSS 代码字符串
 *
 */
function generateKeyframesCSS(
  animationName: string,
  keyframes: AnimationKeyframes,
  states: AnimationStates
): string {
  return `@keyframes ${animationName} {
  ${keyframes.start}% {
    ${states.initial}
  }

  ${keyframes.forwardEnd}% {
    ${states.complete}
  }

  ${keyframes.pauseEnd}% {
    ${states.complete}
  }

  ${keyframes.backwardEnd}% {
    ${states.initial}
  }

  ${keyframes.end}% {
    ${states.initial}
  }
}`
}

/**
 * 生成完整的动画 CSS 文件内容
 * @param keyframes - 关键帧配置
 * @param elements - 动画元素配置数组
 * @param timingFunction - 缓动函数
 * @returns 完整的 CSS 代码
 */
function generateAnimationCSS(
  keyframes: AnimationKeyframes,
  elements: AnimationElement[],
  timingFunction: string = 'ease-out'
): string {
  const keyframesCSS = elements
    .map((el) => generateKeyframesCSS(el.animationName, keyframes, el.states))
    .join('\n\n')

  const classCSS = elements
    .map(
      (el) => `.${el.className} {
  ${el.states.initial}
  animation: ${el.animationName} ${keyframes.totalDuration}s ${timingFunction} infinite;
}`
    )
    .join('\n\n')

  return `${keyframesCSS}\n\n${classCSS}`
}

function generateStyleModuleCSS() {
  // 使用默认配置计算关键帧
  const animationKeyframes = calculateAnimationKeyframes(ANIMATION_DURATION)

  console.log('========== 关键帧信息 ==========')
  console.log('关键帧百分比:', animationKeyframes)
  console.log(`动画总时长: ${animationKeyframes.totalDuration}秒`)

  // 生成完整的 CSS 代码
  const completeCSS = generateAnimationCSS(
    animationKeyframes,
    ANIMATION_ELEMENTS
  )

  console.log('\n========== 生成的完整 CSS ==========')
  console.log(completeCSS)

  // 如果指定了 output 参数，则将 CSS 写入文件
  if (isOutput) {
    try {
      writeFileSync(outputFilePath, completeCSS, 'utf-8')
      console.log('\n========== 文件写入成功 ==========')
      console.log(`CSS 文件已生成: ${outputFilePath}`)
    } catch (error) {
      console.error('\n========== 文件写入失败 ==========')
      console.error('错误信息:', error)
      process.exit(1)
    }
  } else {
    console.log('\n提示: 使用 --output 或 -o 参数可将 CSS 写入文件')
  }
}

generateStyleModuleCSS()
