import type { InteractiveIconProps } from './Interactive'
import type { InteractionTrigger, SvgIcon } from './types'

import type { Recordable } from '@/types'

import Interactive from './Interactive'

const DEFAULT_ICON_PARAMS = ['size', 'color', 'strokeWidth'] as const

export function createInteractiveIcon<T extends SvgIcon>(
  IconComponent: (props: T) => React.ReactNode,
  trigger: InteractionTrigger | InteractionTrigger[] = 'hover',
  additionalParams: string[] = []
) {
  const allIconParams = [...DEFAULT_ICON_PARAMS, ...additionalParams]

  return function InteractiveIcon(props: InteractiveIconProps<T>) {
    const iconProps = {} as Recordable
    const delegated = {} as Recordable

    Object.entries(props).forEach(([key, value]) => {
      if (allIconParams.includes(key)) {
        iconProps[key] = value
      } else {
        delegated[key] = value
      }
    })

    return (
      <Interactive {...delegated} trigger={trigger}>
        {(state) => <IconComponent {...(iconProps as T)} {...state} />}
      </Interactive>
    )
  }
}
