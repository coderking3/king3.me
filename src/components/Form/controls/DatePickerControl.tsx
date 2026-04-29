'use client'

import type { FieldValues } from 'react-hook-form'

import type { ControlProps, DatePickerControlConfig } from '../types'

import { format } from 'date-fns'

import { Calendar as CalendarIcon } from 'lucide-react'
import { useState } from 'react'

import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui'
import { cn } from '@/lib/utils'

function DropdownNav({
  children,
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div className={cn(className, 'flex-row-reverse')} {...props}>
      {children}
    </div>
  )
}

export function DatePickerControl<TFV extends FieldValues>({
  field,
  fieldState,
  fieldOptions
}: ControlProps<TFV, DatePickerControlConfig>) {
  const value = field.value as Date | undefined
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
        {value ? format(value, 'yyyy-MM-dd') : <span>Pick a date</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          startMonth={new Date(1900, 0)}
          endMonth={new Date()}
          selected={value}
          onSelect={(date) => {
            field.onChange(date)
            setOpen(false)
          }}
          components={{ DropdownNav }}
        />
      </PopoverContent>
    </Popover>
  )
}
