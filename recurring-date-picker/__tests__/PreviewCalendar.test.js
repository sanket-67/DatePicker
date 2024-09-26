import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { PreviewCalendar } from '../components/PreviewCalendar'
import { useDateStore } from '../lib/store'

jest.mock('../lib/store', () => ({
  useDateStore: jest.fn(),
}))

jest.mock('react-day-picker', () => ({
  DayPicker: ({ selected }) => (
    <div className="rdp">
      {selected.map(date => (
        <div key={date.toISOString()} className="rdp-day_selected">{date.getDate()}</div>
      ))}
    </div>
  ),
}))

describe('PreviewCalendar', () => {
  const mockStore = {
    startDate: new Date('2023-05-01'),
    endDate: new Date('2023-05-31'),
    recurrenceType: 'daily',
    interval: 1,
    selectedDays: [],
  }

  beforeEach(() => {
    useDateStore.mockImplementation(() => mockStore)
  })

  test('renders PreviewCalendar component', () => {
    const { container } = render(<PreviewCalendar />)
    expect(container.querySelector('.rdp')).toBeInTheDocument()
  })

  test('calculates daily recurrence correctly', () => {
    const { container } = render(<PreviewCalendar />)
    const selectedDates = container.querySelectorAll('.rdp-day_selected')
    expect(selectedDates.length).toBe(31) 
  })

  test('calculates weekly recurrence correctly', () => {
    mockStore.recurrenceType = 'weekly'
    mockStore.selectedDays = [1, 3, 5] 
    const { container } = render(<PreviewCalendar />)
    const selectedDates = container.querySelectorAll('.rdp-day_selected')
    expect(selectedDates.length).toBe(14) 
  })

  test('calculates monthly recurrence correctly', () => {
    mockStore.recurrenceType = 'monthly'
    mockStore.interval = 1
    const { container } = render(<PreviewCalendar />)
    const selectedDates = container.querySelectorAll('.rdp-day_selected')
    expect(selectedDates.length).toBe(1) 
  })
})