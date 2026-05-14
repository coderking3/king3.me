import type { FieldValues } from 'react-hook-form'

import type { ControlProps, InputControlConfig } from '../types'

import { Input } from '@/components/ui'

export function InputControl<TFV extends FieldValues>({
  field,
  fieldState,
  fieldOptions,
  componentProps
}: ControlProps<TFV, InputControlConfig>) {
  const { innerType, ...inputProps } = componentProps

  return (
    <Input
      {...field}
      {...inputProps}
      id={fieldOptions.name}
      type={innerType}
      disabled={fieldOptions.disabled}
      aria-invalid={fieldState.invalid}
    />
  )
}
