import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import RecurringDatePicker from '../components/RecurringDatePicker'
import { useDateStore } from '../lib/store'

jest.mock('../components/ui/calendar', () => ({
  Calendar: () => <div data-testid="mock-calendar" />
}))

jest.mock('../components/ui/button', () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>
}))

jest.mock('../components/ui/select', () => ({
  Select: ({ children, onValueChange }) => <div onClick={() => onValueChange('weekly')}>{children}</div>,
  SelectContent: ({ children }) => <div>{children}</div>,
  SelectItem: ({ children }) => <div>{children}</div>,
  SelectTrigger: ({ children }) => <div>{children}</div>,
  SelectValue: () => <div data-testid="select-value" />
}))

jest.mock('../components/ui/input', () => ({
  Input: (props) => <input {...props} />
}))

jest.mock('../components/ui/label', () => ({
  Label: ({ children, htmlFor }) => <label htmlFor={htmlFor}>{children}</label>
}))

jest.mock('../lib/store', () => ({
  useDateStore: jest.fn()
}))

describe('RecurringDatePicker', () => {
  const mockStore = {
    startDate: new Date('2023-05-01'),
    endDate: null,
    recurrenceType: 'daily',
    interval: 1,
    selectedDays: [],
    setStartDate: jest.fn(),
    setEndDate: jest.fn(),
    setRecurrenceType: jest.fn(),
    setInterval: jest.fn(),
    toggleDay: jest.fn(),
  }

  beforeEach(() => {
    useDateStore.mockImplementation(() => mockStore)
  })

  test('renders RecurringDatePicker component', () => {
    render(<RecurringDatePicker />)
    expect(screen.getByText('Recurring Date Picker')).toBeInTheDocument()
  })

  test('toggles end date calendar', () => {
    render(<RecurringDatePicker />)
    const addEndDateButton = screen.getByText('Add End Date')
    fireEvent.click(addEndDateButton)
    expect(screen.getByText('End Date')).toBeInTheDocument()
    fireEvent.click(addEndDateButton)
    expect(screen.queryByText('End Date')).not.toBeInTheDocument()
  })

  test('changes recurrence type', () => {
    render(<RecurringDatePicker />)
    const recurrenceTypeSelect = screen.getByTestId('select-value')
    fireEvent.click(recurrenceTypeSelect)
    expect(mockStore.setRecurrenceType).toHaveBeenCalledWith('weekly')
  })

  test('changes interval', () => {
    render(<RecurringDatePicker />)
    const intervalInput = screen.getByLabelText('Every')
    fireEvent.change(intervalInput, { target: { value: '2' } })
    expect(mockStore.setInterval).toHaveBeenCalledWith(2)
  })

  test('toggles day selection for weekly recurrence', () => {
    mockStore.recurrenceType = 'weekly'
    render(<RecurringDatePicker />)
    const mondayButton = screen.getByText('Mon')
    fireEvent.click(mondayButton)
    expect(mockStore.toggleDay).toHaveBeenCalledWith(1)
  })
})