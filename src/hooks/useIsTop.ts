import { useMotionValueEvent, useScroll } from 'framer-motion'
import { useState } from 'react'

/**
 * 是否处于页面顶部
 * @param threshold 允许的偏移阈值（px），默认 0
 */
export function useIsTop(threshold = 0) {
  const { scrollY } = useScroll()
  const [isTop, setIsTop] = useState(() => scrollY.get() <= threshold)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const isAtTop = latest <= threshold

    setIsTop((prev) => {
      if (prev !== isAtTop) return isAtTop
      return prev
    })
  })

  return isTop
}
