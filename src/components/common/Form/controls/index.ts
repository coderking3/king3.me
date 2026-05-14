import { DatePickerControl } from './DatePickerControl'
import { InputControl } from './InputControl'
import { SelectControl } from './SelectControl'
import { TextareaControl } from './TextareaControl'

export const controlMap = {
  input: InputControl,
  textarea: TextareaControl,
  select: SelectControl,
  date: DatePickerControl
} as const
