'use client'

import { useMemo } from 'react'
import { Calendar } from "./ui/calendar"
import { useDateStore } from '../lib/store'

export function PreviewCalendar() {
  const { startDate, endDate, recurrenceType, interval, selectedDays } = useDateStore()

  const previewDates = useMemo(() => {
    if (!startDate) return []

    const dates = []
    let currentDate = new Date(startDate)
    const endDateTime = endDate ? endDate.getTime() : currentDate.getTime() + 30 * 24 * 60 * 60 * 1000 // Default to 30 days if no end date

    while (currentDate.getTime() <= endDateTime) {
      switch (recurrenceType) {
        case 'daily':
          dates.push(new Date(currentDate))
          currentDate.setDate(currentDate.getDate() + interval)
          break
        case 'weekly':
          if (selectedDays.includes(currentDate.getDay())) {
            dates.push(new Date(currentDate))
          }
          currentDate.setDate(currentDate.getDate() + 1)
          break
        case 'monthly':
          dates.push(new Date(currentDate))
          currentDate.setMonth(currentDate.getMonth() + interval)
          break
        case 'yearly':
          dates.push(new Date(currentDate))
          currentDate.setFullYear(currentDate.getFullYear() + interval)
          break
      }
    }

    return dates
  }, [startDate, endDate, recurrenceType, interval, selectedDays])

  return (
    <Calendar
      mode="multiple"
      selected={previewDates}
      className="rounded-md border"
    />
  )
}