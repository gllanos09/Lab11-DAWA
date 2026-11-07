"use client"

import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { formatDate, fromISODate, toISODate } from "@/lib/dashboard-types"

interface DateFieldProps {
  id: string
  label: string
  value: string
  onChange: (iso: string) => void
  required?: boolean
  /** Permite elegir el año desde un desplegable (útil para fechas de nacimiento). */
  withYearDropdown?: boolean
}

export function DateField({
  id,
  label,
  value,
  onChange,
  required = false,
  withYearDropdown = false,
}: DateFieldProps) {
  const selected = fromISODate(value)

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            className="h-9 w-full justify-start font-normal"
          >
            <CalendarIcon data-icon="inline-start" />
            {value ? formatDate(value) : "Selecciona una fecha"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            defaultMonth={selected}
            captionLayout={withYearDropdown ? "dropdown" : "label"}
            startMonth={withYearDropdown ? new Date(1960, 0) : undefined}
            endMonth={withYearDropdown ? new Date(2035, 11) : undefined}
            onSelect={(date) => onChange(date ? toISODate(date) : "")}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
