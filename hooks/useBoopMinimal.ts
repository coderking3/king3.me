/* eslint-disable react-hooks-extra/no-direct-set-state-in-use-effect */
/*
这个钩子类似于 `useBoop`，但更底层。它没有用于设置样式的 API。
相反，它会根据 `isHovering` 状态返回一个 `isBooped` 值。
*/

import * as React from 'react'

export function useBoopMinimal(isHovering: boolean, timing = 150) {
  const [isBooped, setIsBooped] = React.useState(false)

  React.useEffect(() => {
    if (!isHovering) {
      return
    }

    setIsBooped(true)
  }, [isHovering])

  React.useEffect(() => {
    if (!isBooped) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setIsBooped(false)
    }, timing)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [isBooped, timing])

  return isBooped
}
