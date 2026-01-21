import type { InteractiveIconProps } from './Interactive'
import type { InteractionTrigger, SvgIcon } from './types'

import type { Recordable } from '@/types'

import Interactive from './Interactive'

const DEFAULT_ICON_PARAMS = ['size', 'color', 'strokeWidth'] as const
type DefaultIconParam = (typeof DEFAULT_ICON_PARAMS)[number]

interface IconParamsOptions<T> {
  include?: (keyof T)[]
  exclude?: DefaultIconParam[]
}

export function createInteractiveIcon<T extends SvgIcon>(
  IconComponent: (props: T) => React.ReactNode,
  trigger: InteractionTrigger | InteractionTrigger[] = 'hover',
  { include = [], exclude = [] }: IconParamsOptions<T> = {}
) {
  const initialParams: string[] = [...DEFAULT_ICON_PARAMS]
  const finalParamsSet = new Set<string>(
    initialParams
      .filter((p) => !exclude.includes(p as DefaultIconParam))
      .concat(include as string[])
  )

  return function InteractiveIcon(props: InteractiveIconProps<T>) {
    const iconProps = {} as Recordable
    const delegated = {} as Recordable

    Object.entries(props).forEach(([key, value]) => {
      if (finalParamsSet.has(key)) {
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
