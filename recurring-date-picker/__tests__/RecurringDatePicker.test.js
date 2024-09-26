// __tests__/RecurringDatePicker.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecurringDatePicker from '../components/RecurringDatePicker';
import { useDateStore } from '../lib/store';

// Mock the dependencies
jest.mock('../lib/store', () => ({
  useDateStore: jest.fn(),
}));

jest.mock('../components/ui/calendar.js', () => ({
  Calendar: ({ onSelect }) => (
    <div data-testid="mock-calendar" onClick={() => onSelect(new Date())}>
      Mock Calendar
    </div>
  ),
}));

jest.mock('../components/ui/button', () => ({
  Button: ({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

jest.mock('../components/ui/select', () => ({
  Select: ({ children, onValueChange }) => (
    <select onChange={(e) => onValueChange(e.target.value)}>
      {children}
    </select>
  ),
  SelectContent: ({ children }) => <>{children}</>,
  SelectItem: ({ children, value }) => <option value={value}>{children}</option>,
  SelectTrigger: ({ children }) => <span>{children}</span>, 
  SelectValue: () => <div>Select Value</div>,
}));

jest.mock('../components/ui/input', () => ({
  Input: (props) => <input {...props} />,
}));

jest.mock('../components/ui/label', () => ({
  Label: ({ children }) => <label>{children}</label>,
}));

jest.mock('../components/PreviewCalendar', () => ({
  PreviewCalendar: () => <div data-testid="mock-preview-calendar">Preview Calendar</div>,
}));

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
  };

  beforeEach(() => {
    useDateStore.mockReturnValue(mockStore);
  });

  test('renders RecurringDatePicker component', () => {
    render(<RecurringDatePicker />);
    expect(screen.getByText('Recurring Date Picker')).toBeInTheDocument();
  });

  test('toggles end date calendar', () => {
    render(<RecurringDatePicker />);
    expect(screen.queryByText('End Date')).not.toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Add End Date'));
    expect(screen.getByText('End Date')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Remove End Date'));
    expect(screen.queryByText('End Date')).not.toBeInTheDocument();
  });

  test('changes recurrence type', () => {
    render(<RecurringDatePicker />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'weekly' } });
    expect(mockStore.setRecurrenceType).toHaveBeenCalledWith('weekly');
  });

  test('changes interval', () => {
    render(<RecurringDatePicker />);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '2' } });
    expect(mockStore.setInterval).toHaveBeenCalledWith(2);
  });

  test('toggles day selection for weekly recurrence', async () => {
    mockStore.recurrenceType = 'weekly';
    render(<RecurringDatePicker />);
    
    await waitFor(() => {
      expect(screen.getByText('Sun')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Mon'));
    expect(mockStore.toggleDay).toHaveBeenCalledWith(1);
  });

  test('selects start and end dates', async () => {
    render(<RecurringDatePicker />);
    
    // Click the calendar to select start date
    const calendars = screen.getAllByTestId('mock-calendar');
    fireEvent.click(calendars[0]); 
    expect(mockStore.setStartDate).toHaveBeenCalled();

    // Add end date and ensure a second calendar is rendered
    fireEvent.click(screen.getByText('Add End Date'));
    await waitFor(() => {
      const updatedCalendars = screen.getAllByTestId('mock-calendar');
      expect(updatedCalendars.length).toBeGreaterThan(1); 
      fireEvent.click(updatedCalendars[1]); 
      expect(mockStore.setEndDate).toHaveBeenCalled();
    });
  });

  test('renders preview calendar', () => {
    render(<RecurringDatePicker />);
    expect(screen.getByTestId('mock-preview-calendar')).toBeInTheDocument();
  });
});
