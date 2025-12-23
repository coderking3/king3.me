/* eslint-disable no-console */
/**
 * 计算动画关键帧百分比
 * @param {object} config - 动画配置
 * @param {number} config.forward - 正向播放时长（秒）
 * @param {number} config.pause - 暂停时长（秒）
 * @param {number} config.backward - 倒放时长（秒）
 * @param {number} config.gap - 间隔时长（秒）
 * @returns {object} 关键帧百分比对象
 */
function calculateKeyframes(config) {
  const { forward, pause, backward, gap } = config

  // 计算总时长
  const total = forward + pause + backward + gap

  // 计算各个关键帧的百分比
  const keyframes = {
    start: 0,
    forwardEnd: (forward / total) * 100,
    pauseEnd: ((forward + pause) / total) * 100,
    backwardEnd: ((forward + pause + backward) / total) * 100,
    end: 100,
    totalDuration: total
  }

  // 四舍五入到两位小数
  Object.keys(keyframes).forEach((key) => {
    if (key !== 'totalDuration') {
      keyframes[key] = Math.round(keyframes[key] * 100) / 100
    }
  })

  return keyframes
}

/**
 * 生成 CSS 动画关键帧代码
 * @param {string} animationName - 动画名称
 * @param {object} keyframes - 关键帧百分比对象
 * @param {object} states - 各状态的 CSS 属性
 * @returns {string} CSS 代码
 */
function generateKeyframeCSS(animationName, keyframes, states) {
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

// ========== 使用示例 ==========

// 配置动画时长
const animationConfig = {
  forward: 1.2, // 正向播放 1.2秒
  pause: 5, // 暂停 3秒
  backward: 1.2, // 倒放 1.2秒
  gap: 0.03 // 间隔 0.05秒 (50ms)
}

// 计算关键帧
const keyframes = calculateKeyframes(animationConfig)

console.log('关键帧百分比：', keyframes)
console.log(`总时长：${keyframes.totalDuration}秒`)

// 生成 arrow-up 的 CSS
const arrowUpCSS = generateKeyframeCSS('drawArrowUp', keyframes, {
  initial: 'clip-path: inset(0 100% 0 0);',
  complete: 'clip-path: inset(0 0 0 0);'
})

console.log('\n生成的 CSS：\n', arrowUpCSS)

// 生成 arrow-down 的 CSS
const arrowDownCSS = generateKeyframeCSS('drawArrowDown', keyframes, {
  initial: 'clip-path: inset(0 0 0 100%);',
  complete: 'clip-path: inset(0 0 0 0);'
})

console.log('\n', arrowDownCSS)

// 生成 divider-line 的 CSS
const dividerLineCSS = generateKeyframeCSS('drawDividerLine', keyframes, {
  initial: 'clip-path: inset(0 50% 0 50%);',
  complete: 'clip-path: inset(0 0 0 0);'
})

console.log('\n', dividerLineCSS)

// 生成完整的动画 CSS
console.log(`\n/* 完整的动画配置 */
.logo-animate .arrow-up {
  animation: drawArrowUp ${keyframes.totalDuration}s ease-out infinite;
  clip-path: inset(0 100% 0 0);
}

.logo-animate .arrow-down {
  animation: drawArrowDown ${keyframes.totalDuration}s ease-out infinite;
  clip-path: inset(0 0 0 100%);
}

.logo-animate .divider-line {
  animation: drawDividerLine ${keyframes.totalDuration}s ease-out infinite;
  clip-path: inset(0 50% 0 50%);
}`)
