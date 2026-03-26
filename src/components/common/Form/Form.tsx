/* eslint-disable no-console */
'use client'

import type { FieldValues } from 'react-hook-form'

import type { FormActionProps, FormProps } from './types'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useId, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button, Field, FieldGroup } from '@/components/ui'
import { cn } from '@/lib/utils'

import { FormField } from './FormField'

export function Form<TFV extends FieldValues>(props: FormProps<TFV>) {
  const {
    schema,
    defaultValues,
    fields,
    onSubmit,
    onError,
    onChange,
    renderActions,
    submitText = 'Submit',
    resetText = 'Reset',
    showReset = false,
    actionsPosition = 'inner',
    disabled,
    className,
    groupClassName,
    actionClassName
  } = props

  const formId = useId()

  const [submitting, setSubmitting] = useState(false)

  // Extract defaultValues from field definitions, field-level overrides global
  const fieldDefaultValues = useMemo(() => {
    const values = {} as Record<string, unknown>

    for (const field of fields) {
      if (field.defaultValue !== undefined) {
        values[String(field.name)] = field.defaultValue
      }
    }

    return values as Partial<TFV>
  }, [fields])

  const form = useForm<TFV>({
    ...(schema ? { resolver: zodResolver(schema as any) } : {}),
    defaultValues: {
      ...defaultValues,
      ...fieldDefaultValues
    } as any
  })

  // Subscribe to form value changes
  useEffect(() => {
    if (!onChange) return

    const subscription = form.watch((values) => {
      onChange(values as Partial<TFV>)
    })

    return () => subscription.unsubscribe()
  }, [form, onChange])

  const handleSubmit = async (values: TFV) => {
    console.log(`🚀 ~ values:`, values)
    setSubmitting(true)
    try {
      await onSubmit(values)
    } catch (error) {
      onError?.(error)
    } finally {
      setSubmitting(false)
    }
  }

  const isDisabled = disabled || submitting

  const actionProps: FormActionProps<TFV> = {
    form,
    formId,
    submitting,
    disabled: isDisabled
  }

  const defaultActions = (
    <Field
      orientation="horizontal"
      className={cn('mt-6 justify-end', actionClassName)}
    >
      {showReset && (
        <Button
          type="button"
          variant="outline"
          disabled={isDisabled}
          onClick={() => form.reset()}
        >
          {resetText}
        </Button>
      )}
      <Button type="submit" disabled={isDisabled}>
        {submitting ? 'Submitting...' : submitText}
      </Button>
    </Field>
  )

  const customActions = renderActions?.(actionProps)
  const isOuter = renderActions && actionsPosition === 'outer'

  return (
    <>
      <form
        id={formId}
        onSubmit={form.handleSubmit(handleSubmit)}
        className={className}
      >
        <FieldGroup className={groupClassName}>
          {fields.map((field) => (
            <FormField
              key={String(field.name)}
              config={field}
              form={form}
              disabled={isDisabled}
            />
          ))}
        </FieldGroup>
        {renderActions ? !isOuter && customActions : defaultActions}
      </form>
      {isOuter && customActions}
    </>
  )
}
