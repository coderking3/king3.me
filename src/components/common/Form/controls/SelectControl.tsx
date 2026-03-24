import type { FieldValues } from 'react-hook-form'

import type { ControlProps, SelectControlConfig } from '../types'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui'

export function SelectControl<TFV extends FieldValues>({
  field,
  fieldOptions,
  fieldState,
  componentProps
}: ControlProps<TFV, SelectControlConfig>) {
  const {
    className,
    placeholder,
    options,
    size,
    alignItemWithTrigger = false,
    display = 'label'
  } = componentProps

  const displayText =
    display === 'value'
      ? field.value
      : (options.find((o) => String(o.value) === String(field.value))?.label ??
        field.value)

  return (
    <Select
      name={field.name}
      onValueChange={field.onChange}
      disabled={fieldOptions.disabled}
    >
      <SelectTrigger
        size={size}
        aria-invalid={fieldState.invalid}
        className={className}
      >
        <SelectValue placeholder={placeholder}>
          {field.value != null && displayText}
        </SelectValue>
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={alignItemWithTrigger}>
        {/* <SelectItem value="auto">Auto</SelectItem> */}
        {/* <SelectSeparator /> */}
        {options.map(({ label, value, disabled }) => (
          <SelectItem key={value} value={value} disabled={disabled}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
