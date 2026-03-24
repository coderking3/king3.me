import type { FieldValues } from 'react-hook-form'

import type { ControlProps, TextareaControlConfig } from '../types'

import { Textarea } from '@/components/ui'

export function TextareaControl<TFV extends FieldValues>({
  field,
  fieldState,
  fieldOptions,
  componentProps
}: ControlProps<TFV, TextareaControlConfig>) {
  return (
    <Textarea
      {...field}
      {...componentProps}
      id={fieldOptions.name}
      disabled={fieldOptions.disabled}
      aria-invalid={fieldState.invalid}
    />
  )
}
