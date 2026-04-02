import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormReturn
} from 'react-hook-form'
import type { z } from 'zod/v4'

/* --- Base --- */

interface BaseFieldConfig<TFV extends FieldValues> {
  name: Path<TFV>
  label: string
  description?: string
  disabled?: boolean
  defaultValue?: any
}

type BaseFieldAttr = keyof BaseFieldConfig<FieldValues>

export interface FieldOptions<TFV extends FieldValues> extends Omit<
  BaseFieldConfig<TFV>,
  'defaultValue' | 'name'
> {
  name: string
}

/* --- Built-in controls --- */

export interface InputControlConfig extends Omit<
  React.ComponentProps<'input'>,
  BaseFieldAttr | 'type'
> {
  innerType?: React.ComponentProps<'input'>['type']
}

export interface InputFieldConfig<TFV extends FieldValues>
  extends BaseFieldConfig<TFV>, InputControlConfig {
  type: 'input'
}

export interface TextareaControlConfig extends Omit<
  React.ComponentProps<'textarea'>,
  BaseFieldAttr
> {}

export interface TextareaFieldConfig<TFV extends FieldValues>
  extends BaseFieldConfig<TFV>, TextareaControlConfig {
  type: 'textarea'
}

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface SelectControlConfig {
  options: SelectOption[]
  placeholder?: string
  className?: string
  size?: 'sm' | 'default'
  alignItemWithTrigger?: boolean
  /** What to display in the trigger after selection: 'label' (default) or 'value' */
  display?: 'label' | 'value'
}

export interface SelectFieldConfig<TFV extends FieldValues>
  extends BaseFieldConfig<TFV>, SelectControlConfig {
  type: 'select'
}

/* --- Custom field --- */

interface CustomControlFieldConfig<
  TFV extends FieldValues
> extends BaseFieldConfig<TFV> {
  type?: never
  custom?: undefined | 'field'
  render: (props: {
    form: UseFormReturn<TFV>
    field: ControllerRenderProps<TFV, Path<TFV>>
    fieldState: ControllerFieldState
    fieldOptions: FieldOptions<TFV>
  }) => React.ReactNode
}

interface CustomControllerFieldConfig<
  TFV extends FieldValues
> extends BaseFieldConfig<TFV> {
  type?: never
  custom: 'controller'
  render: (props: {
    form: UseFormReturn<TFV>
    fieldOptions: FieldOptions<TFV>
  }) => React.ReactNode
}

export type CustomFieldConfig<TFV extends FieldValues> =
  | CustomControlFieldConfig<TFV>
  | CustomControllerFieldConfig<TFV>

/* --- Field config union --- */

export type FormFieldConfig<TFV extends FieldValues> =
  | InputFieldConfig<TFV>
  | TextareaFieldConfig<TFV>
  | SelectFieldConfig<TFV>
  | CustomFieldConfig<TFV>

/* --- Control props --- */

export interface ControlProps<
  TFV extends FieldValues,
  TConfig = BaseFieldConfig<TFV>
> {
  field: ControllerRenderProps<TFV, Path<TFV>>
  fieldState: ControllerFieldState
  fieldOptions: FieldOptions<TFV>
  componentProps: Omit<TConfig, BaseFieldAttr | 'type'>
}

/* --- FormField props --- */

export interface FormFieldProps<TFV extends FieldValues> {
  config: FormFieldConfig<TFV>
  form: UseFormReturn<TFV>
  disabled?: boolean
}

export interface FieldWrapperProps<TFV extends FieldValues> {
  fieldOptions: FieldOptions<TFV>
  invalid: boolean
  error?: ControllerFieldState['error']
  children: React.ReactNode
}

/* --- Form props --- */

export interface FormActionProps<TFV extends FieldValues> {
  form: UseFormReturn<TFV>
  formId: string
  submitting: boolean
  disabled: boolean
}

export interface FormProps<TFV extends FieldValues> {
  schema?: z.ZodType<TFV>
  defaultValues?: Partial<TFV>
  fields: FormFieldConfig<TFV>[]

  onSubmit: (values: TFV) => void | Promise<void>
  onError?: (error: unknown) => void
  onChange?: (values: Partial<TFV>) => void

  /** Override default submit/reset buttons */
  renderActions?: (props: FormActionProps<TFV>) => React.ReactNode
  submitText?: string
  resetText?: string
  showReset?: boolean
  /** Where to render custom actions. Default: 'inner' */
  actionsPosition?: 'inner' | 'outer'

  disabled?: boolean
  className?: string
  groupClassName?: string
  actionClassName?: string
}
