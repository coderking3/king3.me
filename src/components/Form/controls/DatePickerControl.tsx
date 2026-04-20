'use client'

import type { FieldValues } from 'react-hook-form'

import type { ControlProps, DatePickerControlConfig } from '../types'

import { formatDate } from 'kedash'
import { Calendar as CalendarIcon } from 'lucide-react'

import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui'
import { cn } from '@/lib/utils'

export function DatePickerControl<TFV extends FieldValues>({
  field,
  fieldState,
  fieldOptions
}: ControlProps<TFV, DatePickerControlConfig>) {
  const value = field.value as Date | undefined

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            id={fieldOptions.name}
            variant="outline"
            data-empty={!value}
            disabled={fieldOptions.disabled}
            aria-invalid={fieldState.invalid}
            className={cn(
              'w-full justify-start text-left font-normal',
              'data-[empty=true]:text-muted-foreground'
            )}
          />
        }
      >
        <CalendarIcon className="mr-2 size-4" />
        {value ? formatDate(value, 'yyyy-MM-dd') : <span>Pick a date</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => field.onChange(date)}
        />
      </PopoverContent>
    </Popover>
  )
}
