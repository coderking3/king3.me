'use client'

import type { FieldValues, Path } from 'react-hook-form'

import type {
  CustomFieldConfig,
  FieldOptions,
  FieldWrapperProps,
  FormFieldProps
} from './types'

import { Controller } from 'react-hook-form'

import { Field, FieldDescription, FieldError, FieldLabel } from '../../ui'
import { controlMap } from './controls'

export function FormField<TFV extends FieldValues>({
  config,
  form,
  disabled
}: FormFieldProps<TFV>) {
  const {
    name,
    label,
    description,
    disabled: fieldDisabled,
    defaultValue: _,
    type = 'input',
    ...componentProps
  } = config

  const fieldOptions: FieldOptions<TFV> = {
    name,
    label,
    description,
    disabled: disabled || fieldDisabled
  }

  // Fully custom rendering, bypass Controller wrapper
  if (type === undefined) {
    const { render, custom } = config as CustomFieldConfig<TFV>

    if (custom === 'controller') {
      return <>{render({ form, fieldOptions })}</>
    }
  }

  return (
    <Controller
      name={fieldOptions.name as Path<TFV>}
      control={form.control}
      render={({ field, fieldState }) => {
        const invalid = fieldState.invalid

        // Custom field rendering
        if (type === undefined) {
          const { render, custom } = config as CustomFieldConfig<TFV>
          const rendered = render({ form, field, fieldState, fieldOptions })

          if (custom === 'field') return <>{rendered}</>

          return (
            <FieldWrapper
              fieldOptions={fieldOptions}
              invalid={invalid}
              error={fieldState.error}
            >
              {rendered}
            </FieldWrapper>
          )
        }

        // Built-in control from registry
        const Control = controlMap[type as keyof typeof controlMap]
        if (!Control) return <></>

        return (
          <FieldWrapper
            fieldOptions={fieldOptions}
            invalid={invalid}
            error={fieldState.error}
          >
            <Control
              field={field}
              fieldState={fieldState}
              fieldOptions={fieldOptions}
              componentProps={componentProps as any}
            />
          </FieldWrapper>
        )
      }}
    />
  )
}

export function FieldWrapper<TFV extends FieldValues>({
  fieldOptions,
  invalid,
  error,
  children
}: FieldWrapperProps<TFV>) {
  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={fieldOptions.name}>{fieldOptions.label}</FieldLabel>
      {children}
      {fieldOptions.description && (
        <FieldDescription>{fieldOptions.description}</FieldDescription>
      )}
      {invalid && <FieldError errors={[error]} />}
    </Field>
  )
}
